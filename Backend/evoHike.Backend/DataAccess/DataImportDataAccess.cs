using evoHike.Backend.Data;
using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models;
using evoHike.Backend.Utils;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using System.Text;

namespace evoHike.Backend.DataAccess
{
    public class DataImportDataAccess:IDataImportDataAccess
    {
        private readonly EvoHikeContext _dataImport;
        public DataImportDataAccess(EvoHikeContext dataImport) {
            _dataImport = dataImport;
        }

        public async Task ImportTrailsAsync(IEnumerable<HikingTrailEntity> trails)
        {
            await _dataImport.HikingTrails.AddRangeAsync(trails);
            await _dataImport.SaveChangesAsync();
        }

        public async Task AddPoisAsync(IEnumerable<PointOfInterestEntity> pois)
        {
            await _dataImport.PointsOfInterest.AddRangeAsync(pois);
        }

        public async Task SaveChangesAsync()
        {
            await _dataImport.SaveChangesAsync();
        }
    }
}
