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
                return StatusCode(500, "Hiba történt az adatok lekérésekor. " + ex.Message);
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
                return StatusCode(500, "Hiba történt az adatok lekérésekor. " + ex.Message);
            }
        }
    }
}