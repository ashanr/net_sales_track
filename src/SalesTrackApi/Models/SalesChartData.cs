namespace SalesTrackApi.Models;

public class SalesChartData
{
    public List<CategorySalesData> SalesByCategory { get; set; } = [];
    public List<RegionSalesData> SalesByRegion { get; set; } = [];
    public List<TimeSeriesData> SalesOverTime { get; set; } = [];
}

public class CategorySalesData
{
    public string Category { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public int SalesCount { get; set; }
}

public class RegionSalesData
{
    public string Region { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public int SalesCount { get; set; }
}

public class TimeSeriesData
{
    public DateTime Date { get; set; }
    public decimal TotalAmount { get; set; }
    public int SalesCount { get; set; }
}
