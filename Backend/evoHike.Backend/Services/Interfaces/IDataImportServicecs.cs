namespace evoHike.Backend.Services.Interfaces
{
    public interface IDataImportServicecs
    {
        Task<string> ImportTrailsAsync(string folderPath);
        Task<string> ImportPoisAsync(string filePath);
       
    }
}
