using evoHike.Backend.Data;
using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.DataAccess
{
    public class TrailsDataAccess : ITrailsDataAccess
    {

        private readonly EvoHikeContext _context;
        public TrailsDataAccess(EvoHikeContext context) {
            _context = context;
        }

        public async Task<HikingTrail?> GetByIdAsync(int id)
        {
            return await _context.HikingTrails
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.TrailID == id);
        }

        public async Task<IEnumerable<PoiDto>> GetNearbyPoisAsync(int trailId, double distanceMeters)
        {
            var trail = await _context.HikingTrails.FindAsync(trailId);
            if (trail == null || trail.RouteLine == null) return Enumerable.Empty<PoiDto>();

            return await _context.PointsOfInterest
                .Where(poi => poi.Location.IsWithinDistance(trail.RouteLine, distanceMeters))
                .Select(p => new PoiDto
                {
                    Id = p.PointOfInterestId,
                    Name = p.PointOfInterestName
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<TrailDto>> GetTrailsAsync()
        {
            return await _context.HikingTrails
                .AsNoTracking() 
                .Select(t => new TrailDto
                {
                    Name = t.TrailName,
                    Difficulty = t.Difficulty
                })
                .ToListAsync();
        }
    }
       
}

