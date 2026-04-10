using evoHike.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Controllers
{
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
    }
}