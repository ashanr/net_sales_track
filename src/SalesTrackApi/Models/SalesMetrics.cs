namespace SalesTrackApi.Models;

public class SalesMetrics
{
    public decimal TotalRevenue { get; set; }
    public int TotalSales { get; set; }
    public int TotalQuantity { get; set; }
    public decimal AverageOrderValue { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
}
