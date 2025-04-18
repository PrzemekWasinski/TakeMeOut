using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace EatMeOut.Tests
{
    public class CartService
    {
        public bool IsCartValid(List<string>? items)
        {
            return items != null && items.Count > 0;
        }
    }

    [TestClass]
    public class CartValidationTests
    {
        [TestMethod]
        public void Cart_WithItems_IsValid()
        {
            var cart = new List<string> { "Pizza", "Burger" };
            var service = new CartService();

            Assert.IsTrue(service.IsCartValid(cart));
        }

        [TestMethod]
        public void Cart_WithNoItems_IsInvalid()
        {
            var cart = new List<string>();
            var service = new CartService();

            Assert.IsFalse(service.IsCartValid(cart));
        }

        [TestMethod]
        public void Cart_NullCart_IsInvalid()
        {
            List<string>? cart = null;
            var service = new CartService();

            Assert.IsFalse(service.IsCartValid(cart));
        }
    }
}
