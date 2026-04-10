using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models;
using evoHike.Backend.Models.DTO;
using evoHike.Backend.Services.Interfaces;

namespace evoHike.Backend.Services
{
    public class TrailService : ITrailService
    {
        private readonly ITrailsDataAccess _dataAccess;
        public TrailService(ITrailsDataAccess dataAccess)
        {
           _dataAccess = dataAccess;
        }
        public async Task<IEnumerable<TrailDTO>> GetAllTrailsAsync()
        {
            var trails = await _dataAccess.GetTrailsAsync();
            return trails ?? Enumerable.Empty<TrailDTO>();
        }
        public async Task<HikingTrailEntity?> GetTrailByIdAsync(int id)
        { 
           var trailById = await _dataAccess.GetByIdAsync(id);
           return trailById ?? throw new Exception("Something went wrong :/");
        }
        public async Task<IEnumerable<PoiDTO>> GetPoisNearTrailAsync(int trailId, double distanceMeters)
        {
            var trail = await _dataAccess.GetByIdAsync(trailId);
            if (trail == null) return Enumerable.Empty<PoiDTO>();
            if (trail.RouteLine == null) return Enumerable.Empty<PoiDTO>();
            var poiEntities = await _dataAccess.GetPoisWithinDistanceAsync(trail.RouteLine, distanceMeters);

            var poiDtos = poiEntities.Select(p => new PoiDTO
            {
                Id = p.Id,
                Name = p.PointOfInterestName
            });

            return poiDtos;
        }
    }
}