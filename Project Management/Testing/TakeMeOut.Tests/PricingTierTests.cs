using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;

namespace EatMeOut.Tests
{
    public class MenuItem
    {
        public decimal Price { get; set; }
    }

    public class PricingTierService
    {
        public string GetPricingTier(List<MenuItem> items)
        {
            if (!items.Any()) return "Unknown";

            var average = items.Average(i => i.Price);

            if (average < 10) return "£";
            else if (average <= 20) return "££";
            else return "£££";
        }
    }

    [TestClass]
    public class PricingTierTests
    {
        [TestMethod]
        public void GetPricingTier_WhenLowAverage_ReturnsTierOne()
        {
            var items = new List<MenuItem>
            {
                new MenuItem { Price = 5 },
                new MenuItem { Price = 8 }
            };

            var service = new PricingTierService();
            var tier = service.GetPricingTier(items);

            Assert.AreEqual("£", tier);
        }

        [TestMethod]
        public void GetPricingTier_WhenMediumAverage_ReturnsTierTwo()
        {
            var items = new List<MenuItem>
            {
                new MenuItem { Price = 12 },
                new MenuItem { Price = 18 }
            };

            var service = new PricingTierService();
            var tier = service.GetPricingTier(items);

            Assert.AreEqual("££", tier);
        }

        [TestMethod]
        public void GetPricingTier_WhenHighAverage_ReturnsTierThree()
        {
            var items = new List<MenuItem>
            {
                new MenuItem { Price = 25 },
                new MenuItem { Price = 30 }
            };

            var service = new PricingTierService();
            var tier = service.GetPricingTier(items);

            Assert.AreEqual("£££", tier);
        }

        [TestMethod]
        public void GetPricingTier_WhenNoItems_ReturnsUnknown()
        {
            var items = new List<MenuItem>();
            var service = new PricingTierService();

            var tier = service.GetPricingTier(items);

            Assert.AreEqual("Unknown", tier);
        }
    }
}
