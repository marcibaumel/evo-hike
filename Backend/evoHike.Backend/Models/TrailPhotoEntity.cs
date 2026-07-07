using System.ComponentModel.DataAnnotations;

namespace evoHike.Backend.Models
{
    public class TrailPhotoEntity
    {
        [Key]
        public int Id { get; set; }
        
        public int HikingTrailId { get; set; }
        
        public byte[] ImageData { get; set; } = Array.Empty<byte>();
        public string ContentType { get; set; } = string.Empty; 
    }
}