using evoHike.Backend.Models;
using evoHike.Backend.Models.DTO;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

namespace evoHike.Backend.DataAccess.Interfaces
{
    public interface ITrailsDataAccess
    {
        Task<IEnumerable<TrailDTO>> GetTrailsAsync();
        Task<HikingTrailEntity?> GetByIdAsync(int id);
        Task<HikingTrailEntity?> GetTrailByIdAsync(int trailId);
        Task<List<PointOfInterestEntity>> GetPoisWithinDistanceAsync(Geometry region, double distanceMeters);
    }
}
