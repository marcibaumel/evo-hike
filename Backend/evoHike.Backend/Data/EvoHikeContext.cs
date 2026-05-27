using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var utcConverter = new ValueConverter<DateTime, DateTime>(
                v => NormalizeToUtc(v),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
            );

            var nullableUtcConverter = new ValueConverter<DateTime?, DateTime?>(
                v => v.HasValue ? NormalizeToUtc(v.Value) : v,
                v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v
            );

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime))
                    {
                        property.SetValueConverter(utcConverter);
                    }
                    else if (property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(nullableUtcConverter);
                    }
                }
            }
        }

        public override int SaveChanges()
        {
            NormalizeDateTimes();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            NormalizeDateTimes();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void NormalizeDateTimes()
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                foreach (var property in entry.Properties)
                {
                    if (property.CurrentValue is DateTime dt)
                        property.CurrentValue = NormalizeToUtc(dt);

                    else if (property.CurrentValue != null
                             && property.Metadata.ClrType == typeof(DateTime?))
                    {
                        var nullableDate = (DateTime?)property.CurrentValue;

                        if (nullableDate.HasValue)
                            property.CurrentValue = NormalizeToUtc(nullableDate.Value);
                    }
                }
            }
        }


        private static DateTime NormalizeToUtc(DateTime value)
        {
            return value.Kind switch
            {
                DateTimeKind.Utc => value,

                DateTimeKind.Local => value.ToUniversalTime(),

                DateTimeKind.Unspecified => DateTime.SpecifyKind(value, DateTimeKind.Utc),

                _ => throw new ArgumentOutOfRangeException(
                    nameof(value.Kind),
                    value.Kind,
                    "Unsupported DateTimeKind value.")
            };
        }
    }
}