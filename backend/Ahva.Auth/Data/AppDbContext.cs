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
        });
    }
}
