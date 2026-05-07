using Microsoft.EntityFrameworkCore;
using ProposalApp.Core.Entities;
using ProposalApp.Core.Interfaces;
using ProposalApp.Infrastructure.Data;

namespace ProposalApp.Infrastructure.Repositories;

public class ListingRepository : IListingRepository
{
    private readonly AppDbContext _context;

    public ListingRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Listing>> GetAllAsync()
        => await _context.Listings.Include(l => l.Offers).ToListAsync();

    public async Task<Listing?> GetByIdAsync(int id)
        => await _context.Listings.Include(l => l.Offers).FirstOrDefaultAsync(l => l.Id == id);

    public async Task<Listing> CreateAsync(Listing listing)
    {
        _context.Listings.Add(listing);
        await _context.SaveChangesAsync();
        return listing;
    }

    public async Task UpdateAsync(Listing listing)
    {
        listing.ListedAt = listing.ListedAt;
        _context.Listings.Update(listing);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var listing = await _context.Listings.FindAsync(id);
        if (listing != null)
        {
            _context.Listings.Remove(listing);
            await _context.SaveChangesAsync();
        }
    }
}