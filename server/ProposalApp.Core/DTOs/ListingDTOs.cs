namespace ProposalApp.Core.DTOs;

public record ListingDto(
    int Id,
    string Title,
    string Address,
    string City,
    string Province,
    decimal AskingPrice,
    int Bedrooms,
    int Bathrooms,
    double SquareFeet,
    string Description,
    string ImageUrl,
    string Status,
    int OfferCount
);

public record CreateListingRequest(
    string Title,
    string Address,
    string City,
    string Province,
    string PostalCode,
    decimal AskingPrice,
    int Bedrooms,
    int Bathrooms,
    double SquareFeet,
    string Description,
    string ImageUrl
);