using System.ComponentModel.DataAnnotations;

namespace EatMeOut.API.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; } 

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;
    }
}
