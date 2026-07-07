namespace evoHike.Backend.Models
{
    public class HikeParticipant
    {
        public int PlannedHikeId { get; set; }

        public PlannedHikeEntity PlannedHike { get; set; } = null!;

        public int UserId { get; set; }

        public User User { get; set; } = null!;

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    }
}
