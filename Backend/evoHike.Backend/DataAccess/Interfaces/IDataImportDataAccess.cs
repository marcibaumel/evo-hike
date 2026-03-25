using evoHike.Backend.Models;
using evoHike.Backend.Utils;
using NetTopologySuite.IO;
using System.Text;

namespace evoHike.Backend.DataAccess.Interfaces
{
    public interface IDataImportDataAccess
    {
        Task<string> ImportTrailsAsync(string folderPath);
        Task<string> ImportPoisAsync(string filePath);
    }
}
