using System.Text.Json.Serialization;
namespace blogapp.Models
{
    public class User
    {
        public int Id { get; set; } // Primary Key
        public string? Username { get; set; }  // Nullable
        public string? Email { get; set; }     // Nullable
        public int RoleId { get; set; } // ✅ Foreign key to Role
        [JsonIgnore] // ✅ Ignore during serialization/deserialization
        public Role Role { get; set; }  // ✅ Navigation property
        public string? Password { get; set; } // ✅ New column
        // Navigation properties for Posts using ICollection without List
        public virtual ICollection<Post> PostsAuthored { get; set; } // No initialization
        public virtual ICollection<Post> PostsApproved { get; set; } // No initialization
    }
}
