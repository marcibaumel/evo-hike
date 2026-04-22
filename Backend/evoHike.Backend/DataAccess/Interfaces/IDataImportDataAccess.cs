using evoHike.Backend.Models;

namespace evoHike.Backend.DataAccess.Interfaces
{
    public interface IDataImportDataAccess
    {
        Task ImportTrailsAsync(IEnumerable<HikingTrailEntity> trails);
        Task AddPoisAsync(IEnumerable<PointOfInterestEntity> pois);
        Task SaveChangesAsync();
    }
}
