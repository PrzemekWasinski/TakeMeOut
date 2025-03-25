//using EatMeOut.API.Data;
//using EatMeOut.API.Models;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Security.Claims;

//namespace EatMeOut.API.Controllers
//{
//    [Authorize]
//    [Route("api/orders")]
//    [ApiController]
//    public class OrderController : ControllerBase
//    {
//        private readonly AppDbContext _context;

//        public OrderController(AppDbContext context)
//        {
//            _context = context;
//        }

//        [HttpPost]
//        public async Task<ActionResult> CreateOrder([FromBody] OrderCreateDto orderDto)
//        {
//            try
//            {
//                if (orderDto == null)
//                {
//                    return BadRequest(new { message = "Order data is required" });
//                }

//                if (string.IsNullOrEmpty(orderDto.OrderData))
//                {
//                    return BadRequest(new { message = "Order must contain valid data" });
//                }

//                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
//                if (userId == 0)
//                {
//                    return Unauthorized(new { message = "User not authenticated" });
//                }

//                var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Id == orderDto.RestaurantId);
//                if (restaurant == null)
//                {
//                    return NotFound(new { message = "Restaurant not found" });
//                }

//                // Generate Order ID and Format Order Data
//                string orderId = Guid.NewGuid().ToString();
//                string formattedOrder = $"{orderId}|{userId}|{DateTime.UtcNow}|Pending|{orderDto.OrderData}";

//                // Append order to restaurant's existing orders string
//                restaurant.Orders += (!string.IsNullOrEmpty(restaurant.Orders) ? ";" : "") + formattedOrder;

//                await _context.SaveChangesAsync();

//                return Ok(new { orderId, message = "Order created successfully" });
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
//            }
//        }

//        [HttpGet("restaurant/{restaurantId}")]
//        public async Task<ActionResult> GetRestaurantOrders(int restaurantId)
//        {
//            try
//            {
//                var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Id == restaurantId);
//                if (restaurant == null)
//                {
//                    return NotFound(new { message = "Restaurant not found" });
//                }

//                return Ok(restaurant.Orders);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
//            }
//        }

//        [HttpGet("user")]
//        public async Task<ActionResult> GetUserOrders()
//        {
//            try
//            {
//                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
//                if (userId == 0)
//                {
//                    return Unauthorized(new { message = "User not authenticated" });
//                }

//                var restaurants = await _context.Restaurants.Where(r => r.Orders.Contains(userId.ToString())).ToListAsync();
//                var userOrders = restaurants.SelectMany(r => r.Orders.Split(';')
//                    .Where(o => o.Contains($"|{userId}|"))
//                    .Select(o => new { RestaurantId = r.Id, OrderData = o }))
//                    .ToList();

//                return Ok(userOrders);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
//            }
//        }

//        [HttpPut("{restaurantId}/update")]
//        public async Task<ActionResult> UpdateOrderStatus(int restaurantId, [FromBody] OrderStatusUpdateDto statusDto)
//        {
//            try
//            {
//                var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Id == restaurantId);
//                if (restaurant == null)
//                {
//                    return NotFound(new { message = "Restaurant not found" });
//                }

//                if (string.IsNullOrEmpty(restaurant.Orders) || !restaurant.Orders.Contains(statusDto.OrderId))
//                {
//                    return NotFound(new { message = "Order not found" });
//                }

//                var ordersArray = restaurant.Orders.Split(';');
//                for (int i = 0; i < ordersArray.Length; i++)
//                {
//                    if (ordersArray[i].StartsWith(statusDto.OrderId))
//                    {
//                        var orderParts = ordersArray[i].Split('|');
//                        orderParts[3] = statusDto.Status; // Update Status in the 4th position
//                        ordersArray[i] = string.Join("|", orderParts);
//                        break;
//                    }
//                }

//                restaurant.Orders = string.Join(";", ordersArray);
//                await _context.SaveChangesAsync();

//                return Ok(new { message = "Order status updated successfully" });
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
//            }
//        }
//    }

//    public class OrderCreateDto
//    {
//        public int RestaurantId { get; set; }
//        public string OrderData { get; set; } = string.Empty; // Order information stored as a plain string
//    }

//    public class OrderStatusUpdateDto
//    {
//        public string OrderId { get; set; } = string.Empty;
//        public string Status { get; set; } = string.Empty;
//    }
//}
