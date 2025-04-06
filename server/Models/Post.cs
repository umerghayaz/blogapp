using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace blogapp.Models
{
    public class Post
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Post title is required")]
        [StringLength(255)]
        public string Title { get; set; }

        [Required(ErrorMessage = "Post content is required")]
        [Column(TypeName = "TEXT")]
        public string Content { get; set; }

        [StringLength(255)]
        public string? Categories { get; set; }

        [Column("isApproved")]
        public bool IsApproved { get; set; } = false;

        [ForeignKey("Approver")]
        public int? ApproverId { get; set; }
        public virtual User? Approver { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Status { get; set; } = "draft";

        public int? Views { get; set; } = 0;

        [StringLength(255)]
        public string? FeaturedImage { get; set; }

        [Required]
        [ForeignKey("Author")]
        public int AuthorId { get; set; }
        public virtual User Author { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        [Column("destroyTime")]
        public DateTime? DeletedAt { get; set; }
    }
}