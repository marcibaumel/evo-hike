using evoHike.Backend.Data;
using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models;
using evoHike.Backend.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.DataAccess
{
    public class TrailsDataAccess : ITrailsDataAccess
    {
        private readonly EvoHikeContext _context;
        public TrailsDataAccess(EvoHikeContext context) {
            _context = context;
        }
        public async Task<IEnumerable<TrailDTO>> GetTrailsAsync()
        {
            return await _context.HikingTrails
                .AsNoTracking()
                .Select(t => new TrailDTO
                {
                    Name = t.TrailName,
                    Difficulty = t.Difficulty
                })
                .ToListAsync();
        }
        public async Task<HikingTrailEntity?> GetByIdAsync(int id)
        {
            return await _context.HikingTrails
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<IEnumerable<PoiDTO>> GetNearbyPoisAsync(int trailId, double distanceMeters)
        {
            var trail = await _context.HikingTrails.FindAsync(trailId);
            if (trail == null || trail.RouteLine == null) return Enumerable.Empty<PoiDTO>();

            return await _context.PointsOfInterest
                .Where(poi => poi.Location.IsWithinDistance(trail.RouteLine, distanceMeters))
                .Select(p => new PoiDTO
                {
                    Id = p.Id,
                    Name = p.PointOfInterestName
                })
                .ToListAsync();
        }
    }
       
}

