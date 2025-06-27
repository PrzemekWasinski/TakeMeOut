using TakeMeOut.API.Models;
using Microsoft.EntityFrameworkCore;

namespace TakeMeOut.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<MenuCategory> MenuCategories { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Favourite> Favourites { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Restaurant → MenuCategory relationship
            modelBuilder.Entity<MenuCategory>()
                .HasOne(c => c.Restaurant)
                .WithMany(r => r.MenuCategories)
                .HasForeignKey(c => c.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure MenuCategory → MenuItem relationship
            modelBuilder.Entity<MenuItem>()
                .HasOne(i => i.Category)
                .WithMany(c => c.Items)
                .HasForeignKey(i => new { i.MenuCategoryId, i.RestaurantId })
                .HasPrincipalKey(c => new { c.MenuCategoryId, c.RestaurantId })
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MenuCategory>()
                .HasIndex(c => new { c.MenuCategoryId, c.RestaurantId })
                .IsUnique();

            // Configure JSON conversion for Ingredients list
            modelBuilder.Entity<MenuItem>()
                .Property(i => i.Ingredients)
                .HasConversion(
                    v => string.Join(",", v),
                    v => v.Split(",", StringSplitOptions.RemoveEmptyEntries).ToList()
                );

            // Configure unique constraint for Favourites
            modelBuilder.Entity<Favourite>()
                .HasIndex(f => new { f.UserId, f.RestaurantId })
                .IsUnique();

            // Example seed (optional)
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
