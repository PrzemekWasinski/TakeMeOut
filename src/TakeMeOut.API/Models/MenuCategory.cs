using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TakeMeOut.API.Models;

namespace TakeMeOut.API.Models
{
    public class MenuCategory
    {
        [Key]
        public int Id { get; set; } // Global unique ID (primary key)

        public int RestaurantId { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public int DisplayOrder { get; set; }

        public int MenuCategoryId { get; set; } // SCOPED PER RESTAURANT

        // Navigation properties
        public virtual Restaurant Restaurant { get; set; } = null!;
        public virtual ICollection<MenuItem> Items { get; set; } = new List<MenuItem>();
    }
}
