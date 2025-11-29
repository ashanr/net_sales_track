using Microsoft.EntityFrameworkCore;
using SalesTrackApi.Data;
using SalesTrackApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Sales Track API",
        Version = "v1",
        Description = "A .NET API providing data fetching facilities for sales monitoring and visualization tools"
    });
});

// Add Entity Framework with PostgreSQL database
builder.Services.AddDbContext<SalesDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("SalesTrackDb")));

// Add services
builder.Services.AddScoped<ISalesService, SalesService>();

// Add CORS for external visualization tools
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVisualizationTools", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add health checks for monitoring
builder.Services.AddHealthChecks();

var app = builder.Build();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SalesDbContext>();
    try
    {
        Console.WriteLine("Running database migrations...");
        context.Database.Migrate();
        Console.WriteLine("Migrations completed successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Migration failed: {ex.Message}");
        throw;
    }

    try
    {
        Console.WriteLine("Seeding data...");
        DataSeeder.SeedData(context);
        Console.WriteLine("Data seeding completed.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Data seeding failed: {ex.Message}");
        throw;
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowVisualizationTools");
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
