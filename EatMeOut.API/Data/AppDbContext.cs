using EatMeOut.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EatMeOut.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Restaurant> Restaurants { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Add sample restaurant and menu items
            modelBuilder.Entity<Restaurant>().HasData(
                new Restaurant
                {
                    Id = 1,
                    RestaurantName = "Burger Palace",
                    Address = "123 Main St",
                    Email = "burger.palace@example.com",
                    PasswordHash = "$2a$12$eImiTXuWVxfM37uY4JANjQ==", 
                    Phone = "555-0123",
                    CuisineType = "American",
                    Description = "Best burgers in town!",
                    CreatedAt = new DateTime(2023, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

        }
    }
}