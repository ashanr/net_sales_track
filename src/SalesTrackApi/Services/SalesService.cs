using Microsoft.EntityFrameworkCore;
using SalesTrackApi.Data;
using SalesTrackApi.Models;

namespace SalesTrackApi.Services;

public class SalesService : ISalesService
{
    private readonly SalesDbContext _context;

    public SalesService(SalesDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Sale>> GetAllSalesAsync()
    {
        return await _context.Sales.OrderByDescending(s => s.SaleDate).ToListAsync();
    }

    public async Task<Sale?> GetSaleByIdAsync(int id)
    {
        return await _context.Sales.FindAsync(id);
    }

    public async Task<IEnumerable<Sale>> GetSalesByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.Sales
            .Where(s => s.SaleDate >= startDate && s.SaleDate <= endDate)
            .OrderByDescending(s => s.SaleDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Sale>> GetSalesByCategoryAsync(string category)
    {
        return await _context.Sales
            .Where(s => s.Category.ToLower() == category.ToLower())
            .OrderByDescending(s => s.SaleDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Sale>> GetSalesByRegionAsync(string region)
    {
        return await _context.Sales
            .Where(s => s.Region.ToLower() == region.ToLower())
            .OrderByDescending(s => s.SaleDate)
            .ToListAsync();
    }

    public async Task<Sale> CreateSaleAsync(Sale sale)
    {
        _context.Sales.Add(sale);
        await _context.SaveChangesAsync();
        return sale;
    }

    public async Task<Sale?> UpdateSaleAsync(int id, Sale sale)
    {
        var existingSale = await _context.Sales.FindAsync(id);
        if (existingSale == null)
        {
            return null;
        }

        existingSale.ProductName = sale.ProductName;
        existingSale.Category = sale.Category;
        existingSale.Amount = sale.Amount;
        existingSale.Quantity = sale.Quantity;
        existingSale.SaleDate = sale.SaleDate;
        existingSale.Region = sale.Region;
        existingSale.SalesRepresentative = sale.SalesRepresentative;

        await _context.SaveChangesAsync();
        return existingSale;
    }

    public async Task<bool> DeleteSaleAsync(int id)
    {
        var sale = await _context.Sales.FindAsync(id);
        if (sale == null)
        {
            return false;
        }

        _context.Sales.Remove(sale);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<SalesMetrics> GetMetricsAsync(DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.Sales.AsQueryable();

        if (startDate.HasValue)
        {
            query = query.Where(s => s.SaleDate >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(s => s.SaleDate <= endDate.Value);
        }

        var sales = await query.ToListAsync();

        var totalRevenue = sales.Sum(s => s.Amount);
        var totalSales = sales.Count;
        var totalQuantity = sales.Sum(s => s.Quantity);
        var avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

        return new SalesMetrics
        {
            TotalRevenue = totalRevenue,
            TotalSales = totalSales,
            TotalQuantity = totalQuantity,
            AverageOrderValue = avgOrderValue,
            PeriodStart = startDate ?? (sales.Any() ? sales.Min(s => s.SaleDate) : DateTime.UtcNow),
            PeriodEnd = endDate ?? (sales.Any() ? sales.Max(s => s.SaleDate) : DateTime.UtcNow)
        };
    }

    public async Task<SalesChartData> GetChartDataAsync(DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.Sales.AsQueryable();

        if (startDate.HasValue)
        {
            query = query.Where(s => s.SaleDate >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(s => s.SaleDate <= endDate.Value);
        }

        var sales = await query.ToListAsync();

        var salesByCategory = sales
            .GroupBy(s => s.Category)
            .Select(g => new CategorySalesData
            {
                Category = g.Key,
                TotalAmount = g.Sum(s => s.Amount),
                SalesCount = g.Count()
            })
            .OrderByDescending(c => c.TotalAmount)
            .ToList();

        var salesByRegion = sales
            .GroupBy(s => s.Region)
            .Select(g => new RegionSalesData
            {
                Region = g.Key,
                TotalAmount = g.Sum(s => s.Amount),
                SalesCount = g.Count()
            })
            .OrderByDescending(r => r.TotalAmount)
            .ToList();

        var salesOverTime = sales
            .GroupBy(s => s.SaleDate.Date)
            .Select(g => new TimeSeriesData
            {
                Date = g.Key,
                TotalAmount = g.Sum(s => s.Amount),
                SalesCount = g.Count()
            })
            .OrderBy(t => t.Date)
            .ToList();

        return new SalesChartData
        {
            SalesByCategory = salesByCategory,
            SalesByRegion = salesByRegion,
            SalesOverTime = salesOverTime
        };
    }
}
