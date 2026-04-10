using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models;
using evoHike.Backend.Models.DTOs;
using evoHike.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace evoHike.Backend.Services
{
    public class PlannedHikeService : IPlannedHikeService
    {
        private readonly IPlannedHikeDataAccess _plannedHike;
        public PlannedHikeService(IPlannedHikeDataAccess plannedHike)
        {
            _plannedHike = plannedHike;
        }

        public async Task<IEnumerable<PlannedHikeEntity>> GetHikesAsync(HikeStatus? filterStatus = null,bool includeTrail = false) 
        {
            var query = _plannedHike.GetBaseQuery();

            if (includeTrail)
            {
                query = _plannedHike.GetBaseQuery(ph => ph.HikingTrail);
            }

            if (filterStatus.HasValue)
            {
                query = query.Where(ph => ph.Status == filterStatus.Value);
            }

            return await query
                .OrderBy(ph => ph.PlannedStartDateTime)
                .ToListAsync();
        }
        public async Task<PlannedHikeEntity> CreatePlannedHikeAsync(PlannedHikeDTO request)
        {
            if (request.RouteId == 0)
            {
                throw new ArgumentException("Route Id cannot be 0!");
            }
            if (!await _plannedHike.TrailExistsAsync(request.RouteId))
                throw new ArgumentException("No existing route with the given ID!");

            if (request.Start < DateTime.UtcNow.AddMinutes(-5))
                throw new ArgumentException("The start date of the route cannot be in the past!");

            if (request.End <= request.Start)
                throw new ArgumentException("The end date of the route must be later than the start date!");

            var newPlan = new PlannedHikeEntity
            {
                HikingTrailId = request.RouteId,
                PlannedStartDateTime = request.Start,
                PlannedEndDateTime = request.End,
                Status = HikeStatus.Planned,
                ChecklistJson = request.ChecklistItems?.Any() == true
                                ? JsonSerializer.Serialize(request.ChecklistItems)
                                : null,
                CreatedAt = DateTime.UtcNow
            };
            return await _plannedHike.AddHikeAsync(newPlan);
        }

        public async Task<bool> MarkHikeAsCompletedAsync(int id)
        {
            var hike = await _plannedHike.FindHikeAsync(id);

            if (hike == null) return false;

            hike.Status = HikeStatus.Completed;
            hike.CompletedAt = DateTime.UtcNow;

            await _plannedHike.SaveChangesAsync();

            return true;
        }
    }
}