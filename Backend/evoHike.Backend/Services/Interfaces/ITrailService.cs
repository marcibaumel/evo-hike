using evoHike.Backend.Models;
using evoHike.Backend.Models.DTO;
using NetTopologySuite.Geometries;

namespace evoHike.Backend.Services.Interfaces
{
    public interface ITrailService
    {
        Task<IEnumerable<TrailDTO>> GetAllTrailsAsync();
        Task<HikingTrailEntity?> GetTrailByIdAsync(int id);
        Task<IEnumerable<PoiDTO>> GetPoisNearTrailAsync(int trailId, double distanceMeters);
    }
}