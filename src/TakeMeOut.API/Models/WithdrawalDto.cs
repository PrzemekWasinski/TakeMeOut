namespace TakeMeOut.API.Models
{
    public class WithdrawalDto
    {
        public decimal Amount { get; set; }
        public string BankAccount { get; set; } = string.Empty;
        public string SortCode { get; set; } = string.Empty;
    }
} 