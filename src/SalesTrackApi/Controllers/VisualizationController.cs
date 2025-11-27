using Microsoft.AspNetCore.Mvc;
using SalesTrackApi.Models;
using SalesTrackApi.Services;

namespace SalesTrackApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VisualizationController : ControllerBase
{
    private readonly ISalesService _salesService;

    public VisualizationController(ISalesService salesService)
    {
        _salesService = salesService;
    }

    /// <summary>
    /// Get aggregated chart data for visualization tools
    /// </summary>
    [HttpGet("charts")]
    public async Task<ActionResult<SalesChartData>> GetChartData(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var chartData = await _salesService.GetChartDataAsync(startDate, endDate);
        return Ok(chartData);
    }

    /// <summary>
    /// Get sales data grouped by category for pie/bar charts
    /// </summary>
    [HttpGet("by-category")]
    public async Task<ActionResult<IEnumerable<CategorySalesData>>> GetSalesByCategory(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var chartData = await _salesService.GetChartDataAsync(startDate, endDate);
        return Ok(chartData.SalesByCategory);
    }

    /// <summary>
    /// Get sales data grouped by region for geographic visualizations
    /// </summary>
    [HttpGet("by-region")]
    public async Task<ActionResult<IEnumerable<RegionSalesData>>> GetSalesByRegion(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var chartData = await _salesService.GetChartDataAsync(startDate, endDate);
        return Ok(chartData.SalesByRegion);
    }

    /// <summary>
    /// Get time series data for line/area charts
    /// </summary>
    [HttpGet("time-series")]
    public async Task<ActionResult<IEnumerable<TimeSeriesData>>> GetTimeSeries(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var chartData = await _salesService.GetChartDataAsync(startDate, endDate);
        return Ok(chartData.SalesOverTime);
    }
}
