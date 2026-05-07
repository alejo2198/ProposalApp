using ProposalApp.Core.Entities;

namespace ProposalApp.Core.Interfaces;

public interface IListingRepository
{
    Task<IEnumerable<Listing>> GetAllAsync();
    Task<Listing?> GetByIdAsync(int id);
    Task<Listing> CreateAsync(Listing listing);
    Task UpdateAsync(Listing listing);
    Task DeleteAsync(int id);
}