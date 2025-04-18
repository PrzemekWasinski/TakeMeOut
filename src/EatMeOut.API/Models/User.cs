using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        public string? Address { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal Credit { get; set; } = 0;


        [Required]
        public string PasswordHash { get; set; } = string.Empty;
    }
}
