using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace EatMeOut.Tests
{
    public class OrderItemDto
    {
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    [TestClass]
    public class OrderCalculationTests
    {
        private decimal CalculateTotal(List<OrderItemDto> items)
        {
            decimal total = 0;
            foreach (var item in items)
                total += item.Quantity * item.UnitPrice;
            return total;
        }

        [TestMethod]
        public void CalculateTotal_WithMultipleItems_ReturnsCorrectTotal()
        {
            var items = new List<OrderItemDto>
            {
                new OrderItemDto { Quantity = 2, UnitPrice = 5.00m },
                new OrderItemDto { Quantity = 1, UnitPrice = 10.00m }
            };

            var result = CalculateTotal(items);
            Assert.AreEqual(20.00m, result);
        }

        [TestMethod]
        public void CalculateTotal_WithNoItems_ReturnsZero()
        {
            var items = new List<OrderItemDto>();
            var result = CalculateTotal(items);
            Assert.AreEqual(0.00m, result);
        }

        [TestMethod]
        public void CalculateTotal_WithLargeQuantities_ReturnsAccurateTotal()
        {
            var items = new List<OrderItemDto>
            {
                new OrderItemDto { Quantity = 100, UnitPrice = 1.50m }
            };

            var result = CalculateTotal(items);
            Assert.AreEqual(150.00m, result);
        }
    }
}
