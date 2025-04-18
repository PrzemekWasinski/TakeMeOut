using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace EatMeOut.Tests
{
    public class User
    {
        public decimal Credit { get; set; }
    }

    public class CreditService
    {
        public bool DeductCredit(User user, decimal amount)
        {
            if (user.Credit < amount)
                return false;
            user.Credit -= amount;
            return true;
        }
    }

    [TestClass]
    public class CreditLogicTests
    {
        [TestMethod]
        public void DeductCredit_WhenSufficientBalance_ShouldSucceed()
        {
            var user = new User { Credit = 50.00m };
            var service = new CreditService();

            var result = service.DeductCredit(user, 20.00m);

            Assert.IsTrue(result);
            Assert.AreEqual(30.00m, user.Credit);
        }

        [TestMethod]
        public void DeductCredit_WhenInsufficientBalance_ShouldFail()
        {
            var user = new User { Credit = 10.00m };
            var service = new CreditService();

            var result = service.DeductCredit(user, 20.00m);

            Assert.IsFalse(result);
            Assert.AreEqual(10.00m, user.Credit);
        }

        [TestMethod]
        public void DeductCredit_WhenExactBalance_ShouldReduceToZero()
        {
            var user = new User { Credit = 20.00m };
            var service = new CreditService();

            var result = service.DeductCredit(user, 20.00m);

            Assert.IsTrue(result);
            Assert.AreEqual(0.00m, user.Credit);
        }
    }
}
