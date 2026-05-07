namespace ProposalApp.Core.Entities;

public class Listing
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public decimal AskingPrice { get; set; }
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public double SquareFeet { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Status { get; set; } = "Active"; // "Active", "UnderContract", "Sold"
    public DateTime ListedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
}