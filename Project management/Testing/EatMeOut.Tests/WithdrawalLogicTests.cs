using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace EatMeOut.Tests
{
    public class RestaurantAccount
    {
        public decimal Balance { get; set; }

        public bool Withdraw(decimal amount)
        {
            if (amount <= 0 || amount > Balance)
                return false;

            Balance -= amount;
            return true;
        }
    }

    [TestClass]
    public class WithdrawalLogicTests
    {
        [TestMethod]
        public void Withdraw_WithSufficientBalance_Succeeds()
        {
            var account = new RestaurantAccount { Balance = 100.00m };
            bool result = account.Withdraw(50.00m);

            Assert.IsTrue(result);
            Assert.AreEqual(50.00m, account.Balance);
        }

        [TestMethod]
        public void Withdraw_WithExactBalance_Succeeds()
        {
            var account = new RestaurantAccount { Balance = 75.00m };
            bool result = account.Withdraw(75.00m);

            Assert.IsTrue(result);
            Assert.AreEqual(0.00m, account.Balance);
        }

        [TestMethod]
        public void Withdraw_ExceedingBalance_Fails()
        {
            var account = new RestaurantAccount { Balance = 30.00m };
            bool result = account.Withdraw(50.00m);

            Assert.IsFalse(result);
            Assert.AreEqual(30.00m, account.Balance);
        }

        [TestMethod]
        public void Withdraw_NegativeAmount_Fails()
        {
            var account = new RestaurantAccount { Balance = 100.00m };
            bool result = account.Withdraw(-20.00m);

            Assert.IsFalse(result);
            Assert.AreEqual(100.00m, account.Balance);
        }
    }
}
