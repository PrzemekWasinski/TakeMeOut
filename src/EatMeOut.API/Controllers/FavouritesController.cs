using EatMeOut.API.Data;
using EatMeOut.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EatMeOut.API.Controllers
{
    [Authorize]
    [Route("api/favourites")]
    [ApiController]
    public class FavouritesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FavouritesController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        [HttpGet]
        public async Task<ActionResult> GetFavourites()
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Invalid or missing authentication token" });
                }

                var favourites = await _context.Favourites
                    .Include(f => f.Restaurant)
                    .Where(f => f.UserId == userId)
                    .Select(f => new
                    {
                        f.Restaurant.Id,
                        f.Restaurant.RestaurantName,
                        f.Restaurant.CuisineType,
                        f.Restaurant.Description,
                        f.Restaurant.CoverIMG,
                        f.Restaurant.BannerIMG
                    })
                    .ToListAsync();

                return Ok(favourites);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPost("{restaurantId}")]
        public async Task<ActionResult> AddFavourite(int restaurantId)
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Invalid or missing authentication token" });
                }

                //Check if restaurant exists
                var restaurant = await _context.Restaurants.FindAsync(restaurantId);
                if (restaurant == null)
                {
                    return NotFound(new { message = "Restaurant not found" });
                }

                //Check if already favourited
                var existingFavourite = await _context.Favourites
                    .FirstOrDefaultAsync(f => f.UserId == userId && f.RestaurantId == restaurantId);

                if (existingFavourite != null)
                {
                    return BadRequest(new { message = "Restaurant is already in favourites" });
                }

                var favourite = new Favourite
                {
                    UserId = userId,
                    RestaurantId = restaurantId
                };

                _context.Favourites.Add(favourite);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Restaurant added to favourites" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpDelete("{restaurantId}")]
        public async Task<ActionResult> RemoveFavourite(int restaurantId)
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Invalid or missing authentication token" });
                }

                var favourite = await _context.Favourites
                    .FirstOrDefaultAsync(f => f.UserId == userId && f.RestaurantId == restaurantId);

                if (favourite == null)
                {
                    return NotFound(new { message = "Favourite not found" });
                }

                _context.Favourites.Remove(favourite);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Restaurant removed from favourites" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("check/{restaurantId}")]
        public async Task<ActionResult> CheckFavourite(int restaurantId)
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (userId == 0)
                {
                    return Unauthorized(new { message = "Invalid or missing authentication token" });
                }

                var isFavourite = await _context.Favourites
                    .AnyAsync(f => f.UserId == userId && f.RestaurantId == restaurantId);

                return Ok(new { isFavourite });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }
    }
} 