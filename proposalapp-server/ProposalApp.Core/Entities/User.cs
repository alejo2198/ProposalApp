namespace ProposalApp.Core.Entities;

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Buyer"; // "Agent" or "Buyer"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
}