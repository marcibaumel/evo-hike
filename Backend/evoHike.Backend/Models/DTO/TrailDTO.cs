using NetTopologySuite.Geometries;

namespace evoHike.Backend.Models.DTO
{
    public class TrailDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Location { get; set; } 
        public double Length { get; set; } 
        public int Difficulty { get; set; } 
        public double ElevationGain { get; set; } 
        public double Rating { get; set; } 
        public int ReviewCount { get; set; } 
        public int? EstimatedDuration { get; set; } 
        public string CoverPhotoPath { get; set; } = string.Empty;
        public Geometry? RouteLine { get; set; }

        public TrailDTO() { }

        public TrailDTO(HikingTrailEntity trail)
        {
            Id = trail.Id;
            Name = trail.TrailName;
            Location = !string.IsNullOrEmpty(trail.StartLocation) 
                ? $"{trail.StartLocation} - {trail.EndLocation}" 
                : trail.StartLocation;
            Length = trail.Length;
            Difficulty = trail.Difficulty;
            ElevationGain = trail.Elevation;
            Rating = trail.Rating;
            ReviewCount = trail.ReviewCount;
            EstimatedDuration = trail.EstimatedDuration;
            CoverPhotoPath = trail.CoverPhotoPath ?? "";
            RouteLine = trail.RouteLine;
        }
    }
}