using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using EatMeOut.API.Data;
using EatMeOut.API.Models;
using EatMeOut.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EatMeOut.API.Controllers
{
    [Authorize]
    [Route("api/menu")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MenuController(AppDbContext context)
        {
            _context = context;
        }

        private string? GetEmailFromToken()
        {
            return User.FindFirst(ClaimTypes.Email)?.Value;
        }

        // Create a DTO class at the bottom of the file
        public class CreateMenuCategoryDto
        {
            public string Name { get; set; } = string.Empty;
        }

        // 1. Create a new category
        [HttpPost("categories")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateMenuCategoryDto dto)
        {
            var jwtEmail = GetEmailFromToken();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Email == jwtEmail);

            if (restaurant == null)
                return Unauthorized(new { message = "Unauthorized to create category for this restaurant." });

            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest(new { message = "Category name is required." });

            var maxDisplayOrder = await _context.MenuCategories
                .Where(c => c.RestaurantId == restaurant.Id)
                .MaxAsync(c => (int?)c.DisplayOrder) ?? 0;

            var maxScopedCategoryId = await _context.MenuCategories
                .Where(c => c.RestaurantId == restaurant.Id)
                .MaxAsync(c => (int?)c.MenuCategoryId) ?? 0;

            // Check for existing category name in same restaurant
            var duplicate = await _context.MenuCategories.AnyAsync(c =>
                c.RestaurantId == restaurant.Id &&
                c.Name.ToLower() == dto.Name.ToLower());

            if (duplicate)
                return BadRequest(new { message = "Category name already exists." });

            var category = new MenuCategory
            {
                Name = dto.Name,
                RestaurantId = restaurant.Id,
                DisplayOrder = maxDisplayOrder + 1,
                MenuCategoryId = maxScopedCategoryId + 1
            };

            _context.MenuCategories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Category created", category.MenuCategoryId });
        }

        // 2. Create a new item
        [HttpPost("items")]
        public async Task<IActionResult> CreateMenuItem([FromBody] MenuItem item)
        {
            var jwtEmail = GetEmailFromToken();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Email == jwtEmail);

            if (restaurant == null)
                return Unauthorized(new { message = "Unauthorized" });

            var category = await _context.MenuCategories
                .FirstOrDefaultAsync(c => c.MenuCategoryId == item.MenuCategoryId && c.RestaurantId == restaurant.Id);

            if (category == null)
                return NotFound(new { message = "Menu category not found or does not belong to restaurant" });

            item.RestaurantId = restaurant.Id;

            var maxDisplayOrder = await _context.MenuItems
            .Where(i => i.MenuCategoryId == item.MenuCategoryId && i.RestaurantId == restaurant.Id)
            .MaxAsync(i => (int?)i.DisplayOrder) ?? 0;

            item.DisplayOrder = maxDisplayOrder + 1;

            var duplicateItem = await _context.MenuItems.AnyAsync(i =>
            i.RestaurantId == restaurant.Id &&
            i.Name.ToLower() == item.Name.ToLower());

            if (duplicateItem)
                return BadRequest(new { message = "Item name already exists." });

            _context.MenuItems.Add(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Menu item created", item.Id });
        }

        // 3. Upload Image for item
        [HttpPost("items/upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadItemImage([FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest(new { message = "Image file is required." });

            var imageUrl = await FileUploadHelper.SaveFile(image);
            return Ok(new { imageUrl });
        }


        [HttpGet("{restaurantEmail}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetMenuByRestaurant(string restaurantEmail)
        {
            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.Email == restaurantEmail);

            if (restaurant == null)
                return NotFound(new { message = "Restaurant not found" });

            var categories = await _context.MenuCategories
                .Where(c => c.RestaurantId == restaurant.Id)
                .Include(c => c.Items)
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync();

            var grouped = categories.Select(c => new
            {
                id = c.MenuCategoryId,
                category = c.Name,
                displayOrder = c.DisplayOrder,
                items = c.Items
                    .OrderBy(i => i.DisplayOrder)
                    .Select(i => new
                    {
                        i.Id,
                        i.Name,
                        i.Description,
                        i.Price,
                        i.Ingredients,
                        i.Calories,
                        i.IsVegan,
                        i.IsAvailable,
                        i.ImageUrl
                    }).ToList()
            }).ToList();

            return Ok(grouped);
        }


        // 5. Update Category 
        [HttpPut("categories/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] MenuCategory updated)
        {
            var jwtEmail = GetEmailFromToken();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Email == jwtEmail);
            if (restaurant == null) return Unauthorized();

            var existing = await _context.MenuCategories.FirstOrDefaultAsync(c => c.Id == id && c.RestaurantId == restaurant.Id);
            if (existing == null) return NotFound(new { message = "Category not found" });

            // Check for duplicate name
            var duplicate = await _context.MenuCategories.AnyAsync(c =>
                c.RestaurantId == restaurant.Id &&
                c.Name.ToLower() == updated.Name.ToLower() &&
                c.Id != id
            );
            if (duplicate)
            {
                return BadRequest(new { message = "Category name already exists." });
            }

            existing.Name = updated.Name;
            _context.MenuCategories.Update(existing);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Category updated" });
        }

        // 6. Update menu item
        [HttpPut("items/{id}")]
        public async Task<IActionResult> UpdateMenuItem(int id, [FromBody] MenuItem updated)
        {
            var jwtEmail = GetEmailFromToken();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Email == jwtEmail);

            if (restaurant == null)
                return Unauthorized(new { message = "Unauthorized" });

            var existing = await _context.MenuItems
                .Include(i => i.Category)
                .FirstOrDefaultAsync(i => i.Id == id && i.RestaurantId == restaurant.Id);

            if (existing == null)
                return NotFound(new { message = "Item not found" });

            if (existing.Category?.RestaurantId != restaurant.Id)
                return Unauthorized(new { message = "Unauthorized to update this item." });

            var duplicateItem = await _context.MenuItems.AnyAsync(i =>
            i.RestaurantId == restaurant.Id &&
            i.Name.ToLower() == updated.Name.ToLower() &&
            i.Id != id);

            if (duplicateItem)
                return BadRequest(new { message = "Item name already exists." });


            existing.Name = updated.Name;
            existing.Description = updated.Description;
            existing.Price = updated.Price;
            existing.Ingredients = updated.Ingredients;
            existing.Calories = updated.Calories;
            existing.IsVegan = updated.IsVegan;
            existing.IsAvailable = updated.IsAvailable;

            // Replace old image
            if (!string.IsNullOrEmpty(updated.ImageUrl) && updated.ImageUrl != existing.ImageUrl)
            {
                FileUploadHelper.DeleteFile(existing.ImageUrl);
                existing.ImageUrl = updated.ImageUrl;
            }

            _context.MenuItems.Update(existing);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Menu item updated" });
        }

        // 7. Delete category
        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var jwtEmail = GetEmailFromToken();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Email == jwtEmail);
            if (restaurant == null) return Unauthorized();

            var category = await _context.MenuCategories
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.Id == id && c.RestaurantId == restaurant.Id);

            if (category == null) return NotFound(new { message = "Category not found" });

            _context.MenuCategories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Category deleted" });
        }



        // 8. Delete menu item
        [HttpDelete("items/{id}")]
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            var jwtEmail = GetEmailFromToken();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Email == jwtEmail);

            if (restaurant == null)
                return Unauthorized(new { message = "Unauthorized" });

            var item = await _context.MenuItems
                .Include(i => i.Category)
                .FirstOrDefaultAsync(i => i.Id == id && i.RestaurantId == restaurant.Id);

            if (item == null)
                return NotFound(new { message = "Item not found" });

            if (item.Category?.RestaurantId != restaurant.Id)
                return Unauthorized(new { message = "Unauthorized to delete this item." });

            _context.MenuItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Menu item deleted" });
        }

        // 9. Reorder Category
        [HttpPost("categories/reorder")]
        public async Task<IActionResult> ReorderCategories([FromBody] List<int> orderedIds)
        {
            var jwtEmail = GetEmailFromToken();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Email == jwtEmail);
            if (restaurant == null) return Unauthorized();

            var categories = await _context.MenuCategories
                .Where(c => c.RestaurantId == restaurant.Id)
                .ToListAsync();

            for (int i = 0; i < orderedIds.Count; i++)
            {
                var category = categories.FirstOrDefault(c => c.Id == orderedIds[i]);
                if (category != null) category.DisplayOrder = i + 1;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Categories reordered" });
        }

        // 10. Reorder Item
        [HttpPost("items/reorder")]
        public async Task<IActionResult> ReorderItems([FromBody] List<int> orderedIds)
        {
            var jwtEmail = GetEmailFromToken();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Email == jwtEmail);
            if (restaurant == null) return Unauthorized();

            var items = await _context.MenuItems
                .Where(i => i.RestaurantId == restaurant.Id)
                .ToListAsync();

            for (int i = 0; i < orderedIds.Count; i++)
            {
                var item = items.FirstOrDefault(it => it.Id == orderedIds[i]);
                if (item != null) item.DisplayOrder = i + 1;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Items reordered" });
        }

        // 11. Get a single menu item by ID (for editing)
        [HttpGet("items/{id}")]
        public async Task<IActionResult> GetMenuItem(int id)
        {
            var jwtEmail = GetEmailFromToken();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Email == jwtEmail);

            if (restaurant == null)
                return Unauthorized(new { message = "Unauthorized" });

            var item = await _context.MenuItems
                .FirstOrDefaultAsync(i => i.Id == id && i.RestaurantId == restaurant.Id);

            if (item == null)
                return NotFound(new { message = "Item not found" });

            return Ok(item);
        }

    }
}
