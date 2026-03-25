using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Services
{
    public class TrailService : ITrailService
    {

        private readonly ITrailsDataAccess _dataAccess;

        public TrailService(ITrailsDataAccess dataAccess)
        {
           _dataAccess = dataAccess;
        }

        public async Task<IEnumerable<TrailDto>> GetAllTrailsAsync()
        {
            var trails = await _dataAccess.GetTrailsAsync();

            
            return trails ?? Enumerable.Empty<TrailDto>();
        }

        public async Task<HikingTrail?> GetTrailByIdAsync(int id)
        { 
            return await _dataAccess.GetByIdAsync(id);
        }

        public async Task<IEnumerable<PoiDto>> GetPoisNearTrailAsync(int trailId, double distanceMeters)
        {
            return await _dataAccess.GetNearbyPoisAsync(trailId, distanceMeters);
        }

    }
}