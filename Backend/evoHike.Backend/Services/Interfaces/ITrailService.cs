using evoHike.Backend.Models;
using evoHike.Backend.Models.DTO;

namespace evoHike.Backend.Services.Interfaces
{
    public interface ITrailService
    {
        Task<IEnumerable<TrailDTO>> GetAllTrailsAsync();
        Task<HikingTrail?> GetTrailByIdAsync(int id);
        Task<IEnumerable<PoiDTO>> GetPoisNearTrailAsync(int trailId, double distanceMeters);
    }
}