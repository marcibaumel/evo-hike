using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.DataAccess.Interfaces
{
    public interface ITrailsDataAccess
    {

        Task<IEnumerable<TrailDto>> GetTrailsAsync();
        Task<HikingTrail?> GetByIdAsync(int id);
        Task<IEnumerable<PoiDto>> GetNearbyPoisAsync(int trailId, double distance); 


    }
}
