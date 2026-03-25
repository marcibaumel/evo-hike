using evoHike.Backend.Models;
using evoHike.Backend.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.DataAccess.Interfaces
{
    public interface ITrailsDataAccess
    {

        Task<IEnumerable<TrailDTO>> GetTrailsAsync();
        Task<HikingTrail?> GetByIdAsync(int id);
        Task<IEnumerable<PoiDTO>> GetNearbyPoisAsync(int trailId, double distance); 


    }
}
