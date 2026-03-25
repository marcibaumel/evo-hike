using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models;
using evoHike.Backend.Models.DTOs;
using evoHike.Backend.Services.Interfaces;

namespace evoHike.Backend.Services
{
    public class PlannedHikeService : IPlannedHikeService
    {
        private readonly IPlannedHikeDataAccess _plannedHike;
        public PlannedHikeService(IPlannedHikeDataAccess plannedHike)
        {
            _plannedHike = plannedHike;
        }

        public async Task<IEnumerable<PlannedHikeEntity>> GetAllPlannedHikesAsync(HikeStatus? filterStatus = null)
        {
            var plannedHikeEntities = await _plannedHike.GetAllPlannedHikesAsync();

            return plannedHikeEntities ?? Enumerable.Empty<PlannedHikeEntity>();
        }

        public async Task<PlannedHikeEntity> CreatePlannedHikeAsync(PlannedHikeDTO request)
        {
            var newPlan= await _plannedHike.CreatePlannedHikeAsync(request);

            return newPlan;
        }

        public async Task<bool> MarkHikeAsCompletedAsync(int id)
        {
            var hike = await _plannedHike.MarkHikeAsCompletedAsync(id);
            return hike;
        }
    }
}