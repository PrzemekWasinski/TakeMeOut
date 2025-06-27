using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TakeMeOut.API.Models
{
    public class Restaurant
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string OwnerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string RestaurantName { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string CuisineType { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string OpeningTimes { get; set; } = string.Empty;

        public string ClosingTimes { get; set; } = string.Empty;

        public string CoverIMG { get; set; } = string.Empty;
        public string BannerIMG { get; set; } = string.Empty;
        public double Rating { get; set; } = 0.0;
        public int RatingCount { get; set; } = 0;
        public string PricingTier { get; set; } = "£";

        



        // Navigation property for menu categories
        public virtual ICollection<MenuCategory> MenuCategories { get; set; } = new List<MenuCategory>();
    }
}
