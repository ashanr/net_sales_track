# Database Migration & API Usage Guide

## 🗄️ How Database Migration Works

### Overview
This project uses **Entity Framework Core** with **PostgreSQL** for database management. The database schema is defined in code and migrations are used to create/update the database structure.

---

## 📋 Migration Architecture

### 1. **Database Context (`SalesDbContext.cs`)**
The database context defines the structure of your database:

```csharp
public class SalesDbContext : DbContext
{
    public DbSet<Sale> Sales => Set<Sale>();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Defines table schema, constraints, and relationships
        modelBuilder.Entity<Sale>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ProductName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            // ... more configurations
        });
    }
}
```

### 2. **Entity Model (`Sale.cs`)**
The Sale class represents a row in the Sales table:

```csharp
public class Sale
{
    public int Id { get; set; }                    // Primary Key
    public string ProductName { get; set; }        // VARCHAR(200)
    public string Category { get; set; }           // VARCHAR(100)
    public decimal Amount { get; set; }            // NUMERIC(18,2)
    public int Quantity { get; set; }              // INTEGER
    public DateTime SaleDate { get; set; }         // TIMESTAMP WITH TIME ZONE
    public string Region { get; set; }             // VARCHAR(100)
    public string SalesRepresentative { get; set; } // VARCHAR(200)
}
```

### 3. **Migration Files (`Migrations/`)**
Migration files contain the SQL commands to create/modify database schema:

- **`20251129233400_InitialCreate.cs`**: Contains `Up()` and `Down()` methods
  - `Up()`: Creates the Sales table with all columns
  - `Down()`: Drops the Sales table (rollback)

- **`SalesDbContextModelSnapshot.cs`**: Tracks current database state

### 4. **Connection Configuration (`appsettings.json`)**
```json
{
  "ConnectionStrings": {
    "SalesTrackDb": "Host=localhost;Database=SalesTrackDb;Username=postgres;Password=postgres_password"
  }
}
```

### 5. **Automatic Migration Execution (`Program.cs`)**
```csharp
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SalesDbContext>();
    
    // This line runs all pending migrations
    context.Database.Migrate();
    
    // This line seeds initial data
    DataSeeder.SeedData(context);
}
```

---

## 🔄 Migration Execution Flow

```
Application Startup
    ↓
1. Read connection string from appsettings.json
    ↓
2. Connect to PostgreSQL (SalesTrackDb)
    ↓
3. Check __EFMigrationsHistory table
    ↓
4. Run pending migrations (creates Sales table if needed)
    ↓
5. Seed sample data (if table is empty)
    ↓
6. API Ready to handle requests
```

---

## 📊 Database Schema Created

```sql
CREATE TABLE "Sales" (
    "Id" SERIAL PRIMARY KEY,
    "ProductName" VARCHAR(200) NOT NULL,
    "Category" VARCHAR(100) NOT NULL,
    "Amount" NUMERIC(18,2) NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "SaleDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "Region" VARCHAR(100) NOT NULL,
    "SalesRepresentative" VARCHAR(200) NOT NULL
);

-- Indexes for performance
CREATE INDEX "IX_Sales_SaleDate" ON "Sales" ("SaleDate");
CREATE INDEX "IX_Sales_Category" ON "Sales" ("Category");
CREATE INDEX "IX_Sales_Region" ON "Sales" ("Region");
```

---

## 🎯 How API Endpoints Use Database Data

### **Service Layer Pattern**

The API uses a service layer (`SalesService.cs`) to interact with the database:

```
Controller → Service → DbContext → PostgreSQL
```

### 1. **Sales Controller** - CRUD Operations

#### GET All Sales
```csharp
[HttpGet]
public async Task<ActionResult<IEnumerable<Sale>>> GetAllSales()
{
    var sales = await _salesService.GetAllSalesAsync();
    return Ok(sales);
}
```
**SQL Generated:**
```sql
SELECT "Id", "ProductName", "Category", "Amount", "Quantity", 
       "SaleDate", "Region", "SalesRepresentative" 
FROM "Sales";
```

