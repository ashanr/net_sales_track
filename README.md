# Sales Track API

A .NET 8 Web API providing data fetching facilities for sales monitoring and visualization tools.

## Features

- **Sales Data Management**: Full CRUD operations for sales records
- **Monitoring Endpoints**: Real-time metrics for dashboards (daily, weekly, monthly)
- **Visualization Data**: Aggregated data for charts (by category, region, time series)
- **Health Checks**: Built-in health monitoring endpoint
- **Swagger/OpenAPI**: Interactive API documentation

## API Endpoints

### Sales (`/api/sales`)
- `GET /api/sales` - Get all sales
- `GET /api/sales/{id}` - Get sale by ID
- `GET /api/sales/daterange?startDate={start}&endDate={end}` - Get sales by date range
- `GET /api/sales/category/{category}` - Get sales by category
- `GET /api/sales/region/{region}` - Get sales by region
- `POST /api/sales` - Create a new sale
- `PUT /api/sales/{id}` - Update a sale
- `DELETE /api/sales/{id}` - Delete a sale

### Metrics (`/api/metrics`)
- `GET /api/metrics` - Get overall sales metrics (with optional date range)
- `GET /api/metrics/today` - Get today's metrics
- `GET /api/metrics/week` - Get current week's metrics
- `GET /api/metrics/month` - Get current month's metrics

### Visualization (`/api/visualization`)
- `GET /api/visualization/charts` - Get all chart data
- `GET /api/visualization/by-category` - Get sales grouped by category
- `GET /api/visualization/by-region` - Get sales grouped by region
- `GET /api/visualization/time-series` - Get sales over time

### Health
- `GET /health` - Health check endpoint

## Getting Started

### Prerequisites
- .NET 8 SDK

### Running the API
```bash
cd src/SalesTrackApi
dotnet run
```

The API will be available at:
- HTTP: http://localhost:5158
- HTTPS: https://localhost:7144
- Swagger UI: https://localhost:7144/swagger

### Running Tests
```bash
dotnet test
```

## Project Structure

```
├── src/
│   └── SalesTrackApi/
│       ├── Controllers/       # API controllers
│       ├── Data/              # Database context and seeder
│       ├── Models/            # Data models
│       ├── Services/          # Business logic services
│       └── Program.cs         # Application entry point
├── tests/
│   └── SalesTrackApi.Tests/   # Unit tests
└── SalesTrackApi.sln          # Solution file
```

## Configuration

The API uses an in-memory database by default with sample seed data. For production use, configure a persistent database in `appsettings.json`.

## CORS

CORS is enabled for all origins to support external visualization tools.
