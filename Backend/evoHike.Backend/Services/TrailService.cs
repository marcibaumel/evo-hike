using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models;
using evoHike.Backend.Models.DTO;
using evoHike.Backend.Services.Interfaces;
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

        public async Task<IEnumerable<TrailDTO>> GetAllTrailsAsync()
        {
            var trails = await _dataAccess.GetTrailsAsync();

            
            return trails ?? Enumerable.Empty<TrailDTO>();
        }

        public async Task<HikingTrail?> GetTrailByIdAsync(int id)
        { 
            return await _dataAccess.GetByIdAsync(id);
        }

        public async Task<IEnumerable<PoiDTO>> GetPoisNearTrailAsync(int trailId, double distanceMeters)
        {
            return await _dataAccess.GetNearbyPoisAsync(trailId, distanceMeters);
        }

    }
}