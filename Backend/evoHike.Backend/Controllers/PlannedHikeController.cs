using evoHike.Backend.Models;
using evoHike.Backend.Models.DTOs;
using evoHike.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace evoHike.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlannedHikesController: ControllerBase
    {

        private readonly IPlannedHikeService _plannedHikeService;

        public PlannedHikesController(IPlannedHikeService plannedHikeService)
        {
            _plannedHikeService = plannedHikeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlannedHikeEntity>>> GetPlannedHikes([FromQuery] HikeStatus? status)
        {
            try
            {
                var hikes = await _plannedHikeService.GetHikesAsync(status);
                return Ok(hikes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("checklist-options")]
        public ActionResult<List<string>> GetChecklistOptions()
        {
            return Ok(ChecklistData.StandardItems);
        }

        [HttpPost]
        public async Task<ActionResult<PlannedHikeEntity>> PlanHike([FromBody] PlannedHikeDTO request)
        {
            try
            {
                var result = await _plannedHikeService.CreatePlannedHikeAsync(request);
                return CreatedAtAction(nameof(GetPlannedHikes), new { id = result.Id }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message); 
            }
        }

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> MarkAsCompleted(int id)
        {
            try
            {
                var isSuccess = await _plannedHikeService.MarkHikeAsCompletedAsync(id);

                if (!isSuccess)
                {
                    return NotFound();
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