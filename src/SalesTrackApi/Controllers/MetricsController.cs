using Microsoft.AspNetCore.Mvc;
using SalesTrackApi.Models;
using SalesTrackApi.Services;

namespace SalesTrackApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MetricsController : ControllerBase
{
    private readonly ISalesService _salesService;

    public MetricsController(ISalesService salesService)
    {
        _salesService = salesService;
    }

    /// <summary>
    /// Get sales metrics for monitoring dashboards
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<SalesMetrics>> GetMetrics(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var metrics = await _salesService.GetMetricsAsync(startDate, endDate);
        return Ok(metrics);
    }

    /// <summary>
    /// Get current day metrics
    /// </summary>
    [HttpGet("today")]
    public async Task<ActionResult<SalesMetrics>> GetTodayMetrics()
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);
        var metrics = await _salesService.GetMetricsAsync(today, tomorrow);
        return Ok(metrics);
    }

    /// <summary>
    /// Get current week metrics
    /// </summary>
    [HttpGet("week")]
    public async Task<ActionResult<SalesMetrics>> GetWeekMetrics()
    {
        var today = DateTime.UtcNow.Date;
        var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
        var metrics = await _salesService.GetMetricsAsync(startOfWeek, today.AddDays(1));
        return Ok(metrics);
    }

    /// <summary>
    /// Get current month metrics
    /// </summary>
    [HttpGet("month")]
    public async Task<ActionResult<SalesMetrics>> GetMonthMetrics()
    {
        var today = DateTime.UtcNow.Date;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);
        var metrics = await _salesService.GetMetricsAsync(startOfMonth, today.AddDays(1));
        return Ok(metrics);
    }
}
