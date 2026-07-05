using evoHike.Backend.Data;
using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models;
using evoHike.Backend.Models.DTO;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

namespace evoHike.Backend.DataAccess
{
    public class TrailsDataAccess : ITrailsDataAccess
    {
        private readonly EvoHikeContext _context;
        public TrailsDataAccess(EvoHikeContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TrailDTO>> GetTrailsAsync()
        {
            return await _context.HikingTrails
                .AsNoTracking()
                .Select(t => new TrailDTO
                {
                    Id = t.Id,
                    Name = t.TrailName,
                    Location = t.StartLocation,
                    Length = t.Length,
                    Difficulty = t.Difficulty,
                    ElevationGain = t.Elevation,
                    Rating = t.Rating,
                    ReviewCount = t.ReviewCount,
                    EstimatedDuration = t.EstimatedDuration,
                    CoverPhotoPath = t.CoverPhotoPath
                })
                .ToListAsync();
        }

        public async Task<HikingTrailEntity?> GetByIdAsync(int id)
        {
            return await _context.HikingTrails
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<HikingTrailEntity?> GetTrailByIdAsync(int trailId)
        {
            return await _context.HikingTrails.FindAsync(trailId);
        }

        public async Task<List<PointOfInterestEntity>> GetPoisWithinDistanceAsync(Geometry region, double distanceMeters)
        {

            return await _context.PointsOfInterest
                .Where(poi => poi.Location.IsWithinDistance(region, distanceMeters))
                .ToListAsync();
        }
        public async Task<HikingTrailEntity> AddTrailAsync(HikingTrailEntity trail)
        {
            _context.HikingTrails.Add(trail);
            await _context.SaveChangesAsync();
            return trail;
        }
        public async Task<bool> DeleteTrailAsync(int id)
        {
            var trail = await _context.HikingTrails.FindAsync(id);
            if (trail == null) return false;

            _context.HikingTrails.Remove(trail);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> AddParticipantAsync(int plannedHikeId, int userId)
        {
            var exists = await _context.HikeParticipants
                .AnyAsync(hp => hp.PlannedHikeId == plannedHikeId && hp.UserId == userId);

            if (exists) return false;

            _context.HikeParticipants.Add(new HikeParticipant
            {
                PlannedHikeId = plannedHikeId,
                UserId = userId,
                JoinedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            return true;
        }
    }
       
}

