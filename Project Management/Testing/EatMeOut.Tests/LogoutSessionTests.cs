using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace EatMeOut.Tests
{
    public class SessionManager
    {
        public bool IsTokenValid(string? token)
        {
            return !string.IsNullOrEmpty(token);
        }

        public bool CanAccessProtectedRoute(string? token)
        {
            return IsTokenValid(token);
        }
    }

    [TestClass]
    public class LogoutSessionTests
    {
        [TestMethod]
        public void TokenPresent_CanAccessProtectedRoute()
        {
            var session = new SessionManager();
            string token = "valid.jwt.token";

            Assert.IsTrue(session.CanAccessProtectedRoute(token));
        }

        [TestMethod]
        public void TokenMissing_CannotAccessProtectedRoute()
        {
            var session = new SessionManager();
            string? token = null;

            Assert.IsFalse(session.CanAccessProtectedRoute(token));
        }

        [TestMethod]
        public void TokenEmptyString_IsInvalid()
        {
            var session = new SessionManager();
            string token = "";

            Assert.IsFalse(session.IsTokenValid(token));
        }

        [TestMethod]
        public void TokenRemovedAfterLogout_IsInvalid()
        {
            var session = new SessionManager();
            string? token = null;

            Assert.IsFalse(session.IsTokenValid(token));
        }
    }
}
