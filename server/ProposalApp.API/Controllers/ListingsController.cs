using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProposalApp.Core.DTOs;
using ProposalApp.Core.Entities;
using ProposalApp.Core.Interfaces;
using System.Security.Claims;

namespace ProposalApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListingsController : ControllerBase
{
    private readonly IListingRepository _listingRepository;

    public ListingsController(IListingRepository listingRepository)
    {
        _listingRepository = listingRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ListingDto>>> GetAll()
    {
        var listings = await _listingRepository.GetAllAsync();
        return Ok(listings.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ListingDto>> GetById(int id)
    {
        var listing = await _listingRepository.GetByIdAsync(id);
        if (listing == null) return NotFound();
        return Ok(MapToDto(listing));
    }

    [HttpPost]
    [Authorize(Roles = "Agent")]
    public async Task<ActionResult<ListingDto>> Create(CreateListingRequest request)
    {
        var listing = new Listing
        {
            Title = request.Title,
            Address = request.Address,
            City = request.City,
            Province = request.Province,
            PostalCode = request.PostalCode,
            AskingPrice = request.AskingPrice,
            Bedrooms = request.Bedrooms,
            Bathrooms = request.Bathrooms,
            SquareFeet = request.SquareFeet,
            Description = request.Description,
            ImageUrl = request.ImageUrl,
            Status = "Active"
        };

        var created = await _listingRepository.CreateAsync(listing);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, MapToDto(created));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Agent")]
    public async Task<IActionResult> Update(int id, CreateListingRequest request)
    {
        var listing = await _listingRepository.GetByIdAsync(id);
        if (listing == null) return NotFound();

        listing.Title = request.Title;
        listing.Address = request.Address;
        listing.City = request.City;
        listing.Province = request.Province;
        listing.PostalCode = request.PostalCode;
        listing.AskingPrice = request.AskingPrice;
        listing.Bedrooms = request.Bedrooms;
        listing.Bathrooms = request.Bathrooms;
        listing.SquareFeet = request.SquareFeet;
        listing.Description = request.Description;
        listing.ImageUrl = request.ImageUrl;

        await _listingRepository.UpdateAsync(listing);
        return Ok(MapToDto(listing));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Agent")]
    public async Task<IActionResult> Delete(int id)
    {
        var listing = await _listingRepository.GetByIdAsync(id);
        if (listing == null) return NotFound();
        await _listingRepository.DeleteAsync(id);
        return NoContent();
    }

    private static ListingDto MapToDto(Listing l) => new(
        l.Id,
        l.Title,
        l.Address,
        l.City,
        l.Province,
        l.AskingPrice,
        l.Bedrooms,
        l.Bathrooms,
        l.SquareFeet,
        l.Description,
        l.ImageUrl,
        l.Status,
        l.Offers.Count
    );
}