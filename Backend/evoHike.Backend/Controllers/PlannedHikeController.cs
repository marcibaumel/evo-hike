using evoHike.Backend.Models;
using evoHike.Backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using evoHike.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace evoHike.Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PlannedHikesController: ControllerBase
    {

        private readonly IPlannedHikeService _plannedHikeService;

        public PlannedHikesController(IPlannedHikeService plannedHikeService)
        {
            _plannedHikeService = plannedHikeService;
        }
        private int GetCurrentUserId()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdString, out int userId))
            {
                return userId;
            }
            throw new UnauthorizedAccessException("Couldn't retrieve user ID from token.");
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
                var currentuserId = GetCurrentUserId();

                var result = await _plannedHikeService.CreatePlannedHikeAsync(request,currentuserId);
                return CreatedAtAction(nameof(GetPlannedHikes), new { id = result.Id }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message); 
            }
        }

        [HttpPost("{id}/join")]
        public async Task<IActionResult> JoinHike(int id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();

                await _plannedHikeService.JoinHikeAsync(id, currentUserId);

                return Ok(new { message = "Successfully joined the hike" });
            }
            catch (Exception ex)
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