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
            var trails = await _context.HikingTrails
                .Include(t => t.Photos)
                .AsNoTracking()
                .ToListAsync();
            return trails.Select(t => new TrailDTO(t));
        }

        public async Task<HikingTrailEntity?> GetByIdAsync(int id)
        {
            return await _context.HikingTrails
                .Include(t => t.Photos)
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
        public async Task AddTrailAsync(HikingTrailEntity trail)
        {
            await _context.HikingTrails.AddAsync(trail);
            await _context.SaveChangesAsync();
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

