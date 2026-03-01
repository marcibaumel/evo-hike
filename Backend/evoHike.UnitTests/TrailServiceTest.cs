using evoHike.Backend.Data;
using evoHike.Backend.Models;
using evoHike.Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace evoHike.UnitTests;

    [TestFixture]
    public class TrailServiceTest
    {
        private EvoHikeContext _context;
        private TrailService _service;
        
        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<EvoHikeContext>()
                .UseInMemoryDatabase(
                    databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _context = new EvoHikeContext(options);
            _service = new TrailService(_context);
        }
        
        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task GetAllTrailsAsync_ReturnsAllTrails()
        {
            var fakeTrails = new List<HikingTrail>
            {
                new HikingTrail
                {
                    TrailID = 1,
                    TrailName = "Test Trail 1",
                    StartLocation = "Test Loc 1",
                    Length = 5.0,
                    Difficulty = 1,
                    Elevation = 100
                },
                new HikingTrail
                {
                    TrailID = 2,
                    TrailName = "Test Trail 2",
                    StartLocation = "Test Loc 2",
                    Length = 10.0,
                    Difficulty = 3,
                    Elevation = 500
                }
            };
            
            await _context.HikingTrails.AddRangeAsync(fakeTrails);
            await _context.SaveChangesAsync();
            
            var result = (await _service.GetAllTrailsAsync()).ToList();
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(2));
        }
        
        [Test]
        public async Task GetAllTrailsAsync_ReturnsEmptyList_WhenNoTrailsFound()
        {
            var result = (await _service.GetAllTrailsAsync()).ToList();
            
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(0));
        }
    }