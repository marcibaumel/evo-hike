using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace evoHike.Backend.Models;

public class PointOfInterestEntity
{
    [Key]
    public int Id { get; set; }
    public required string PointOfInterestName { get; set; }
    public required string PointOfInterestType { get; set; }
    public required Point Location { get; set; }
}
