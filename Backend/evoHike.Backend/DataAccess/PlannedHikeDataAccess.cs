using evoHike.Backend.Data;
using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace evoHike.Backend.DataAccess
{
    public class PlannedHikeDataAccess: IPlannedHikeDataAccess
    {
        private readonly EvoHikeContext _context;
        public PlannedHikeDataAccess(EvoHikeContext context)
        {
            _context = context;
        }

        public IQueryable<PlannedHikeEntity> GetBaseQuery()
        {
            return _context.PlannedHikes;
        }

        public async Task<bool> TrailExistsAsync(int trailId)
        => await _context.HikingTrails.AnyAsync(r => r.Id == trailId);

        public async Task<PlannedHikeEntity> AddHikeAsync(PlannedHikeEntity hike)
        {
            _context.PlannedHikes.Add(hike);
            await SaveChangesAsync();
            return hike;
        }

        public async Task<PlannedHikeEntity?> FindHikeAsync(int trailId)
        {
            return await _context.PlannedHikes.FindAsync(trailId);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
        public async Task AddParticipantAsync(int hikeId, int userId)
        {
            var participant = new HikeParticipant
            {
                PlannedHikeId = hikeId,
                UserId = userId,
                JoinedAt = DateTime.UtcNow
            };
            _context.HikeParticipants.Add(participant);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> HasUserJoinedAsync(int hikeId, int userId)
        {
            return await _context.HikeParticipants
                .AnyAsync(hp => hp.PlannedHikeId == hikeId && hp.UserId == userId);
        }
    }
}
