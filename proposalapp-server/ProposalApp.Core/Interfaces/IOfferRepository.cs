using ProposalApp.Core.Entities;

namespace ProposalApp.Core.Interfaces;

public interface IOfferRepository
{
    Task<IEnumerable<Offer>> GetByListingIdAsync(int listingId);
    Task<IEnumerable<Offer>> GetByBuyerIdAsync(int buyerId);
    Task<Offer?> GetByIdAsync(int id);
    Task<Offer> CreateAsync(Offer offer);
    Task UpdateAsync(Offer offer);
    Task<OfferSummary> GetOfferSummaryAsync(int listingId);
}

public record OfferSummary(int ListingId, int TotalOffers, decimal HighestOffer, decimal AverageOffer);