#### GET by Date Range
```csharp
[HttpGet("daterange")]
public async Task<ActionResult<IEnumerable<Sale>>> GetSalesByDateRange(
    [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
{
    var sales = await _salesService.GetSalesByDateRangeAsync(startDate, endDate);
    return Ok(sales);
}
```
**SQL Generated:**
```sql
SELECT * FROM "Sales" 
WHERE "SaleDate" >= @startDate AND "SaleDate" < @endDate
ORDER BY "SaleDate" DESC;
```

#### POST New Sale
```csharp
[HttpPost]
public async Task<ActionResult<Sale>> CreateSale([FromBody] Sale sale)
{
    var createdSale = await _salesService.CreateSaleAsync(sale);
    return CreatedAtAction(nameof(GetSaleById), new { id = createdSale.Id }, createdSale);
}
```
**SQL Generated:**
```sql
INSERT INTO "Sales" ("ProductName", "Category", "Amount", "Quantity", 
                     "SaleDate", "Region", "SalesRepresentative")
VALUES (@p0, @p1, @p2, @p3, @p4, @p5, @p6)
RETURNING "Id";
```

### 2. **Metrics Controller** - Aggregations

#### GET Metrics
```csharp
[HttpGet]
public async Task<ActionResult<SalesMetrics>> GetMetrics(
    [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
{
    var metrics = await _salesService.GetMetricsAsync(startDate, endDate);
    return Ok(metrics);
}
```

**Service Implementation:**
```csharp
public async Task<SalesMetrics> GetMetricsAsync(DateTime? startDate, DateTime? endDate)
{
    var query = _context.Sales.AsQueryable();
    
    if (startDate.HasValue)
        query = query.Where(s => s.SaleDate >= startDate.Value);
    
    if (endDate.HasValue)
        query = query.Where(s => s.SaleDate < endDate.Value);
    
    return new SalesMetrics
    {
        TotalSales = await query.CountAsync(),
        TotalRevenue = await query.SumAsync(s => s.Amount),
        AverageOrderValue = await query.AverageAsync(s => s.Amount),
        TotalQuantity = await query.SumAsync(s => s.Quantity)
    };
}
```

**SQL Generated:**
```sql
-- EF Core optimizes this into efficient queries
SELECT COUNT(*) FROM "Sales" WHERE "SaleDate" >= @start AND "SaleDate" < @end;
SELECT SUM("Amount") FROM "Sales" WHERE "SaleDate" >= @start AND "SaleDate" < @end;
SELECT AVG("Amount") FROM "Sales" WHERE "SaleDate" >= @start AND "SaleDate" < @end;
SELECT SUM("Quantity") FROM "Sales" WHERE "SaleDate" >= @start AND "SaleDate" < @end;
```

### 3. **Visualization Controller** - Complex Aggregations

#### GET Sales by Category
```csharp
[HttpGet("by-category")]
public async Task<ActionResult<IEnumerable<CategorySalesData>>> GetSalesByCategory(
    [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
{
    var chartData = await _salesService.GetChartDataAsync(startDate, endDate);
    return Ok(chartData.SalesByCategory);
}
```

**Service Implementation:**
```csharp
var salesByCategory = await query
    .GroupBy(s => s.Category)
    .Select(g => new CategorySalesData
    {
        Category = g.Key,
        TotalSales = g.Sum(s => s.Amount),
        Count = g.Count()
    })
    .ToListAsync();
```

**SQL Generated:**
```sql
SELECT "Category", 
       SUM("Amount") as "TotalSales", 
       COUNT(*) as "Count"
FROM "Sales"
WHERE "SaleDate" >= @start AND "SaleDate" < @end
GROUP BY "Category";
```

---

## 🔍 Data Flow Examples

### Example 1: Creating a Sale

**Request:**
```http
POST /api/sales
Content-Type: application/json

{
  "productName": "Laptop",
  "category": "Electronics",
  "amount": 1299.99,
  "quantity": 1,
  "saleDate": "2025-11-29T10:30:00Z",
  "region": "North",
  "salesRepresentative": "John Doe"
}
```

**Flow:**
```
1. Controller receives JSON
2. Model binding converts to Sale object
3. SalesService.CreateSaleAsync() called
4. DbContext.Sales.Add(sale)
5. DbContext.SaveChangesAsync()
6. EF Core generates INSERT SQL
7. PostgreSQL executes and returns new ID
8. Response sent with created sale (includes ID)
```

