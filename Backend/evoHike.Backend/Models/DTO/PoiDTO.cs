using NetTopologySuite.Geometries;

namespace evoHike.Backend.Models.DTO
{
    public class PoiDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public Geometry? Location { get; set; }

        public PoiDTO() { }

        public PoiDTO(PointOfInterest poi)
        {
            Id = poi.PointOfInterestId;
            Name = poi.PointOfInterestName;
            Type = poi.PointOfInterestType;
            Location = poi.Location;
        }
    }
}