using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models.DTO;
using evoHike.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace evoHike.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrailsController : ControllerBase
    {
        private readonly ITrailService _trailService;

        public TrailsController(ITrailService trailService)
        {
            _trailService = trailService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrailDTO>>> GetTrails()
        {
            try
            {
                var trails = await _trailService.GetAllTrailsAsync();
                return Ok(trails);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}/pois")]
        public async Task<ActionResult<IEnumerable<PoiDTO>>> GetPois(int id, [FromQuery] double distance = 1000)
        {
            try
            {
                var pois = await _trailService.GetPoisNearTrailAsync(id, distance);
                return Ok(pois);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<TrailDTO>> CreateTrail([FromBody] TrailDTO newTrail)
        {
            try
            {
                var createdTrail = await _trailService.CreateTrailAsync(newTrail);
                return Ok(createdTrail);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrail(int id)
        {
            try
            {
                var success = await _trailService.DeleteTrailAsync(id);
                if (!success)
                {
                    return NotFound("Tour not found in the database");
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}