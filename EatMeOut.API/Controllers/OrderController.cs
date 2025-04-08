using EatMeOut.API.Data;
using EatMeOut.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EatMeOut.API.Controllers
{
    [Authorize]
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        private string? GetUserEmail() =>
            User.FindFirst(ClaimTypes.Email)?.Value;

        // Create a new order
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
        {
            var userId = GetUserId();
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return Unauthorized();

            if (dto.OrderItems == null || !dto.OrderItems.Any())
                return BadRequest(new { message = "Order must contain items." });

            var total = dto.OrderItems.Sum(i => i.Quantity * i.UnitPrice);

            if (user.Credit < total)
                return BadRequest(new { message = "Insufficient credit." });

            if (string.IsNullOrWhiteSpace(dto.Address))
                return BadRequest(new { message = "Address is required." });

            // Deduct credit
            user.Credit -= total;

            // Update address if needed
            if (user.Address != dto.Address)
                user.Address = dto.Address;

            var order = new Order
            {
                UserId = userId,
                RestaurantId = dto.RestaurantId,
                OrderDate = DateTime.UtcNow,
                TotalAmount = total,
                Status = "Pending",
                Address = dto.Address
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); // Save to get Order ID

            // Save each order item (optional, for future querying)
            var itemEntities = dto.OrderItems.Select(i => new OrderItem
            {
                OrderId = order.Id,
                ItemName = i.ItemName,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            });

            _context.OrderItems.AddRange(itemEntities);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Order placed successfully." });
        }

        // Get current user's orders
        [HttpGet("user")]
        public async Task<IActionResult> GetUserOrders()
        {
            var userId = GetUserId();
            var orders = await _context.Orders
                .Where(o => o.UserId == userId && o.Status != "Completed")
                .Include(o => o.Items)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var result = orders.Select(o => new OrderResponseDto
            {
                Id = o.Id,
                OrderDate = o.OrderDate,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                Address = o.Address,
                Items = o.Items.Select(i => new OrderItemDto
                {
                    ItemName = i.ItemName,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            }).ToList();


            return Ok(result);

        }

        // Get all orders for a restaurant
        [HttpGet("restaurant/{restaurantId}")]
        public async Task<IActionResult> GetRestaurantOrders(int restaurantId)
        {
            var orders = await _context.Orders
                .Where(o => o.RestaurantId == restaurantId)
                .Include(o => o.Items)
                .Include(o => o.User)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var result = orders.Select(o => new OrderResponseDto
            {
                Id = o.Id,
                OrderDate = o.OrderDate,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                Address = o.Address,
                CustomerName = $"{o.User?.FirstName} {o.User?.LastName}".Trim(),
                Items = o.Items.Select(i => new OrderItemDto
                {
                    ItemName = i.ItemName,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        // Update restaurant dashboard
        [HttpGet("restaurant/{restaurantId}/dashboard")]
        public async Task<IActionResult> GetRestaurantDashboard(int restaurantId)
        {
            var now = DateTime.UtcNow;
            var startOfDay = now.Date;

            var todaysOrders = await _context.Orders
                .Where(o => o.RestaurantId == restaurantId && o.OrderDate >= startOfDay)
                .ToListAsync();

            var recentOrders = await _context.Orders
                .Where(o => o.RestaurantId == restaurantId)
                .Include(o => o.Items)
                .Include(o => o.User)
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .ToListAsync();

            return Ok(new
            {
                totalOrdersToday = todaysOrders.Count,
                revenueToday = todaysOrders.Sum(o => o.TotalAmount),
                recent = recentOrders.Select(o => new
                {
                    id = o.Id,
                    customer = $"{o.User?.FirstName} {o.User?.LastName}".Trim(),
                    total = o.TotalAmount,
                    status = o.Status,
                    items = o.Items.Select(i => new {
                        i.ItemName,
                        i.Quantity
                    }).ToList()
                })
            });
        }


        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] StatusUpdateDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }

        public class StatusUpdateDto
        {
            public string Status { get; set; } = string.Empty;
        }


        // Complete order
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = "Completed";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Order marked as completed." });
        }
    }

    public class OrderCreateDto
    {
        public int RestaurantId { get; set; }
        public string Address { get; set; } = string.Empty;
        public List<OrderItemDto> OrderItems { get; set; } = new();
    }

    public class OrderItemDto
    {
        public string ItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class OrderResponseDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty; 
        public List<OrderItemDto> Items { get; set; } = new();
    }

}
