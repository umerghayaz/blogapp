using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using blogapp.Models;
using blogapp.Services;
using blogapp.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices; // For FormattableStringFactory (Option 1)
      // "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=MyDatabase;Trusted_Connection=True;TrustServerCertificate=True;"

namespace blogapp.Controllers
{
    [ApiController]
    [Route("api/posts")]
    public class PostController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PostController(AppDbContext context)
        {

            _context = context;
        }

        [HttpPost]
        [Authorize(Policy = "CreateUser")] // Assuming CreateUser permission allows post creation
        public async Task<IActionResult> CreatePost([FromBody] PostCreateRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

                var sql = @"
                    INSERT INTO posts 
                        (title, content, authorId, categories, featuredImage,isApproved,Views,ApproverId, createdAt, updatedAt)
                    VALUES 
                        ({0}, {1}, {2}, {3}, {4},{5},{6},{7}, GETUTCDATE(), GETUTCDATE())
                ";

                await _context.Database.ExecuteSqlRawAsync(
                    sql,
                    request.Title,
                    request.Content,
                    userId,
                    request.Categories,
                    request.FeaturedImage,
                    request.IsApproved ?? false,
                    request.Views ?? 0,
                    request.ApproverId
                );

                // Get the last inserted ID (SQL Server specific)
                var postId = await _context.Posts
                    .OrderByDescending(p => p.Id)
                    .Select(p => p.Id)
                    .FirstOrDefaultAsync();
                return Ok(new { message = "Posts Created" });

                // return CreatedAtAction(nameof(GetPost), new { id = postId }, new { message = "Post created", postId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the post", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "ReadUser")]
        public async Task<IActionResult> GetPost(int id) 
        {
            try 
            {
                var sql = $@"
            SELECT posts.*, 
                   author.id AS AuthorIdFromJoin, 
                   author.username AS AuthorName, 
                   approver.id AS ApproverIdFromJoin, 
                   approver.username AS ApproverName
            FROM posts
            LEFT JOIN users AS author ON author.id = posts.authorId
            LEFT JOIN users AS approver ON approver.id = posts.approverId
            WHERE posts.id = {{0}}";

                var post = await _context.Database
                    .SqlQuery<PostWithDetailsDto>(FormattableStringFactory.Create(sql, id))
                    .FirstOrDefaultAsync();
                if (post == null)
                {
                    return StatusCode(404, new { message = "No Post Found" });
                }
                else
                {
                    return StatusCode(200, new { post = post });
                }
                ;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the user.", error = ex.Message });
            }
        }

        [HttpGet]
        [AllowAnonymous] // Publicly accessible published posts
        public async Task<IActionResult> GetAllPosts()
        {
            try
            {
                var sql = @"
                SELECT posts.*, 
                author.id AS AuthorIdFromJoin, 
                author.username AS AuthorName, 
                approver.id AS ApproverIdFromJoin, 
                approver.username AS ApproverName
            FROM posts
            LEFT JOIN users AS author ON author.id = posts.authorId
            LEFT JOIN users AS approver ON approver.id = posts.approverId
                    ";

            var posts = await _context.Database
            .SqlQuery<PostWithDetailsDto>(FormattableStringFactory.Create(sql))
            .ToListAsync();
                return Ok(new { message = "Posts retrieved", posts });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while retrieving posts", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "UpdateUser")]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] PostUpdateRequest request)
        {
              try
            {
                Console.WriteLine(request);
                if (request == null)
                    return BadRequest(new { message = "Invalid user data." });
                // Try to find the existing request
                var existingPost = await _context.Posts.FirstOrDefaultAsync(u => u.Id == id);

                if (existingPost == null)
                    return NotFound(new { message = $"No request found with ID {id}. Please check the ID and try again." });

                if (!string.IsNullOrEmpty(request.Title))
                {
                    existingPost.Title = request.Title;
                }
                if (!string.IsNullOrEmpty(request.Content))
                {
                    existingPost.Content = request.Content;
                }
                if (!string.IsNullOrEmpty(request.Categories))
                {
                    existingPost.Categories = request.Categories;
                }
                 if (!string.IsNullOrEmpty(request.FeaturedImage))
                {
                    existingPost.FeaturedImage = request.FeaturedImage;
                }
                 if (!string.IsNullOrEmpty(request.Status))
                {
                    existingPost.Status = request.Status;
                }
                if (request.ApproverId != 0)
                {
                    existingPost.ApproverId = request.ApproverId;
                }

                if (!string.IsNullOrEmpty(request.Categories))
                {
                    existingPost.Categories = request.Categories;
                }
                if (request.IsApproved){
                    existingPost.IsApproved = request.IsApproved;
                }
                
                await _context.SaveChangesAsync();

                return Ok(new { message = " Post Updated Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the post.", error = ex.Message });
            }
        }

       [HttpDelete("{id}")]
[Authorize(Policy = "DeleteUser")]
public async Task<IActionResult> DeletePost(int id)
{
var postEntity = await _context.Posts
    .IgnoreQueryFilters() // Only if soft delete is in place
    .FirstOrDefaultAsync(p => p.Id == id);

if (postEntity == null)
    return NotFound(new { message = "Post not found" });

try
{
    
    _context.Posts.Remove(postEntity);
    await _context.SaveChangesAsync();
    await _context.Database.ExecuteSqlRawAsync("DELETE FROM posts WHERE Id = {0}", id);
    return Ok(new { message = "Post deleted successfully" });
}
catch (DbUpdateException ex)
{
    // Handle database-specific errors (e.g., foreign key violations)
    return StatusCode(500, new { message = "Failed to delete post. Possible foreign key constraint violation.", error = ex.InnerException?.Message });
}
catch (Exception ex)
{
    // Handle other unexpected errors
    return StatusCode(500, new { message = "An error occurred while deleting the post.", error = ex.Message });
}
}
[HttpPatch("restore/{id}")]
// [Authorize(Policy = "RestorePost")] // optional policy
public async Task<IActionResult> RestorePost(int id)
{
    try
    {
        var post = await _context.Posts
            .IgnoreQueryFilters() // So you can fetch soft-deleted posts
            .FirstOrDefaultAsync(p => p.Id == id);

        if (post == null)
            return NotFound(new { message = $"No post found with ID {id}." });

        if (!post.IsDeleted)
            return BadRequest(new { message = "Post is not deleted." });

        post.IsDeleted = false;
        _context.Posts.Update(post);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Post restored successfully." });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "An error occurred while restoring the post.", error = ex.Message });
    }
}


        // [HttpPost("{id}/approve")]
        // [Authorize(Policy = "AdminAccess")] // Only admins can approve
        // public async Task<IActionResult> ApprovePost(int id)
        // {
        //     // Logic to approve a post
        // }

        // [HttpGet("drafts")]
        // [Authorize(Policy = "ReadUser")]
        // public async Task<IActionResult> GetDrafts()
        // {
        //     // Logic to get user's draft posts
        // }

        // [HttpPatch("{id}/status")]
        // [Authorize(Policy = "UpdateUser")]
        // public async Task<IActionResult> UpdateStatus(int id, [FromBody] PostStatusRequest request)
        // {
        //     // Logic to update post status (draft, published, archived)
        // }
    }
    public class PostWithDetailsDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int AuthorId { get; set; } // This comes from posts table
        public string Categories { get; set; }
        public string FeaturedImage { get; set; }
        public bool IsApproved { get; set; }
        public int Views { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Extra from JOIN
        public int? ApproverIdFromJoin { get; set; }  // Nullable int
        public string? ApproverName { get; set; }     // Nullable string
        public int? AuthorIdFromJoin { get; set; }    // Nullable if possible
        public string? AuthorName { get; set; }       // Nullable string
    }
    // Request DTOs
    public class PostCreateRequest
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string? Categories { get; set; }
        public string? FeaturedImage { get; set; }
        public bool? IsApproved { get; set; } = false;
        public int? Views { get; set; } = 0;
        public int? ApproverId { get; set; }
    }

    public class PostUpdateRequest
    {
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? Categories { get; set; }
        public string? FeaturedImage { get; set; }
        public int? ApproverId { get; set; }
        public string Status { get; set; } = "draft";
        public bool IsApproved { get; set; }

    }

    public class PostStatusRequest
    {
        public string Status { get; set; } // "draft", "published", "archived"
    }
    public class Post
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    
    // Soft delete flag
    public bool IsDeleted { get; set; } = false;

    // ... other properties
}
}