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
    }
       
}

