using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace EatMeOut.Tests
{
    public class RatingService
    {
        public double UpdateAverageRating(double currentAverage, int currentCount, int newRating)
        {
            return ((currentAverage * currentCount) + newRating) / (currentCount + 1);
        }
    }

    [TestClass]
    public class RatingLogicTests
    {
        [TestMethod]
        public void UpdateAverageRating_WithInitialRating_ReturnsCorrectAverage()
        {
            var service = new RatingService();
            double newAvg = service.UpdateAverageRating(0, 0, 4);

            Assert.AreEqual(4.0, newAvg);
        }

        [TestMethod]
        public void UpdateAverageRating_WithMultipleRatings_ReturnsCorrectAverage()
        {
            var service = new RatingService();
            double newAvg = service.UpdateAverageRating(4.0, 2, 5); // (4*2 + 5) / 3 = 4.33

            Assert.AreEqual(4.33, newAvg, 0.01); // Allow slight rounding error
        }

        [TestMethod]
        public void UpdateAverageRating_WithManyRatings_StaysAccurate()
        {
            var service = new RatingService();
            double newAvg = service.UpdateAverageRating(4.2, 10, 3); // (4.2*10 + 3) / 11

            Assert.AreEqual(4.09, newAvg, 0.01);
        }
    }
}
