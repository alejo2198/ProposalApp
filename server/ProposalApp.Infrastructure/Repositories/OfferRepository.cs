using Microsoft.EntityFrameworkCore;
using ProposalApp.Core.Entities;
using ProposalApp.Core.Interfaces;
using ProposalApp.Infrastructure.Data;

namespace ProposalApp.Infrastructure.Repositories;

public class OfferRepository : IOfferRepository
{
    private readonly AppDbContext _context;

    public OfferRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Offer>> GetByListingIdAsync(int listingId)
        => await _context.Offers
            .Include(o => o.Buyer)
            .Include(o => o.Listing)
            .Where(o => o.ListingId == listingId)
            .ToListAsync();

    public async Task<IEnumerable<Offer>> GetByBuyerIdAsync(int buyerId)
        => await _context.Offers
            .Include(o => o.Listing)
            .Where(o => o.BuyerId == buyerId)
            .ToListAsync();

    public async Task<Offer?> GetByIdAsync(int id)
        => await _context.Offers
            .Include(o => o.Buyer)
            .Include(o => o.Listing)
            .FirstOrDefaultAsync(o => o.Id == id);

    public async Task<Offer> CreateAsync(Offer offer)
    {
        _context.Offers.Add(offer);
        await _context.SaveChangesAsync();
        return offer;
    }

    public async Task UpdateAsync(Offer offer)
    {
        offer.UpdatedAt = DateTime.UtcNow;
        _context.Offers.Update(offer);
        await _context.SaveChangesAsync();
    }

    public async Task<OfferSummary> GetOfferSummaryAsync(int listingId)
    {
        var offers = await _context.Offers
            .Where(o => o.ListingId == listingId)
            .ToListAsync();

        return new OfferSummary(
            listingId,
            offers.Count,
            offers.Any() ? offers.Max(o => o.OfferAmount) : 0,
            offers.Any() ? offers.Average(o => o.OfferAmount) : 0
        );
    }
}