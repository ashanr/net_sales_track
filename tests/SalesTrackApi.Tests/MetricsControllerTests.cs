using Microsoft.AspNetCore.Mvc;
using Moq;
using SalesTrackApi.Controllers;
using SalesTrackApi.Models;
using SalesTrackApi.Services;

namespace SalesTrackApi.Tests;

public class MetricsControllerTests
{
    private readonly Mock<ISalesService> _mockService;
    private readonly MetricsController _controller;

    public MetricsControllerTests()
    {
        _mockService = new Mock<ISalesService>();
        _controller = new MetricsController(_mockService.Object);
    }

    [Fact]
    public async Task GetMetrics_ReturnsOkWithMetrics()
    {
        // Arrange
        var metrics = new SalesMetrics
        {
            TotalRevenue = 1000,
            TotalSales = 10,
            TotalQuantity = 25,
            AverageOrderValue = 100,
            PeriodStart = DateTime.UtcNow.AddDays(-30),
            PeriodEnd = DateTime.UtcNow
        };
        _mockService.Setup(s => s.GetMetricsAsync(null, null)).ReturnsAsync(metrics);

        // Act
        var result = await _controller.GetMetrics();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedMetrics = Assert.IsType<SalesMetrics>(okResult.Value);
        Assert.Equal(1000, returnedMetrics.TotalRevenue);
        Assert.Equal(10, returnedMetrics.TotalSales);
    }

    [Fact]
    public async Task GetTodayMetrics_ReturnsOkWithMetrics()
    {
        // Arrange
        var today = DateTime.UtcNow.Date;
        var metrics = new SalesMetrics
        {
            TotalRevenue = 500,
            TotalSales = 5,
            TotalQuantity = 10,
            AverageOrderValue = 100,
            PeriodStart = today,
            PeriodEnd = today.AddDays(1)
        };
        _mockService.Setup(s => s.GetMetricsAsync(It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(metrics);

        // Act
        var result = await _controller.GetTodayMetrics();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedMetrics = Assert.IsType<SalesMetrics>(okResult.Value);
        Assert.Equal(500, returnedMetrics.TotalRevenue);
    }
}
