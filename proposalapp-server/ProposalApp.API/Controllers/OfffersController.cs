using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ProposalApp.API.Hubs;
using ProposalApp.Core.DTOs;
using ProposalApp.Core.Entities;
using ProposalApp.Core.Interfaces;
using System.Security.Claims;

namespace ProposalApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OffersController : ControllerBase
{
    private readonly IOfferRepository _offerRepository;
    private readonly IListingRepository _listingRepository;
    private readonly IHubContext<OfferHub> _hubContext;

    public OffersController(
        IOfferRepository offerRepository,
        IListingRepository listingRepository,
        IHubContext<OfferHub> hubContext)
    {
        _offerRepository = offerRepository;
        _listingRepository = listingRepository;
        _hubContext = hubContext;
    }

    [HttpGet("listing/{listingId}")]
    [Authorize(Roles = "Agent")]
    public async Task<ActionResult<IEnumerable<OfferDto>>> GetByListing(int listingId)
    {
        var offers = await _offerRepository.GetByListingIdAsync(listingId);
        return Ok(offers.Select(MapToDto));
    }

    [HttpGet("my-offers")]
    [Authorize(Roles = "Buyer")]
    public async Task<ActionResult<IEnumerable<OfferDto>>> GetMyOffers()
    {
        var buyerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var offers = await _offerRepository.GetByBuyerIdAsync(buyerId);
        return Ok(offers.Select(MapToDto));
    }

    [HttpGet("summary/{listingId}")]
    [Authorize(Roles = "Agent")]
    public async Task<ActionResult<OfferSummary>> GetSummary(int listingId)
    {
        var summary = await _offerRepository.GetOfferSummaryAsync(listingId);
        return Ok(summary);
    }

    [HttpPost]
    [Authorize(Roles = "Buyer")]
    public async Task<ActionResult<OfferDto>> Create(CreateOfferRequest request)
    {
        var listing = await _listingRepository.GetByIdAsync(request.ListingId);
        if (listing == null) return NotFound("Listing not found.");
        if (listing.Status != "Active") return BadRequest("Listing is no longer active.");

        var buyerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var buyerName = User.FindFirst(ClaimTypes.Name)!.Value;

        var offer = new Offer
        {
            ListingId = request.ListingId,
            BuyerId = buyerId,
            OfferAmount = request.OfferAmount,
            Message = request.Message,
            Status = "Pending"
        };

        var created = await _offerRepository.CreateAsync(offer);

        // Notify agents via SignalR
        await _hubContext.Clients.Group($"listing-{request.ListingId}")
            .SendAsync("NewOffer", new
            {
                offerId = created.Id,
                listingId = request.ListingId,
                listingTitle = listing.Title,
                buyerName,
                offerAmount = request.OfferAmount,
                message = request.Message,
                createdAt = created.CreatedAt
            });

        return CreatedAtAction(nameof(GetByListing), new { listingId = created.ListingId }, MapToDto(created));
    }

    [HttpPut("{id}/accept")]
    [Authorize(Roles = "Agent")]
    public async Task<IActionResult> Accept(int id)
    {
        var offer = await _offerRepository.GetByIdAsync(id);
        if (offer == null) return NotFound();

        offer.Status = "Accepted";
        offer.Listing.Status = "UnderContract";

        await _offerRepository.UpdateAsync(offer);
        await _listingRepository.UpdateAsync(offer.Listing);

        await _hubContext.Clients.Group($"listing-{offer.ListingId}")
            .SendAsync("OfferUpdated", new { offerId = id, status = "Accepted" });

        return Ok(MapToDto(offer));
    }

    [HttpPut("{id}/reject")]
    [Authorize(Roles = "Agent")]
    public async Task<IActionResult> Reject(int id)
    {
        var offer = await _offerRepository.GetByIdAsync(id);
        if (offer == null) return NotFound();

        offer.Status = "Rejected";
        await _offerRepository.UpdateAsync(offer);

        await _hubContext.Clients.Group($"listing-{offer.ListingId}")
            .SendAsync("OfferUpdated", new { offerId = id, status = "Rejected" });

        return Ok(MapToDto(offer));
    }

    [HttpPut("{id}/counter")]
    [Authorize(Roles = "Agent")]
    public async Task<IActionResult> Counter(int id, CounterOfferRequest request)
    {
        var offer = await _offerRepository.GetByIdAsync(id);
        if (offer == null) return NotFound();

        offer.Status = "Countered";
        offer.CounterOfferAmount = request.CounterOfferAmount;
        await _offerRepository.UpdateAsync(offer);

        await _hubContext.Clients.Group($"listing-{offer.ListingId}")
            .SendAsync("OfferUpdated", new { offerId = id, status = "Countered", counterAmount = request.CounterOfferAmount });

        return Ok(MapToDto(offer));
    }

    private static OfferDto MapToDto(Offer o) => new(
        o.Id,
        o.ListingId,
        o.Listing?.Title ?? "",
        o.Buyer?.FullName ?? "",
        o.OfferAmount,
        o.Message,
        o.Status,
        o.CounterOfferAmount,
        o.SignatureCompleted,
        o.CreatedAt
    );
}