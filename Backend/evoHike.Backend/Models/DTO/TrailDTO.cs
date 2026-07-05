using NetTopologySuite.Geometries;

namespace evoHike.Backend.Models.DTO
{
    public class TrailDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Location { get; set; } 
        public double Length { get; set; } 
        public int Difficulty { get; set; } 
        public double ElevationGain { get; set; } 
        public double Rating { get; set; } 
        public int ReviewCount { get; set; } 
        public int? EstimatedDuration { get; set; } 
        public string CoverPhotoPath { get; set; } = string.Empty;
        public Geometry? RouteLine { get; set; }
		public List<string> UserPhotos { get; set; } = new List<string>();

		public CoordinateDTO? StartPoint { get; set; }
		public CoordinateDTO? EndPoint { get; set; }
		public List<CoordinateDTO>? Waypoints { get; set; }

        public TrailDTO() { }

        public TrailDTO(HikingTrailEntity trail)
        {
            Id = trail.Id;
            Name = trail.TrailName;
            Description = trail.Description;
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
			StartPoint = trail.StartPoint != null ? new CoordinateDTO { Lat = trail.StartPoint.Y, Lng = trail.StartPoint.X } : null;
            EndPoint = trail.EndPoint != null ? new CoordinateDTO { Lat = trail.EndPoint.Y, Lng = trail.EndPoint.X } : null;
            Waypoints = trail.Waypoints != null ? trail.Waypoints.Geometries.Select(g => new CoordinateDTO { Lat = ((Point)g).Y, Lng = ((Point)g).X }).ToList() : new List<CoordinateDTO>();

			if (trail.Photos != null && trail.Photos.Any())
            {
                UserPhotos = trail.Photos.Select(p => 
                    $"data:{p.ContentType};base64,{Convert.ToBase64String(p.ImageData)}"
                ).ToList();
            }
        }
    }
}