using SalesTrackApi.Models;

namespace SalesTrackApi.Services;

public interface ISalesService
{
    Task<IEnumerable<Sale>> GetAllSalesAsync();
    Task<Sale?> GetSaleByIdAsync(int id);
    Task<IEnumerable<Sale>> GetSalesByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<Sale>> GetSalesByCategoryAsync(string category);
    Task<IEnumerable<Sale>> GetSalesByRegionAsync(string region);
    Task<Sale> CreateSaleAsync(Sale sale);
    Task<Sale?> UpdateSaleAsync(int id, Sale sale);
    Task<bool> DeleteSaleAsync(int id);
    Task<SalesMetrics> GetMetricsAsync(DateTime? startDate = null, DateTime? endDate = null);
    Task<SalesChartData> GetChartDataAsync(DateTime? startDate = null, DateTime? endDate = null);
}
