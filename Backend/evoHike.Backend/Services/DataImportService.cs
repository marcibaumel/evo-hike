using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models;
using evoHike.Backend.Utils;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using System.Text;
namespace evoHike.Backend.Services;

public class DataImportService
{
    private readonly IDataImportDataAccess _dataImport;
    public DataImportService(IDataImportDataAccess dataImport)
    {
        _dataImport = dataImport; 
    }
    public async Task<string> ImportTrailsAsync(string folderPath)
    {
        var report = new StringBuilder();
        var trailsToSave = new List<HikingTrailEntity>();
        int skippedCount = 0;

        if (!Directory.Exists(folderPath)) return $"Directory not found: {folderPath}";

        var reader = new GeoJsonReader();
        var files = Directory.GetFiles(folderPath, "*.geojson");

        foreach (var file in files)
        {
            try
            {
                var json = await File.ReadAllTextAsync(file);
                var featureCollection = reader.Read<FeatureCollection>(json);
                if (featureCollection == null) continue;

                foreach (var feature in featureCollection)
                {
                    var trail = MapFeatureToEntity(feature, file);
                    if (trail == null)
                    {
                        skippedCount++;
                        continue;
                    }
                    trailsToSave.Add(trail);
                }
            }
            catch (Exception ex)
            {
                report.AppendLine($"Error processing {Path.GetFileName(file)}: {ex.Message}");
            }
        }

        await _dataImport.ImportTrailsAsync(trailsToSave);

        report.AppendLine($"Import Complete. Imported: {trailsToSave.Count}, Skipped: {skippedCount}");
        return report.ToString();
    }

    private HikingTrailEntity? MapFeatureToEntity(IFeature feature, string file)
    {
        var validGeometry = ImportHelper.ExtractValidLineGeometry(feature.Geometry);
        if (validGeometry == null) return null;

        var attr = feature.Attributes;
        var fileName = Path.GetFileNameWithoutExtension(file);
        var rawName = ImportHelper.GetAttributeValue(attr, "name") ?? fileName;
        var nameInfo = ImportHelper.ParseTrailDetails(rawName, fileName);

        var lengthKm = ImportHelper.ParseDouble(ImportHelper.GetAttributeValue(attr, "distance", "length"));
        if (lengthKm <= 0) lengthKm = GeoUtils.CalculateLengthKm(validGeometry);

        var elevation = ImportHelper.ParseDouble(ImportHelper.GetAttributeValue(attr, "ascent", "ele"));

        return new HikingTrailEntity
        {
            TrailName = nameInfo.Name,
            StartLocation = ImportHelper.GetAttributeValue(attr, "from") ?? nameInfo.Start,
            EndLocation = ImportHelper.GetAttributeValue(attr, "to") ?? nameInfo.End,
            TrailSymbol = ImportHelper.GetAttributeValue(attr, "osmc:symbol", "jel", "symbol"),
            Description = ImportHelper.GetAttributeValue(attr, "description"),
            Length = lengthKm,
            Elevation = elevation,
            EstimatedDuration = ImportHelper.CalculateDurationMinutes(lengthKm, elevation),
            RouteLine = validGeometry,
            CreatedAt = DateTime.UtcNow
        };
    }

    public async Task<(int ImportedCount, string ErrorMessage)> ImportPoisFromFileAsync(string filePath)
    {
        if (!File.Exists(filePath))
            return (0, $"POI file not found: {filePath}");

        try
        {
            var json = await File.ReadAllTextAsync(filePath);
            var collection = new GeoJsonReader().Read<FeatureCollection>(json);
            var poisToImport = new List<PointOfInterestEntity>();

            foreach (var feature in collection ?? [])
            {
                if (feature.Geometry is not Point point) continue;

                var poi = new PointOfInterestEntity
                {
                    PointOfInterestName = ImportHelper.GetAttributeValue(feature.Attributes, "name") ?? "Unnamed POI",
                    PointOfInterestType = ImportHelper.GetAttributeValue(feature.Attributes, "tourism", "amenity", "natural") ?? "General",
                    Location = point
                };
                poi.Location.SRID = 4326;
                poisToImport.Add(poi);
            }

            if (poisToImport.Any())
            {
                await _dataImport.AddPoisAsync(poisToImport);
                await _dataImport.SaveChangesAsync();
            }

            return (poisToImport.Count, null);
        }
        catch (Exception ex)
        {
            return (0, ex.Message);
        }
    }
}
