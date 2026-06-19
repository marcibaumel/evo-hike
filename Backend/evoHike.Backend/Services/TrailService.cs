using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models;
using evoHike.Backend.Models.DTO;
using evoHike.Backend.Services.Interfaces;
using NetTopologySuite;
using NetTopologySuite.IO;

namespace evoHike.Backend.Services
{
    public class TrailService : ITrailService
    {
        private readonly ITrailsDataAccess _dataAccess;
        public TrailService(ITrailsDataAccess dataAccess)
        {
           _dataAccess = dataAccess;
        }

        public async Task<IEnumerable<TrailDTO>> GetAllTrailsAsync()
        {
            var trails = await _dataAccess.GetTrailsAsync();
            return trails ?? Enumerable.Empty<TrailDTO>();
        }

        public async Task<HikingTrailEntity?> GetTrailByIdAsync(int id)
        { 
           var trailById = await _dataAccess.GetByIdAsync(id);
           return trailById ?? throw new Exception("Something went wrong :/");
        }

        public async Task<IEnumerable<PoiDTO>> GetPoisNearTrailAsync(int trailId, double distanceMeters)
        {
            var trail = await _dataAccess.GetByIdAsync(trailId);
            if (trail == null) return Enumerable.Empty<PoiDTO>();
            if (trail.RouteLine == null) return Enumerable.Empty<PoiDTO>();
            var poiEntities = await _dataAccess.GetPoisWithinDistanceAsync(trail.RouteLine, distanceMeters);

            var poiDtos = poiEntities.Select(p => new PoiDTO
            {
                Id = p.Id,
                Name = p.PointOfInterestName
            });

            return poiDtos;
        }
        public async Task<TrailDTO> CreateTrailAsync(CreateTrailDTO dto)
        {
            Console.WriteLine($"--- Mentés indul! Túra neve: {dto.Name}, Táv: {dto.Length} ---");

            if (string.IsNullOrEmpty(dto.RouteLine))
            {
                throw new ArgumentException("Az útvonal (RouteLine) nem lehet üres!");
            }

            var reader = new GeoJsonReader();
            NetTopologySuite.Geometries.Geometry geometryRoute;

            try
            {
                geometryRoute = reader.Read<NetTopologySuite.Geometries.Geometry>(dto.RouteLine);
                
                if (geometryRoute != null)
                {
                    geometryRoute.SRID = 4326;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Hibás GeoJSON formátum! Részletek: {ex.Message}");
            }

            var newTrailEntity = new HikingTrailEntity
            {
                TrailName = dto.Name,
                Description = dto.Description,
                Length = dto.Length,
                Difficulty = dto.Difficulty,
                EstimatedDuration = dto.Time,
                RouteLine = geometryRoute, 
                CreatedAt = DateTime.UtcNow,
        
                StartLocation = "Egyéni túra",
                EndLocation = "Egyéni túra",
                CoverPhotoPath = "",
                TrailSymbol = "Egyéni",
                Rating = 0,
                ReviewCount = 0,
                Elevation = 0
            };
    
            Console.WriteLine($"--- Entitás sikeresen felépítve, pontok száma: {geometryRoute?.NumPoints} ---");
    
            await _dataAccess.AddTrailAsync(newTrailEntity);
    
            return new TrailDTO(newTrailEntity);
        }
    }
}