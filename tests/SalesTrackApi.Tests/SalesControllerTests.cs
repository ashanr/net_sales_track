using Microsoft.AspNetCore.Mvc;
using Moq;
using SalesTrackApi.Controllers;
using SalesTrackApi.Models;
using SalesTrackApi.Services;

namespace SalesTrackApi.Tests;

public class SalesControllerTests
{
    private readonly Mock<ISalesService> _mockService;
    private readonly SalesController _controller;

    public SalesControllerTests()
    {
        _mockService = new Mock<ISalesService>();
        _controller = new SalesController(_mockService.Object);
    }

    [Fact]
    public async Task GetAllSales_ReturnsOkWithSales()
    {
        // Arrange
        var sales = new List<Sale>
        {
            new Sale { Id = 1, ProductName = "Product1", Category = "Cat1", Amount = 100, Quantity = 1, SaleDate = DateTime.UtcNow, Region = "North", SalesRepresentative = "Rep1" },
            new Sale { Id = 2, ProductName = "Product2", Category = "Cat2", Amount = 200, Quantity = 2, SaleDate = DateTime.UtcNow, Region = "South", SalesRepresentative = "Rep2" }
        };
        _mockService.Setup(s => s.GetAllSalesAsync()).ReturnsAsync(sales);

        // Act
        var result = await _controller.GetAllSales();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedSales = Assert.IsAssignableFrom<IEnumerable<Sale>>(okResult.Value);
        Assert.Equal(2, returnedSales.Count());
    }

    [Fact]
    public async Task GetSaleById_ExistingSale_ReturnsOk()
    {
        // Arrange
        var sale = new Sale { Id = 1, ProductName = "Product1", Category = "Cat1", Amount = 100, Quantity = 1, SaleDate = DateTime.UtcNow, Region = "North", SalesRepresentative = "Rep1" };
        _mockService.Setup(s => s.GetSaleByIdAsync(1)).ReturnsAsync(sale);

        // Act
        var result = await _controller.GetSaleById(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedSale = Assert.IsType<Sale>(okResult.Value);
        Assert.Equal("Product1", returnedSale.ProductName);
    }

    [Fact]
    public async Task GetSaleById_NonExistingSale_ReturnsNotFound()
    {
        // Arrange
        _mockService.Setup(s => s.GetSaleByIdAsync(999)).ReturnsAsync((Sale?)null);

        // Act
        var result = await _controller.GetSaleById(999);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task CreateSale_ReturnsCreatedAtAction()
    {
        // Arrange
        var sale = new Sale { ProductName = "NewProduct", Category = "NewCat", Amount = 150, Quantity = 3, SaleDate = DateTime.UtcNow, Region = "East", SalesRepresentative = "Rep3" };
        var createdSale = new Sale { Id = 1, ProductName = "NewProduct", Category = "NewCat", Amount = 150, Quantity = 3, SaleDate = sale.SaleDate, Region = "East", SalesRepresentative = "Rep3" };
        _mockService.Setup(s => s.CreateSaleAsync(It.IsAny<Sale>())).ReturnsAsync(createdSale);

        // Act
        var result = await _controller.CreateSale(sale);

        // Assert
        var createdAtResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal(nameof(_controller.GetSaleById), createdAtResult.ActionName);
    }

    [Fact]
    public async Task DeleteSale_ExistingSale_ReturnsNoContent()
    {
        // Arrange
        _mockService.Setup(s => s.DeleteSaleAsync(1)).ReturnsAsync(true);

        // Act
        var result = await _controller.DeleteSale(1);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeleteSale_NonExistingSale_ReturnsNotFound()
    {
        // Arrange
        _mockService.Setup(s => s.DeleteSaleAsync(999)).ReturnsAsync(false);

        // Act
        var result = await _controller.DeleteSale(999);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
}
