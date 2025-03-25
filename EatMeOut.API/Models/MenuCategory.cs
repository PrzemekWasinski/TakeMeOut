using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EatMeOut.API.Models;

public class MenuCategory
{
    [Key]
    public int Id { get; set; } // Global unique ID (primary key)

    public int RestaurantId { get; set; }

    public string RestaurantEmail { get; set; }

    [Required]
    public string Name { get; set; }

    public int DisplayOrder { get; set; }

    public int MenuCategoryId { get; set; } // SCOPED PER RESTAURANT

    public List<MenuItem> Items { get; set; }
}
