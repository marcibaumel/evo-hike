using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models;
using evoHike.Backend.Models.DTO;
using evoHike.Backend.Models.DTOs;
using evoHike.Backend.Services.Interfaces;
using evoHike.Backend.Utils;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Algorithm;
using System.Text.Json;

namespace evoHike.Backend.Services
{
    public class PlannedHikeService(IPlannedHikeDataAccess plannedHike, WeatherService weatherService) : IPlannedHikeService
    {
        private readonly IPlannedHikeDataAccess _plannedHike = plannedHike;
        private readonly WeatherService _weatherService = weatherService;

        public async Task<IEnumerable<PlannedHikeEntity>> GetHikesAsync(HikeStatus? filterStatus = null, bool includeTrail = false)
        {
            var query = _plannedHike.GetBaseQuery();

            if (includeTrail)
            {
                query = query.Include(ph => ph.HikingTrail);
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

        public async Task<PlannedHikeWeatherDTO> GetHikeWeatherAssessmentAsync(int plannedHikeId)
        {
            var hike = await _plannedHike.GetBaseQuery()
                .Include(ph => ph.HikingTrail)
                .FirstOrDefaultAsync(ph => ph.Id == plannedHikeId);

            if (hike == null)
                throw new ArgumentException("Planned hike not found.");

            var dto = new PlannedHikeWeatherDTO
            {
                PlannedHikeId = hike.Id,
                TrailName = hike.HikingTrail.TrailName,
                StartDate = hike.PlannedStartDateTime,
                EndDate = hike.PlannedEndDateTime
            };

            var routeLine = hike.HikingTrail.RouteLine;

            if (routeLine != null && routeLine.Coordinates.Length > 0)
            {
                float lon = (float)routeLine.Coordinates[0].X;
                float lat = (float)routeLine.Coordinates[0].Y;

                if (hike.PlannedStartDateTime.Kind != DateTimeKind.Utc)
                {
                    throw new InvalidOperationException(
                        $"PlannedStartDateTime must be UTC, but was {hike.PlannedStartDateTime.Kind}.");
                }

                int daysUntilHike = (hike.PlannedStartDateTime.Date - DateTime.UtcNow.Date).Days;

                if (daysUntilHike >= 0 && daysUntilHike <= 14)
                {
                    var forecasts = await _weatherService.GetWeatherForecastAsync(
                        lat, lon, daysUntilHike + 1, hike.PlannedStartDateTime.Hour, hike.PlannedEndDateTime.Hour);

                    if (forecasts != null)
                    {
                        var hikeDayForecasts = forecasts
                            .Where(f => f.ForecastDatetime?.Date == hike.PlannedStartDateTime.Date)
                            .ToList();

                        var (isDangerous, reason) = WeatherDangerAnalyzer.AnalyzeForecast(hikeDayForecasts);

                        dto.Forecasts = hikeDayForecasts;
                        dto.IsWeatherDangerous = isDangerous;
                        dto.DangerWarning = reason;
                    }
                }
                else
                {
                    dto.DangerWarning = daysUntilHike < 0 ? "This hike is in the past." : "Hike date is outside the 14-day weather forecast window.";
                }
            }
            return dto;
        }
    }
}