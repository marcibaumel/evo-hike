namespace evoHike.Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public ICollection<PlannedHikeEntity> OrganizedHikes { get; set; } = new List<PlannedHikeEntity>();
        public ICollection<HikeParticipant> ParticipatedHikes { get; set; } = new List<HikeParticipant>();
    }
}
