namespace SalesTrackApi.Models;

public class Sale
{
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int Quantity { get; set; }
    public DateTime SaleDate { get; set; }
    public string Region { get; set; } = string.Empty;
    public string SalesRepresentative { get; set; } = string.Empty;
}
