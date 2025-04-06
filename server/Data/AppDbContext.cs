using Microsoft.EntityFrameworkCore;
using blogapp.Models;

namespace blogapp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSets for all entities
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<Post> Posts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure RolePermission composite key
            modelBuilder.Entity<RolePermission>()
                .HasKey(rp => new { rp.RoleId, rp.PermissionId });

            // Configure RolePermission relationships
            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId);

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(rp => rp.PermissionId);

            // Seed initial data for roles and permissions (optional)
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Admin" },
                new Role { Id = 2, Name = "User" }
            );
            modelBuilder.Entity<Permission>().HasData(
                new Permission { Id = 1, Name = "CreateUser" },
                new Permission { Id = 2, Name = "ReadUser" },
                new Permission { Id = 3, Name = "UpdateUser" },
                new Permission { Id = 4, Name = "DeleteUser" }
            );
            modelBuilder.Entity<RolePermission>().HasData(
                new RolePermission { RoleId = 1, PermissionId = 1 }, // Admin: CreateUser
                new RolePermission { RoleId = 1, PermissionId = 2 }, // Admin: ReadUser
                new RolePermission { RoleId = 1, PermissionId = 3 }, // Admin: UpdateUser
                new RolePermission { RoleId = 1, PermissionId = 4 }, // Admin: DeleteUser
                new RolePermission { RoleId = 2, PermissionId = 2 }  // User: ReadUser
            );

            // Configure Post entity
            modelBuilder.Entity<Post>().ToTable("posts");

            // Soft delete filter for Posts
            modelBuilder.Entity<Post>().HasQueryFilter(p => p.DeletedAt == null);

            // Configure Status property (ENUM-like)
            modelBuilder.Entity<Post>()
                .Property(p => p.Status)
                .HasDefaultValue("draft")
                .HasConversion<string>()
                .IsRequired()
                .HasMaxLength(50);

            // Add check constraint for Status
            modelBuilder.Entity<Post>()
                .HasCheckConstraint("CK_Post_Status", "status IN ('draft', 'published', 'archived')");

            // Configure Post relationships
            modelBuilder.Entity<Post>()
                .HasOne(p => p.Author)
                .WithMany(u => u.PostsAuthored)
                .HasForeignKey(p => p.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Post>()
                .HasOne(p => p.Approver)
                .WithMany(u => u.PostsApproved)
                .HasForeignKey(p => p.ApproverId)
                .OnDelete(DeleteBehavior.SetNull);
                
        }

        // Override SaveChanges to handle soft deletes and timestamps for Posts
        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is Post && (e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted));

            foreach (var entry in entries)
            {
                var post = (Post)entry.Entity;
                if (entry.State == EntityState.Added)
                {
                    post.CreatedAt = DateTime.UtcNow;
                }
                if (entry.State == EntityState.Deleted)
                {
                    post.DeletedAt = DateTime.UtcNow;
                    entry.State = EntityState.Modified; // Convert delete to update
                }
                post.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}