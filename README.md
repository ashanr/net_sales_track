# Sales Track API

A .NET 8 Web API providing data fetching facilities for sales monitoring and visualization tools with PostgreSQL database.

## 🚀 Quick Start

### Prerequisites
- Docker (for PostgreSQL)
- .NET 8 SDK

### Setup & Run

1. **Start PostgreSQL**:
   ```bash
   docker-compose up -d
   ```

2. **Initialize Database**:
   ```bash
   Get-Content database_init.sql | docker exec -i salestrack_postgres psql -U postgres -d SalesTrackDb
   ```

3. **Run the API**:
   ```bash
   cd src/SalesTrackApi
   dotnet run
   ```

4. **Access Swagger UI**: http://localhost:5158/swagger

### Database
- **Type**: PostgreSQL 15 (Docker)
- **Connection**: localhost:5432
- **Database**: SalesTrackDb
- **Username**: postgres
- **Password**: postgres_password

## Features

- **Sales Data Management**: Full CRUD operations for sales records
- **PostgreSQL Database**: Persistent data storage with proper indexing
- **Monitoring Endpoints**: Real-time metrics for dashboards (daily, weekly, monthly)
- **Visualization Data**: Aggregated data for charts (by category, region, time series)
- **Health Checks**: Built-in health monitoring endpoint
- **Swagger/OpenAPI**: Interactive API documentation
- **Postman Collection**: Ready-to-use API collection

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

## 📚 Documentation

- **[DATABASE_GUIDE.md](DATABASE_GUIDE.md)** - Complete guide on how database migrations work and how API endpoints use data
- **[SalesTrackApi.postman_collection.json](SalesTrackApi.postman_collection.json)** - Postman collection for API testing

## Getting Started

### Prerequisites
- Docker (for PostgreSQL)
- .NET 8 SDK

### Running the API
```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Run the API
cd src/SalesTrackApi
dotnet run
```

The application will:
- Automatically connect to PostgreSQL
- Run database migrations (creates tables)
- Seed sample data (~900-1200 sales records)
- Start API on http://localhost:5158

### Access Points
- **Swagger UI**: http://localhost:5158/swagger
- **Health Check**: http://localhost:5158/health

### Running Tests
```bash
dotnet test
```

## 🛠️ Technology Stack

- **Framework**: .NET 8
- **Database**: PostgreSQL 15 (Docker)
- **ORM**: Entity Framework Core 8.0
- **Database Provider**: Npgsql.EntityFrameworkCore.PostgreSQL 8.0
- **API Documentation**: Swagger/OpenAPI
- **Testing**: xUnit

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
