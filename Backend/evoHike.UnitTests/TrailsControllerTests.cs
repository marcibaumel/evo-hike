using evoHike.Backend.Controllers;
using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models.DTO;
using evoHike.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace evoHike.UnitTests;

[TestFixture]
public class TrailsControllerTests
{
    private Mock<ITrailService> _mockService;
    private TrailsController _controller;

    [SetUp]
    public void Setup()
    {
        _mockService = new Mock<ITrailService>();
        _controller = new TrailsController(_mockService.Object);
    }

    [Test]
    public async Task GetTrails_ReturnsOkResult_WithListOfTrails()
    {
        var fakeTrails = new List<TrailDTO>
        {
            new TrailDTO { Id = 1, Name = "Test Trail" }
        };

        _mockService.Setup(s => s.GetAllTrailsAsync())
                    .ReturnsAsync(fakeTrails);

        var actionResult = await _controller.GetTrails();

        Assert.That(actionResult.Result, Is.InstanceOf<OkObjectResult>());

        var okResult = (actionResult.Result as OkObjectResult)!;

        Assert.That(okResult.Value, Is.EqualTo(fakeTrails));
    }

    [Test]
    public async Task GetTrails_ReturnBadRequest_WhenServiceThrowsException()
    {
        _mockService.Setup(s => s.GetAllTrailsAsync())
                    .ThrowsAsync(new Exception("Hiba történt"));

        var result = await _controller.GetTrails();
        Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());
    }
}