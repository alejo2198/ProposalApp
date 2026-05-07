namespace ProposalApp.Core.DTOs;

public record OfferDto(
    int Id,
    int ListingId,
    string ListingTitle,
    string BuyerName,
    decimal OfferAmount,
    string Message,
    string Status,
    decimal? CounterOfferAmount,
    bool SignatureCompleted,
    DateTime CreatedAt
);

public record CreateOfferRequest(int ListingId, decimal OfferAmount, string Message);
public record CounterOfferRequest(decimal CounterOfferAmount);