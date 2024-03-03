using Microsoft.EntityFrameworkCore;

namespace ChatApp.Web.Models;

public class DatabaseContext : DbContext
{
  public DatabaseContext(DbContextOptions<DatabaseContext> options)
      : base(options) { }

  public DbSet<User> Users => Set<User>();

  public DbSet<Tile> Tiles => Set<Tile>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tile>()
                .HasKey(t => t.Id); // Define the primary key for the Tile entity
        }
}