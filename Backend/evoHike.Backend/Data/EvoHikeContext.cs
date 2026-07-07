using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Data
{
    public class EvoHikeContext : DbContext
    {
        public EvoHikeContext(DbContextOptions<EvoHikeContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<HikingTrailEntity> HikingTrails { get; set; } = null!;
        public DbSet<PointOfInterestEntity> PointsOfInterest { get; set; } = null!;
        public DbSet<PlannedHikeEntity> PlannedHikes { get; set; } = null!;
        public DbSet<TrailPhotoEntity> TrailPhotos { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<HikingTrailEntity>()
                .HasMany(h => h.Photos)
                .WithOne() 
                .HasForeignKey(p => p.HikingTrailId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}