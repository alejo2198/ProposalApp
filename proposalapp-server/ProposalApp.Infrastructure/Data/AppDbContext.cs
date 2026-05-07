using Microsoft.EntityFrameworkCore;
using ProposalApp.Core.Entities;

namespace ProposalApp.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Listing> Listings => Set<Listing>();
    public DbSet<Offer> Offers => Set<Offer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Listing>()
            .Property(l => l.AskingPrice)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Offer>()
            .Property(o => o.OfferAmount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Offer>()
            .Property(o => o.CounterOfferAmount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Offer>()
            .HasOne(o => o.Listing)
            .WithMany(l => l.Offers)
            .HasForeignKey(o => o.ListingId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Offer>()
            .HasOne(o => o.Buyer)
            .WithMany(u => u.Offers)
            .HasForeignKey(o => o.BuyerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}