namespace evoHike.Backend.Models.DTO
{
    public class CreateTrailDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Length { get; set; }
        public int Difficulty { get; set; }
        public int Time { get; set; }
        public string RouteLine { get; set; } = string.Empty;
    }
}