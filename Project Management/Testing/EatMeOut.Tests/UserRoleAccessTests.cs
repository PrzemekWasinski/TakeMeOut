using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace EatMeOut.Tests
{
    public enum Role
    {
        User,
        Restaurant
    }

    public class AccessControl
    {
        public bool CanAccessUserPage(Role role) => role == Role.User;
        public bool CanAccessRestaurantDashboard(Role role) => role == Role.Restaurant;
    }

    [TestClass]
    public class UserRoleAccessTests
    {
        [TestMethod]
        public void User_CanAccessUserPages()
        {
            var control = new AccessControl();
            Assert.IsTrue(control.CanAccessUserPage(Role.User));
        }

        [TestMethod]
        public void Restaurant_CannotAccessUserPages()
        {
            var control = new AccessControl();
            Assert.IsFalse(control.CanAccessUserPage(Role.Restaurant));
        }

        [TestMethod]
        public void Restaurant_CanAccessDashboard()
        {
            var control = new AccessControl();
            Assert.IsTrue(control.CanAccessRestaurantDashboard(Role.Restaurant));
        }

        [TestMethod]
        public void User_CannotAccessRestaurantDashboard()
        {
            var control = new AccessControl();
            Assert.IsFalse(control.CanAccessRestaurantDashboard(Role.User));
        }
    }
}
