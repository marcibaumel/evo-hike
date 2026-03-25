using evoHike.Backend.Models;

namespace evoHike.Backend.Services
{
    public interface ITrailService
    {


        Task<IEnumerable<TrailDto>> GetAllTrailsAsync();
        Task<HikingTrail?> GetTrailByIdAsync(int id);
        Task<IEnumerable<PoiDto>> GetPoisNearTrailAsync(int trailId, double distanceMeters);
    }
}