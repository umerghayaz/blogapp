using System.ComponentModel.DataAnnotations;

namespace blogapp.Models
{
    public class Permission
    {
        public int Id { get; set; }
        [Required, StringLength(50)]
        public string Name { get; set; } // e.g., "CreateUser", "DeleteUser"
        public ICollection<RolePermission> RolePermissions { get; set; } // Many-to-many with Role
    }
}