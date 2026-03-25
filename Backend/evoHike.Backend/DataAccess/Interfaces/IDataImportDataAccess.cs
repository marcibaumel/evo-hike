namespace evoHike.Backend.DataAccess.Interfaces
{
    public interface IDataImportDataAccess
    {
        Task<string> ImportTrailsAsync(string folderPath);
        Task<string> ImportPoisAsync(string filePath);
    }
}
