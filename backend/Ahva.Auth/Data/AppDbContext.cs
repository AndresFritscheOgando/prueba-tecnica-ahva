using Ahva.Auth.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ahva.Auth.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
            e.HasIndex(u => u.Username).IsUnique();
            e.Property(u => u.Email).HasMaxLength(256);
            e.Property(u => u.Username).HasMaxLength(50);
            e.Property(u => u.PasswordHash).HasMaxLength(256);
            e.Property(u => u.RefreshToken).HasMaxLength(512);
            e.Property(u => u.FirstName).HasMaxLength(150);
            e.Property(u => u.PaternalSurname).HasMaxLength(100);
            e.Property(u => u.MaternalSurname).HasMaxLength(100);
            e.Property(u => u.DocumentType).HasMaxLength(20);
            e.Property(u => u.DocumentNumber).HasMaxLength(20);
            e.Property(u => u.Nationality).HasMaxLength(100);
            e.Property(u => u.Sex).HasMaxLength(20);
            e.Property(u => u.SecondaryEmail).HasMaxLength(256);
            e.Property(u => u.MobilePhone).HasMaxLength(20);
            e.Property(u => u.SecondaryPhoneType).HasMaxLength(20);
            e.Property(u => u.SecondaryPhone).HasMaxLength(20);
            e.Property(u => u.ContractType).HasMaxLength(50);
        });
    }
}
