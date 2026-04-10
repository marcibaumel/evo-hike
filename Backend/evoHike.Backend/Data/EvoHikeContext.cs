using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Data
{
    public class EvoHikeContext : DbContext
    {
        public EvoHikeContext(DbContextOptions<EvoHikeContext> options) : base(options)
        {
        }

        public DbSet<HikingTrailEntity> HikingTrails { get; set; } = null!;
        public DbSet<PointOfInterestEntity> PointsOfInterest { get; set; } = null!;
        public DbSet<PlannedHikeEntity> PlannedHikes { get; set; } = null!;
    }
}