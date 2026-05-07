namespace ProposalApp.Core.Entities;

public class Offer
{
    public int Id { get; set; }
    public int ListingId { get; set; }
    public int BuyerId { get; set; }
    public decimal OfferAmount { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // "Pending", "Accepted", "Rejected", "Countered"
    public decimal? CounterOfferAmount { get; set; }
    public bool SignatureSent { get; set; } = false;
    public bool SignatureCompleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Listing Listing { get; set; } = null!;
    public User Buyer { get; set; } = null!;
}