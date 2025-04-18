using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Text.RegularExpressions;

namespace EatMeOut.Tests
{
    public class Validator
    {
        public bool IsValidEmail(string email)
        {
            // Fixed regex pattern (no extra backslashes)
            return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        }

        public bool IsStrongPassword(string password)
        {
            return password.Length >= 6;
        }
    }

    [TestClass]
    public class InputValidationTests
    {
        [TestMethod]
        public void EmailValidator_WithValidEmail_ReturnsTrue()
        {
            var validator = new Validator();
            Assert.IsTrue(validator.IsValidEmail("user@example.com"));
        }

        [TestMethod]
        public void EmailValidator_WithInvalidEmail_ReturnsFalse()
        {
            var validator = new Validator();
            Assert.IsFalse(validator.IsValidEmail("invalid-email"));
        }

        [TestMethod]
        public void PasswordValidator_WithWeakPassword_ReturnsFalse()
        {
            var validator = new Validator();
            Assert.IsFalse(validator.IsStrongPassword("abc"));
        }

        [TestMethod]
        public void PasswordValidator_WithStrongPassword_ReturnsTrue()
        {
            var validator = new Validator();
            Assert.IsTrue(validator.IsStrongPassword("Secure123"));
        }
    }
}
