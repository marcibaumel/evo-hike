using evoHike.Backend.Models;
using evoHike.Backend.Models.DTOs;
using System.Linq.Expressions;

namespace evoHike.Backend.DataAccess.Interfaces
{
    public interface IPlannedHikeDataAccess
    {
        Task<bool> TrailExistsAsync(int trailId);
        Task<PlannedHikeEntity> AddHikeAsync(PlannedHikeEntity hike);
        IQueryable<PlannedHikeEntity> GetBaseQuery(params Expression<Func<PlannedHikeEntity, object>>[] includes);
        Task<PlannedHikeEntity?> FindHikeAsync(int trailId);
        Task SaveChangesAsync();
    }
}
