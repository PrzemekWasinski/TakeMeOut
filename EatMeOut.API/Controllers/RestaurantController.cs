using EatMeOut.API.Data;
using EatMeOut.API.Models;
using EatMeOut.API.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace EatMeOut.API.Controllers
{
    [Route("api/restaurants")]
    [ApiController]
    public class RestaurantController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public RestaurantController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private string GenerateJwtToken(Restaurant restaurant)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"] ?? string.Empty);

            if (key.Length < 32)
            {
                throw new Exception("Secret key must be at least 32 bytes (256 bits).");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.NameIdentifier, restaurant.Id.ToString()),
            new Claim(ClaimTypes.Email, restaurant.Email),
            new Claim(ClaimTypes.Name, restaurant.RestaurantName),
            new Claim("RestaurantId", restaurant.Id.ToString())
        }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


        [HttpPost("register")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult> Register([FromForm] RestaurantRegisterDto restaurantDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = string.Join("; ", ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage));
                    Console.WriteLine($"ModelState validation failed: {errors}");
                    return BadRequest(new { message = $"Invalid restaurant data: {errors}" });
                }

                if (restaurantDto.Password != restaurantDto.ConfirmPassword)
                {
                    return BadRequest(new { message = "Passwords do not match" });
                }

                // Log the received data for debugging
                Console.WriteLine($"Received registration data: Email={restaurantDto.Email}, " +
                    $"Name={restaurantDto.RestaurantName}, " +
                    $"HasCoverImg={restaurantDto.CoverIMG != null}, " +
                    $"HasBannerImg={restaurantDto.BannerIMG != null}");

                var existingRestaurant = await _context.Restaurants
                    .FirstOrDefaultAsync(r => r.Email == restaurantDto.Email);

                if (existingRestaurant != null)
                {
                    return BadRequest(new { message = "A restaurant with this email already exists" });
                }

                // Process cover image
                string coverImgUrl = restaurantDto.CoverIMG != null ? await FileUploadHelper.SaveFile(restaurantDto.CoverIMG) : string.Empty;
                string bannerImgUrl = restaurantDto.BannerIMG != null ? await FileUploadHelper.SaveFile(restaurantDto.BannerIMG) : string.Empty;

                var restaurant = new Restaurant
                {
                    OwnerName = restaurantDto.OwnerName,
                    Email = restaurantDto.Email,
                    RestaurantName = restaurantDto.RestaurantName,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(restaurantDto.Password),
                    Address = restaurantDto.Address,
                    Phone = restaurantDto.Phone,
                    CuisineType = restaurantDto.CuisineType,
                    Description = restaurantDto.Description,
                    CreatedAt = DateTime.UtcNow,
                    OpeningTimes = restaurantDto.OpeningTimes ?? string.Empty,
                    ClosingTimes = restaurantDto.ClosingTimes ?? string.Empty,
                    CoverIMG = coverImgUrl,
                    BannerIMG = bannerImgUrl,
                };

                _context.Restaurants.Add(restaurant);
                await _context.SaveChangesAsync();


                return Ok(new { message = "Restaurant registration successful" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] RestaurantLoginDto loginDto)
        {
            try
            {
                if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
                {
                    return BadRequest(new { message = "Email and password are required" });
                }

                var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Email == loginDto.Email);

                if (restaurant == null)
                {
                    return Unauthorized(new { message = "Invalid email or password (Restaurant not found)" });
                }

                Console.WriteLine($"Stored Hash: {restaurant.PasswordHash}");
                Console.WriteLine($"Entered Password: {loginDto.Password}");

                if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, restaurant.PasswordHash))
                {
                    Console.WriteLine("Password verification failed.");
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                var token = GenerateJwtToken(restaurant);

                return Ok(new
                {
                    token,
                    restaurantId = restaurant.Id,
                    restaurantName = restaurant.RestaurantName,
                    ownerName = restaurant.OwnerName
                });

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Login Error: {ex.Message}");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }


        [HttpGet("profile")]
        public async Task<IActionResult> GetRestaurantProfile()
        {
            try
            {
                var restaurantId = GetRestaurantIdFromToken();
                if (restaurantId == 0)
                {
                    return Unauthorized(new { message = "Invalid or missing authentication token" });
                }

                var restaurant = await _context.Restaurants.FindAsync(restaurantId);
                if (restaurant == null)
                {
                    return NotFound(new { message = "Restaurant profile not found" });
                }

                // Ensure OpeningTimes & ClosingTimes are properly formatted JSON strings
                var openingTimes = !string.IsNullOrWhiteSpace(restaurant.OpeningTimes)
                    ? System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(restaurant.OpeningTimes)
                    : new Dictionary<string, string>();

                var closingTimes = !string.IsNullOrWhiteSpace(restaurant.ClosingTimes)
                    ? System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(restaurant.ClosingTimes)
                    : new Dictionary<string, string>();

                return Ok(new
                {
                    OwnerName = restaurant.OwnerName,
                    Email = restaurant.Email,
                    RestaurantName = restaurant.RestaurantName,
                    Address = restaurant.Address,
                    Phone = restaurant.Phone,
                    CuisineType = restaurant.CuisineType,
                    Description = restaurant.Description,
                    OpeningTimes = openingTimes,
                    ClosingTimes = closingTimes,
                    CoverIMG = restaurant.CoverIMG,
                    BannerIMG = restaurant.BannerIMG,
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetRestaurantProfile: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }


        [HttpPut("profile/update")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateRestaurantProfile([FromForm] RestaurantRegisterDto updatedRestaurantDto)
        {
            var restaurantId = GetRestaurantIdFromToken();
            if (restaurantId == 0)
            {
                return Unauthorized(new { message = "Invalid or missing authentication token" });
            }

            var restaurant = await _context.Restaurants.FindAsync(restaurantId);
            if (restaurant == null)
            {
                return NotFound(new { message = "Restaurant not found" });
            }

            if (string.IsNullOrWhiteSpace(updatedRestaurantDto.Email) ||
                string.IsNullOrWhiteSpace(updatedRestaurantDto.RestaurantName))
            {
                return BadRequest(new { message = "Email and Restaurant Name are required" });
            }

            restaurant.OwnerName = updatedRestaurantDto.OwnerName;
            restaurant.RestaurantName = updatedRestaurantDto.RestaurantName;
            restaurant.Email = updatedRestaurantDto.Email;
            restaurant.Phone = updatedRestaurantDto.Phone;
            restaurant.Address = updatedRestaurantDto.Address;
            restaurant.CuisineType = updatedRestaurantDto.CuisineType;
            restaurant.Description = updatedRestaurantDto.Description;
            restaurant.OpeningTimes = updatedRestaurantDto.OpeningTimes ?? string.Empty;
            restaurant.ClosingTimes = updatedRestaurantDto.ClosingTimes ?? string.Empty;

            if (updatedRestaurantDto.CoverIMG != null)
            {
                if (!string.IsNullOrWhiteSpace(restaurant.CoverIMG))
                {
                    FileUploadHelper.DeleteFile(restaurant.CoverIMG); 
                }
                restaurant.CoverIMG = await FileUploadHelper.SaveFile(updatedRestaurantDto.CoverIMG);
            }

            if (updatedRestaurantDto.BannerIMG != null)
            {
                if (!string.IsNullOrWhiteSpace(restaurant.BannerIMG))
                {
                    FileUploadHelper.DeleteFile(restaurant.BannerIMG); 
                }
                restaurant.BannerIMG = await FileUploadHelper.SaveFile(updatedRestaurantDto.BannerIMG);
            }

            _context.Restaurants.Update(restaurant);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated successfully" });
        }

        private int GetRestaurantIdFromToken()
        {
            var userIdClaim = User.FindFirst("RestaurantId");
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        [HttpGet("all")]
        public async Task<ActionResult> GetAllRestaurants()
        {
            try
            {
                var restaurants = await _context.Restaurants
                    .Select(r => new
                    {
                        r.Id,
                        r.RestaurantName,
                        r.CuisineType,
                        r.Description,
                        r.CoverIMG,
                        r.BannerIMG,
                        r.Rating,
                        r.PricingTier
                    })
                    .ToListAsync();

                return Ok(restaurants);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllRestaurants: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // By ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRestaurantById(int id)
        {
            var restaurant = await _context.Restaurants
                .Where(r => r.Id == id)
                .Select(r => new {
                    r.Id,
                    r.RestaurantName,
                    r.Address,
                    r.CuisineType,
                    r.Description,
                    r.Rating,
                    r.RatingCount,
                    r.PricingTier,
                    r.BannerIMG
                })
                .FirstOrDefaultAsync();

            if (restaurant == null)
                return NotFound(new { message = "Restaurant not found." });

            return Ok(restaurant);
        }


        // Ratings
        [HttpPost("{restaurantId}/rate")]
        [Authorize]
        public async Task<IActionResult> RateRestaurant(int restaurantId, [FromBody] int rating)
        {
            if (rating < 1 || rating > 5)
                return BadRequest(new { message = "Rating must be between 1 and 5." });

            var restaurant = await _context.Restaurants.FindAsync(restaurantId);
            if (restaurant == null)
                return NotFound(new { message = "Restaurant not found." });

            // Update average rating
            restaurant.Rating = ((restaurant.Rating * restaurant.RatingCount) + rating) / (restaurant.RatingCount + 1);
            restaurant.RatingCount++;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Rating submitted.", average = restaurant.Rating });
        }

        [HttpPost("{restaurantId}/recalculate-pricing")]
        public async Task<IActionResult> RecalculatePricing(int restaurantId)
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.MenuCategories)
                    .ThenInclude(c => c.Items)
                .FirstOrDefaultAsync(r => r.Id == restaurantId);

            if (restaurant == null)
                return NotFound(new { message = "Restaurant not found." });

            // Collect all category averages
            var allCategoryAverages = restaurant.MenuCategories
                .Where(c => c.Items.Any())  // Only include categories with items
                .Select(c => c.Items.Average(i => i.Price))  // Average price of items in the category
                .ToList();

            // Log the category averages for debugging
            Console.WriteLine($"Category Averages: {string.Join(", ", allCategoryAverages)}");

            if (!allCategoryAverages.Any())
                return Ok(new { message = "No items found to calculate pricing." });

            // Calculate the overall average price across all categories
            var overallAverage = allCategoryAverages.Average();
            Console.WriteLine($"Overall Average Price: {overallAverage}");

            // Update the pricing tier based on the average
            restaurant.PricingTier = overallAverage switch
            {
                < 10 => "�",   // Budget pricing
                >= 10 and <= 20 => "��",  // Mid-range pricing
                > 20 => "���"   // Premium pricing
            };

            // Log the new pricing tier for debugging
            Console.WriteLine($"Updated Pricing Tier: {restaurant.PricingTier}");

            // Save changes to the database
            await _context.SaveChangesAsync();

            return Ok(new { message = "Pricing tier updated.", tier = restaurant.PricingTier });
        }

        [HttpGet("{restaurantId}/summary")]
        [Authorize]
        public async Task<IActionResult> GetSummary(int restaurantId)
        {
            var restaurant = await _context.Restaurants
                .Where(r => r.Id == restaurantId)
                .Select(r => new {
                    Rating = r.Rating,
                    RatingCount = r.RatingCount
                })
                .FirstOrDefaultAsync();

            if (restaurant == null)
                return NotFound(new { message = "Restaurant not found." });

            return Ok(restaurant);
        }

        [HttpGet("search")]
        public async Task<ActionResult> SearchRestaurants([FromQuery] string q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return await GetAllRestaurants();
                }

                var searchTerm = q.ToLower();

                // Get all restaurants with their menu items
                var restaurants = await _context.Restaurants
                    .Include(r => r.MenuCategories)
                        .ThenInclude(c => c.Items)
                    .ToListAsync();

                // Filter restaurants based on search criteria
                var matchingRestaurants = restaurants.Where(r =>
                    r.RestaurantName.ToLower().Contains(searchTerm) ||
                    r.CuisineType.ToLower().Contains(searchTerm) ||
                    r.Description.ToLower().Contains(searchTerm) ||
                    r.MenuCategories.Any(c => c.Items.Any(i => 
                        i.Name.ToLower().Contains(searchTerm) ||
                        i.Description.ToLower().Contains(searchTerm) ||
                        i.Ingredients.Any(ing => ing.ToLower().Contains(searchTerm))
                    ))
                ).Select(r => new
                {
                    r.Id,
                    r.RestaurantName,
                    r.CuisineType,
                    r.Description,
                    r.CoverIMG,
                    r.BannerIMG,
                    r.Rating,
                    r.PricingTier
                }).ToList();

                return Ok(matchingRestaurants);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SearchRestaurants: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

    }


    // Updated DTO to use IFormFile for images
    public class RestaurantRegisterDto
    {
        public string OwnerName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
        public string RestaurantName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string CuisineType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string OpeningTimes { get; set; } = string.Empty;
        public string ClosingTimes { get; set; } = string.Empty;

        // Allow file uploads
        public IFormFile? CoverIMG { get; set; }
        public IFormFile? BannerIMG { get; set; }
    }

    public class RestaurantLoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
