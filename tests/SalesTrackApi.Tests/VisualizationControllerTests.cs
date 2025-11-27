using Microsoft.AspNetCore.Mvc;
using Moq;
using SalesTrackApi.Controllers;
using SalesTrackApi.Models;
using SalesTrackApi.Services;

namespace SalesTrackApi.Tests;

public class VisualizationControllerTests
{
    private readonly Mock<ISalesService> _mockService;
    private readonly VisualizationController _controller;

    public VisualizationControllerTests()
    {
        _mockService = new Mock<ISalesService>();
        _controller = new VisualizationController(_mockService.Object);
    }

    [Fact]
    public async Task GetChartData_ReturnsOkWithChartData()
    {
        // Arrange
        var chartData = new SalesChartData
        {
            SalesByCategory = new List<CategorySalesData>
            {
                new() { Category = "Electronics", TotalAmount = 500, SalesCount = 5 },
                new() { Category = "Clothing", TotalAmount = 300, SalesCount = 10 }
            },
            SalesByRegion = new List<RegionSalesData>
            {
                new() { Region = "North", TotalAmount = 400, SalesCount = 8 },
                new() { Region = "South", TotalAmount = 400, SalesCount = 7 }
            },
            SalesOverTime = new List<TimeSeriesData>
            {
                new() { Date = DateTime.UtcNow.Date, TotalAmount = 800, SalesCount = 15 }
            }
        };
        _mockService.Setup(s => s.GetChartDataAsync(null, null)).ReturnsAsync(chartData);

        // Act
        var result = await _controller.GetChartData();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedData = Assert.IsType<SalesChartData>(okResult.Value);
        Assert.Equal(2, returnedData.SalesByCategory.Count);
        Assert.Equal(2, returnedData.SalesByRegion.Count);
    }

    [Fact]
    public async Task GetSalesByCategory_ReturnsOkWithCategoryData()
    {
        // Arrange
        var chartData = new SalesChartData
        {
            SalesByCategory = new List<CategorySalesData>
            {
                new() { Category = "Electronics", TotalAmount = 500, SalesCount = 5 }
            },
            SalesByRegion = new List<RegionSalesData>(),
            SalesOverTime = new List<TimeSeriesData>()
        };
        _mockService.Setup(s => s.GetChartDataAsync(null, null)).ReturnsAsync(chartData);

        // Act
        var result = await _controller.GetSalesByCategory();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedData = Assert.IsAssignableFrom<IEnumerable<CategorySalesData>>(okResult.Value);
        Assert.Single(returnedData);
    }

    [Fact]
    public async Task GetTimeSeries_ReturnsOkWithTimeSeriesData()
    {
        // Arrange
        var chartData = new SalesChartData
        {
            SalesByCategory = new List<CategorySalesData>(),
            SalesByRegion = new List<RegionSalesData>(),
            SalesOverTime = new List<TimeSeriesData>
            {
                new() { Date = DateTime.UtcNow.Date.AddDays(-2), TotalAmount = 300, SalesCount = 5 },
                new() { Date = DateTime.UtcNow.Date.AddDays(-1), TotalAmount = 400, SalesCount = 7 },
                new() { Date = DateTime.UtcNow.Date, TotalAmount = 500, SalesCount = 10 }
            }
        };
        _mockService.Setup(s => s.GetChartDataAsync(null, null)).ReturnsAsync(chartData);

        // Act
        var result = await _controller.GetTimeSeries();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedData = Assert.IsAssignableFrom<IEnumerable<TimeSeriesData>>(okResult.Value);
        Assert.Equal(3, returnedData.Count());
    }
}
