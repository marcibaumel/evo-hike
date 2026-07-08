using evoHike.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DataController(
        DataImportService _importService
    ) : ControllerBase
    {
        [HttpPost("import")]
        public async Task<IActionResult> ImportPois([FromQuery] string filePath)
        {
            var (count, error) = await _importService.ImportPoisFromFileAsync(filePath);

            if (error != null)
            {
                return BadRequest(new { Message = "Error importing POIs", Details = error });
            }

            return Ok(new { Message = $"Successfully imported {count} POIs" });
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearData(
            [FromServices] evoHike.Backend.Data.EvoHikeContext db)
        {
            await db.Database.EnsureDeletedAsync();
            await db.Database.MigrateAsync();
            return Ok("Database cleared.");
        }

        [HttpPost("import-trails")]
        public async Task<IActionResult> ImportTrails([FromQuery] string folderPath = "splittrails")
        {
            var fullPath = Path.IsPathRooted(folderPath)
                ? folderPath
                : Path.Combine(Directory.GetCurrentDirectory(), folderPath);

            if (!Directory.Exists(fullPath))
            {
                return BadRequest(new { Message = $"Folder not found: {fullPath}" });
            }

            var result = await _importService.ImportTrailsAsync(fullPath);

            return Ok(new { Message = result });
        }
    }
}