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
		public async Task<ActionResult<TrailDTO>> CreateTrail([FromBody] CreateTrailDTO dto)
		{
    		System.Console.WriteLine("---------------------------------------");
    		System.Console.WriteLine($"[Szerver] Megérkezett! Túra neve: {dto.Name}");
   			System.Console.WriteLine("---------------------------------------");

    		try
    		{
        		var savedTrail = await _trailService.CreateTrailAsync(dto);
        		return Ok(savedTrail);
    		}
    		catch (Exception ex)
    		{
        		System.Console.WriteLine($"HIBA: {ex.Message}");
        		return BadRequest(ex.Message);
    		}
		}
    }
}