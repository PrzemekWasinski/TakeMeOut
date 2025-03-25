using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EatMeOut.API.Models
{
    public class MenuItem
    {
        [Key]
        public int Id { get; set; }  // Unique ID for the menu item

        [Required]
        public int RestaurantId { get; set; }  // Link to the restaurant this item belongs to

        [Required]
        public int MenuCategoryId { get; set; }  // Foreign key to MenuCategory

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public List<string> Ingredients { get; set; } = new(); // Stored as JSON

        public int Calories { get; set; }

        public bool IsVegan { get; set; }

        public bool IsAvailable { get; set; } = true;

        public string? ImageUrl { get; set; }

        public int DisplayOrder { get; set; }

        [ForeignKey("MenuCategoryId")]
        public MenuCategory? Category { get; set; }
    }
}
