using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EatMeOut.API.Models
{
    public class MenuItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int RestaurantId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty; 

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty; 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [MaxLength(50)]
        public string Category { get; set; } = string.Empty; 

        public bool IsAvailable { get; set; } = true;

        // Navigation property
        [ForeignKey("RestaurantId")]
        public Restaurant? Restaurant { get; set; } = null;
    }
}
