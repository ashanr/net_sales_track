using Microsoft.AspNetCore.Mvc;
using SalesTrackApi.Models;
using SalesTrackApi.Services;

namespace SalesTrackApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly ISalesService _salesService;

    public SalesController(ISalesService salesService)
    {
        _salesService = salesService;
    }

    /// <summary>
    /// Get all sales
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Sale>>> GetAllSales()
    {
        var sales = await _salesService.GetAllSalesAsync();
        return Ok(sales);
    }

    /// <summary>
    /// Get a sale by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Sale>> GetSaleById(int id)
    {
        var sale = await _salesService.GetSaleByIdAsync(id);
        if (sale == null)
        {
            return NotFound();
        }
        return Ok(sale);
    }

    /// <summary>
    /// Get sales by date range
    /// </summary>
    [HttpGet("daterange")]
    public async Task<ActionResult<IEnumerable<Sale>>> GetSalesByDateRange(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        var sales = await _salesService.GetSalesByDateRangeAsync(startDate, endDate);
        return Ok(sales);
    }

    /// <summary>
    /// Get sales by category
    /// </summary>
    [HttpGet("category/{category}")]
    public async Task<ActionResult<IEnumerable<Sale>>> GetSalesByCategory(string category)
    {
        var sales = await _salesService.GetSalesByCategoryAsync(category);
        return Ok(sales);
    }

    /// <summary>
    /// Get sales by region
    /// </summary>
    [HttpGet("region/{region}")]
    public async Task<ActionResult<IEnumerable<Sale>>> GetSalesByRegion(string region)
    {
        var sales = await _salesService.GetSalesByRegionAsync(region);
        return Ok(sales);
    }

    /// <summary>
    /// Create a new sale
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Sale>> CreateSale([FromBody] Sale sale)
    {
        var createdSale = await _salesService.CreateSaleAsync(sale);
        return CreatedAtAction(nameof(GetSaleById), new { id = createdSale.Id }, createdSale);
    }

    /// <summary>
    /// Update an existing sale
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<Sale>> UpdateSale(int id, [FromBody] Sale sale)
    {
        var updatedSale = await _salesService.UpdateSaleAsync(id, sale);
        if (updatedSale == null)
        {
            return NotFound();
        }
        return Ok(updatedSale);
    }

    /// <summary>
    /// Delete a sale
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteSale(int id)
    {
        var deleted = await _salesService.DeleteSaleAsync(id);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }
}
