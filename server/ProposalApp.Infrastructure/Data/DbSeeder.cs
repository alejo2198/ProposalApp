using Microsoft.EntityFrameworkCore;
using ProposalApp.Core.Entities;

namespace ProposalApp.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Listings.AnyAsync()) return; // Already seeded

        var listings = new List<Listing>
        {
            new Listing
            {
                Title = "Modern Downtown Condo",
                Address = "123 King St W",
                City = "Toronto",
                Province = "ON",
                PostalCode = "M5H 1J9",
                AskingPrice = 899000,
                Bedrooms = 2,
                Bathrooms = 2,
                SquareFeet = 950,
                Description = "Stunning condo in the heart of downtown Toronto with panoramic city views.",
                ImageUrl = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
                Status = "Active"
            },
            new Listing
            {
                Title = "Scarborough Family Home",
                Address = "456 Danforth Ave",
                City = "Toronto",
                Province = "ON",
                PostalCode = "M4K 1N7",
                AskingPrice = 1250000,
                Bedrooms = 4,
                Bathrooms = 3,
                SquareFeet = 2100,
                Description = "Spacious family home with large backyard, updated kitchen, and finished basement.",
                ImageUrl = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
                Status = "Active"
            },
            new Listing
            {
                Title = "North York Townhouse",
                Address = "789 Yonge St",
                City = "Toronto",
                Province = "ON",
                PostalCode = "M2N 6K8",
                AskingPrice = 975000,
                Bedrooms = 3,
                Bathrooms = 2,
                SquareFeet = 1400,
                Description = "Beautiful townhouse steps from the subway, modern finishes throughout.",
                ImageUrl = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
                Status = "Active"
            }
        };

        await context.Listings.AddRangeAsync(listings);

        // Seed a default agent account
        if (!await context.Users.AnyAsync())
        {
            var agent = new User
            {
                FullName = "Agent Mike",
                Email = "mike@propflow.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Role = "Agent"
            };

            var buyer = new User
            {
                FullName = "Jane Buyer",
                Email = "jane@propflow.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Role = "Buyer"
            };

            await context.Users.AddRangeAsync(agent, buyer);
        }

        await context.SaveChangesAsync();
    }
}