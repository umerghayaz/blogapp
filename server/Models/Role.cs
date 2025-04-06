using System.ComponentModel.DataAnnotations;

namespace blogapp.Models
{
    public class Role
    {
        public int Id { get; set; }
        [Required, StringLength(50)]
        public string Name { get; set; } // e.g., "Admin", "User"
        public ICollection<RolePermission> RolePermissions { get; set; } // Many-to-many with Permission
    }
}