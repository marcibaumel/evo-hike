using evoHike.Backend.Models;
using evoHike.Backend.Models.DTOs;

namespace evoHike.Backend.Services.Interfaces
{
    public interface IPlannedHikeService
    {
        Task<IEnumerable<PlannedHikeEntity>> GetHikesAsync(HikeStatus? filterStatus = null, bool includeTrail = false);
        Task<PlannedHikeEntity> CreatePlannedHikeAsync(PlannedHikeDTO request, int userId);

        Task JoinHikeAsync(int hikeId, int userId);
        Task<bool> MarkHikeAsCompletedAsync(int id);
    }
}