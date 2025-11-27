using Microsoft.EntityFrameworkCore;
using SalesTrackApi.Data;
using SalesTrackApi.Models;
using SalesTrackApi.Services;

namespace SalesTrackApi.Tests;

public class SalesServiceTests
{
    private SalesDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SalesDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new SalesDbContext(options);
    }

    [Fact]
    public async Task GetAllSalesAsync_ReturnsAllSales()
    {
        // Arrange
        using var context = CreateContext();
        var service = new SalesService(context);
        
        context.Sales.AddRange(
            new Sale { Id = 1, ProductName = "Product1", Category = "Cat1", Amount = 100, Quantity = 1, SaleDate = DateTime.UtcNow, Region = "North", SalesRepresentative = "Rep1" },
            new Sale { Id = 2, ProductName = "Product2", Category = "Cat2", Amount = 200, Quantity = 2, SaleDate = DateTime.UtcNow, Region = "South", SalesRepresentative = "Rep2" }
        );
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllSalesAsync();

        // Assert
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetSaleByIdAsync_ExistingSale_ReturnsSale()
    {
        // Arrange
        using var context = CreateContext();
        var service = new SalesService(context);
        
        var sale = new Sale { Id = 1, ProductName = "Product1", Category = "Cat1", Amount = 100, Quantity = 1, SaleDate = DateTime.UtcNow, Region = "North", SalesRepresentative = "Rep1" };
        context.Sales.Add(sale);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetSaleByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Product1", result.ProductName);
    }

    [Fact]
    public async Task GetSaleByIdAsync_NonExistingSale_ReturnsNull()
    {
        // Arrange
        using var context = CreateContext();
        var service = new SalesService(context);

        // Act
        var result = await service.GetSaleByIdAsync(999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task CreateSaleAsync_AddsSaleToDatabase()
    {
        // Arrange
        using var context = CreateContext();
        var service = new SalesService(context);
        
        var sale = new Sale { ProductName = "NewProduct", Category = "NewCat", Amount = 150, Quantity = 3, SaleDate = DateTime.UtcNow, Region = "East", SalesRepresentative = "Rep3" };

        // Act
        var result = await service.CreateSaleAsync(sale);

        // Assert
        Assert.True(result.Id > 0);
        Assert.Equal(1, context.Sales.Count());
    }

    [Fact]
    public async Task DeleteSaleAsync_ExistingSale_ReturnsTrue()
    {
        // Arrange
        using var context = CreateContext();
        var service = new SalesService(context);
        
        var sale = new Sale { Id = 1, ProductName = "Product1", Category = "Cat1", Amount = 100, Quantity = 1, SaleDate = DateTime.UtcNow, Region = "North", SalesRepresentative = "Rep1" };
        context.Sales.Add(sale);
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteSaleAsync(1);

        // Assert
        Assert.True(result);
        Assert.Equal(0, context.Sales.Count());
    }

    [Fact]
    public async Task DeleteSaleAsync_NonExistingSale_ReturnsFalse()
    {
        // Arrange
        using var context = CreateContext();
        var service = new SalesService(context);

        // Act
        var result = await service.DeleteSaleAsync(999);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task GetSalesByDateRangeAsync_ReturnsFilteredSales()
    {
        // Arrange
        using var context = CreateContext();
        var service = new SalesService(context);
        
        var today = DateTime.UtcNow.Date;
        context.Sales.AddRange(
            new Sale { Id = 1, ProductName = "Product1", Category = "Cat1", Amount = 100, Quantity = 1, SaleDate = today, Region = "North", SalesRepresentative = "Rep1" },
            new Sale { Id = 2, ProductName = "Product2", Category = "Cat2", Amount = 200, Quantity = 2, SaleDate = today.AddDays(-10), Region = "South", SalesRepresentative = "Rep2" }
        );
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetSalesByDateRangeAsync(today.AddDays(-5), today.AddDays(1));

        // Assert
        Assert.Single(result);
        Assert.Equal("Product1", result.First().ProductName);
    }

    [Fact]
    public async Task GetSalesByCategoryAsync_ReturnsFilteredSales()
    {
        // Arrange
        using var context = CreateContext();
        var service = new SalesService(context);
        
        context.Sales.AddRange(
            new Sale { Id = 1, ProductName = "Product1", Category = "Electronics", Amount = 100, Quantity = 1, SaleDate = DateTime.UtcNow, Region = "North", SalesRepresentative = "Rep1" },
            new Sale { Id = 2, ProductName = "Product2", Category = "Clothing", Amount = 200, Quantity = 2, SaleDate = DateTime.UtcNow, Region = "South", SalesRepresentative = "Rep2" }
        );
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetSalesByCategoryAsync("Electronics");

        // Assert
        Assert.Single(result);
        Assert.Equal("Product1", result.First().ProductName);
    }

    [Fact]
    public async Task GetMetricsAsync_ReturnsCorrectMetrics()
    {
        // Arrange
        using var context = CreateContext();
        var service = new SalesService(context);
        
        context.Sales.AddRange(
            new Sale { Id = 1, ProductName = "Product1", Category = "Cat1", Amount = 100, Quantity = 2, SaleDate = DateTime.UtcNow, Region = "North", SalesRepresentative = "Rep1" },
            new Sale { Id = 2, ProductName = "Product2", Category = "Cat2", Amount = 200, Quantity = 3, SaleDate = DateTime.UtcNow, Region = "South", SalesRepresentative = "Rep2" }
        );
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetMetricsAsync();

        // Assert
        Assert.Equal(300, result.TotalRevenue);
        Assert.Equal(2, result.TotalSales);
        Assert.Equal(5, result.TotalQuantity);
        Assert.Equal(150, result.AverageOrderValue);
    }

    [Fact]
    public async Task GetChartDataAsync_ReturnsGroupedData()
    {
        // Arrange
        using var context = CreateContext();
        var service = new SalesService(context);
        
        var today = DateTime.UtcNow.Date;
        context.Sales.AddRange(
            new Sale { Id = 1, ProductName = "Product1", Category = "Electronics", Amount = 100, Quantity = 1, SaleDate = today, Region = "North", SalesRepresentative = "Rep1" },
            new Sale { Id = 2, ProductName = "Product2", Category = "Electronics", Amount = 200, Quantity = 2, SaleDate = today, Region = "South", SalesRepresentative = "Rep2" },
            new Sale { Id = 3, ProductName = "Product3", Category = "Clothing", Amount = 50, Quantity = 1, SaleDate = today, Region = "North", SalesRepresentative = "Rep1" }
        );
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetChartDataAsync();

        // Assert
        Assert.Equal(2, result.SalesByCategory.Count);
        Assert.Equal(2, result.SalesByRegion.Count);
        Assert.Single(result.SalesOverTime);
        
        var electronicsCategory = result.SalesByCategory.First(c => c.Category == "Electronics");
        Assert.Equal(300, electronicsCategory.TotalAmount);
        Assert.Equal(2, electronicsCategory.SalesCount);
    }
}
