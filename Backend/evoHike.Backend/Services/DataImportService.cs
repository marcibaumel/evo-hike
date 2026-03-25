using System.Text;
using evoHike.Backend.Data;
using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models;
using evoHike.Backend.Utils;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;

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
        var report= await _dataImport.ImportTrailsAsync(folderPath); 
        return report.ToString();
    }

    public async Task<string> ImportPoisAsync(string filePath)
    {
        var task = await _dataImport.ImportPoisAsync(filePath);
        return task;
    }
}