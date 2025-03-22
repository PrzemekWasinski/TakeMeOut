using EatMeOut.API.Data;
using EatMeOut.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
                    return BadRequest(new { message = "Invalid restaurant data" });
                }

                if (restaurantDto.Password != restaurantDto.ConfirmPassword)
                {
                    return BadRequest(new { message = "Passwords do not match" });
                }

                var existingRestaurant = await _context.Restaurants
                    .FirstOrDefaultAsync(r => r.Email == restaurantDto.Email);

                if (existingRestaurant != null)
                {
                    return BadRequest(new { message = "A restaurant with this email already exists" });
                }

                string coverImageUrl = restaurantDto.CoverIMG != null ? await SaveFile(restaurantDto.CoverIMG) : string.Empty;
                string bannerImageUrl = restaurantDto.BannerIMG != null ? await SaveFile(restaurantDto.BannerIMG) : string.Empty;

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
                    CoverIMG = coverImageUrl,
                    BannerIMG = bannerImageUrl,
                    Menu = restaurantDto.Menu ?? string.Empty,
                    Orders = restaurantDto.Orders ?? string.Empty
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
                    Menu = restaurant.Menu,
                    Orders = restaurant.Orders
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
                restaurant.CoverIMG = await SaveFile(updatedRestaurantDto.CoverIMG);
            }
            if (updatedRestaurantDto.BannerIMG != null)
            {
                restaurant.BannerIMG = await SaveFile(updatedRestaurantDto.BannerIMG);
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

        private async Task<string> SaveFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return string.Empty;

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return "/uploads/" + fileName;
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
        public string Menu { get; set; } = string.Empty;
        public string Orders { get; set; } = string.Empty;

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
