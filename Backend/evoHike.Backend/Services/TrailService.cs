using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models;
using evoHike.Backend.Models.DTO;
using evoHike.Backend.Services.Interfaces;
using NetTopologySuite;
using NetTopologySuite.IO;
using NetTopologySuite.Geometries;

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
        public async Task<bool> DeleteTrailAsync(int id)
        {
            return await _dataAccess.DeleteTrailAsync(id);
        }

        public async Task<TrailDTO> CreateTrailAsync(CreateTrailDTO dto)
        {
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
                Elevation = dto.ElevationGain,
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

                StartPoint = dto.StartPoint != null ? new Point(dto.StartPoint.Lng, dto.StartPoint.Lat) { SRID = 4326 } : null,
                EndPoint = dto.EndPoint != null ? new Point(dto.EndPoint.Lng, dto.EndPoint.Lat) { SRID = 4326 } : null,
                Waypoints = dto.Waypoints != null && dto.Waypoints.Any() ? new MultiPoint(dto.Waypoints.Select(w => new Point(w.Lng, w.Lat)).ToArray()) { SRID = 4326 } : null
            };

            if (dto.UserPhotos != null && dto.UserPhotos.Any())
            {
                foreach (var base64String in dto.UserPhotos)
                {
                    var parts = base64String.Split(',');
                    if (parts.Length == 2)
                    {
                        var contentType = parts[0].Split(';')[0].Replace("data:", "");
                        var base64Data = parts[1];

                        newTrailEntity.Photos.Add(new TrailPhotoEntity
                        {
                            ContentType = contentType,
                            ImageData = Convert.FromBase64String(base64Data)
                        });
                    }
                }
            }

            await _dataAccess.AddTrailAsync(newTrailEntity);

            return new TrailDTO(newTrailEntity);
        }
    }
}