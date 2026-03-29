using evoHike.Backend.Models;
using evoHike.Backend.Models.DTOs;

namespace evoHike.Backend.DataAccess.Interfaces
{
    public interface IPlannedHikeDataAccess
    {
        Task<IEnumerable<PlannedHikeEntity>> GetAllPlannedHikesAsync(HikeStatus? filterStatus = null);
        Task<PlannedHikeEntity> CreatePlannedHikeAsync(PlannedHikeDTO request);
        Task<bool> MarkHikeAsCompletedAsync(int id);
    }
}
