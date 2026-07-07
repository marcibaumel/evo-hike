using evoHike.Backend.Models;

namespace evoHike.Backend.DataAccess.Interfaces
{
    public interface IPlannedHikeDataAccess
    {
        IQueryable<PlannedHikeEntity> GetBaseQuery();
        Task<bool> TrailExistsAsync(int trailId);
        Task<PlannedHikeEntity> AddHikeAsync(PlannedHikeEntity hike);
        Task<PlannedHikeEntity?> FindHikeAsync(int trailId);
        Task SaveChangesAsync();
        Task<bool> AddParticipantAsync(int plannedHikeId, int userId);
        Task<bool> HasUserJoinedAsync(int hikeId, int userId);
    }
}
