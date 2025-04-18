using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EatMeOut.Tests
{
    public class Order
    {
        public DateTime PlacedAt { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class OrderHistoryService
    {
        public List<Order> GetSortedOrders(List<Order> orders)
        {
            return orders.OrderByDescending(o => o.PlacedAt).ToList();
        }
    }

    [TestClass]
    public class OrderHistorySortingTests
    {
        [TestMethod]
        public void Orders_AreSortedByMostRecentFirst()
        {
            var orders = new List<Order>
            {
                new Order { PlacedAt = new DateTime(2023, 1, 1), Description = "Old" },
                new Order { PlacedAt = new DateTime(2023, 3, 1), Description = "New" },
                new Order { PlacedAt = new DateTime(2023, 2, 1), Description = "Mid" }
            };

            var service = new OrderHistoryService();
            var sorted = service.GetSortedOrders(orders);

            Assert.AreEqual("New", sorted[0].Description);
            Assert.AreEqual("Mid", sorted[1].Description);
            Assert.AreEqual("Old", sorted[2].Description);
        }

        [TestMethod]
        public void EmptyOrderList_ReturnsEmptyList()
        {
            var orders = new List<Order>();
            var service = new OrderHistoryService();

            var sorted = service.GetSortedOrders(orders);

            Assert.AreEqual(0, sorted.Count);
        }
    }
}