**Response:**
```json
{
  "id": 1234,
  "productName": "Laptop",
  "category": "Electronics",
  "amount": 1299.99,
  "quantity": 1,
  "saleDate": "2025-11-29T10:30:00Z",
  "region": "North",
  "salesRepresentative": "John Doe"
}
```

### Example 2: Getting Weekly Metrics

**Request:**
```http
GET /api/metrics/week
```

**Flow:**
```
1. Controller determines start of week
2. Calculates date range (Monday to today)
3. SalesService.GetMetricsAsync(startDate, endDate)
4. Multiple queries executed:
   - COUNT for total sales
   - SUM for total revenue
   - AVG for average order value
5. Results aggregated into SalesMetrics object
6. JSON response sent
```

**Response:**
```json
{
  "totalSales": 45,
  "totalRevenue": 23456.78,
  "averageOrderValue": 521.26,
  "totalQuantity": 112,
  "startDate": "2025-11-25T00:00:00Z",
  "endDate": "2025-11-29T23:59:59Z"
}
```

---

## 🚀 Key Benefits of This Architecture

1. **Type Safety**: Compile-time checking of queries
2. **Automatic SQL Generation**: EF Core handles SQL translation
3. **Database Independence**: Easy to switch databases
4. **Migration Tracking**: Version control for database schema
5. **Performance**: Indexes optimize common queries
6. **Maintainability**: Clean separation of concerns

---

## 📦 Sample Data

On first run, the application seeds ~900-1200 sales records:
- **90 days** of historical data
- **5 categories**: Electronics, Clothing, Food, Home & Garden, Sports
- **5 regions**: North, South, East, West, Central
- **5 sales reps**: Alice Johnson, Bob Smith, Carol Davis, David Wilson, Emma Brown
- **Random but realistic** amounts and quantities

---

## 🔧 Testing the API

### Using Swagger UI
1. Navigate to: http://localhost:5158/swagger
2. Expand any endpoint
3. Click "Try it out"
4. Fill parameters (if any)
5. Click "Execute"
6. View response

### Using Postman
Import `SalesTrackApi.postman_collection.json`:
- Pre-configured requests for all endpoints
- Variables for base URL and common parameters
- Sample request bodies for POST/PUT

### Using cURL
```bash
# Get all sales
curl http://localhost:5158/api/sales

# Get metrics
curl http://localhost:5158/api/metrics

# Create a sale
curl -X POST http://localhost:5158/api/sales \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Test Product",
    "category": "Electronics",
    "amount": 99.99,
    "quantity": 1,
    "saleDate": "2025-11-29T00:00:00Z",
    "region": "North",
    "salesRepresentative": "Test User"
  }'
```

---

## 📚 Project Structure

```
src/SalesTrackApi/
├── Controllers/           # API endpoints
│   ├── SalesController.cs       # CRUD operations
│   ├── MetricsController.cs     # Aggregated metrics
│   └── VisualizationController.cs  # Chart data
├── Data/                  # Database layer
│   ├── SalesDbContext.cs        # EF Core context
│   └── DataSeeder.cs            # Sample data generation
├── Migrations/            # Database migrations
│   ├── 20251129233400_InitialCreate.cs
│   └── SalesDbContextModelSnapshot.cs
├── Models/                # Data models
│   ├── Sale.cs                  # Sale entity
│   ├── SalesMetrics.cs          # Metrics DTO
│   └── SalesChartData.cs        # Visualization DTO
├── Services/              # Business logic
│   ├── ISalesService.cs         # Service interface
│   └── SalesService.cs          # Service implementation
└── appsettings.json       # Configuration (connection string)
```

---

## ✅ Summary

**Database Migration:**
- Entity Framework Core manages database schema
- Migrations are version-controlled code files
- Application automatically applies migrations on startup
- PostgreSQL stores data persistently

**API Data Usage:**
- Controllers receive HTTP requests
- Services contain business logic and database queries
- DbContext translates LINQ to SQL
- PostgreSQL executes queries and returns results
- JSON responses sent to clients

**Everything is connected:**
```
HTTP Request → Controller → Service → DbContext → PostgreSQL → Response
```

This architecture provides a robust, maintainable, and scalable foundation for your sales tracking API! 🎉