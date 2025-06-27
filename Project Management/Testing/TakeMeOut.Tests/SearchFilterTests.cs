using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;

namespace EatMeOut.Tests
{
    public class Restaurant
    {
        public string Name { get; set; } = default!;
        public string Cuisine { get; set; } = default!;
        public List<string> MenuItems { get; set; } = default!;
    }

    public class SearchService
    {
        public List<Restaurant> FilterRestaurants(List<Restaurant> all, string keyword)
        {
            keyword = keyword.ToLower();
            return all.Where(r =>
                r.Name.ToLower().Contains(keyword) ||
                r.Cuisine.ToLower().Contains(keyword) ||
                r.MenuItems.Any(i => i.ToLower().Contains(keyword))
            ).ToList();
        }
    }

    [TestClass]
    public class SearchFilterTests
    {
        private List<Restaurant> sampleData = new List<Restaurant>
        {
            new Restaurant { Name = "Bella Pizza", Cuisine = "Italian", MenuItems = new List<string> { "Pepperoni Pizza", "Lasagna" } },
            new Restaurant { Name = "Sushi Zen", Cuisine = "Japanese", MenuItems = new List<string> { "Salmon Roll", "Miso Soup" } },
            new Restaurant { Name = "Grill House", Cuisine = "American", MenuItems = new List<string> { "Burger", "Fries" } }
        };

        [TestMethod]
        public void Filter_ByName_ReturnsCorrectRestaurant()
        {
            var service = new SearchService();
            var result = service.FilterRestaurants(sampleData, "bella");

            Assert.AreEqual(1, result.Count);
            Assert.AreEqual("Bella Pizza", result[0].Name);
        }

        [TestMethod]
        public void Filter_ByCuisine_ReturnsCorrectRestaurant()
        {
            var service = new SearchService();
            var result = service.FilterRestaurants(sampleData, "japanese");

            Assert.AreEqual(1, result.Count);
            Assert.AreEqual("Sushi Zen", result[0].Name);
        }

        [TestMethod]
        public void Filter_ByMenuItem_ReturnsCorrectRestaurant()
        {
            var service = new SearchService();
            var result = service.FilterRestaurants(sampleData, "fries");

            Assert.AreEqual(1, result.Count);
            Assert.AreEqual("Grill House", result[0].Name);
        }

        [TestMethod]
        public void Filter_WithNoMatch_ReturnsEmptyList()
        {
            var service = new SearchService();
            var result = service.FilterRestaurants(sampleData, "vegan");

            Assert.AreEqual(0, result.Count);
        }
    }
}
