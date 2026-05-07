using Microsoft.AspNetCore.SignalR;

namespace ProposalApp.API.Hubs;

public class OfferHub : Hub
{
    public async Task JoinListingGroup(string listingId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"listing-{listingId}");
    }

    public async Task LeaveListingGroup(string listingId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"listing-{listingId}");
    }
}