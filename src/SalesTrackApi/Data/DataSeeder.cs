using SalesTrackApi.Models;

namespace SalesTrackApi.Data;

public static class DataSeeder
{
    public static void SeedData(SalesDbContext context)
    {
        if (context.Sales.Any())
        {
            return;
        }

        var categories = new[] { "Electronics", "Clothing", "Food", "Home & Garden", "Sports" };
        var regions = new[] { "North", "South", "East", "West", "Central" };
        var products = new Dictionary<string, string[]>
        {
            { "Electronics", new[] { "Laptop", "Smartphone", "Tablet", "Headphones", "Smartwatch" } },
            { "Clothing", new[] { "T-Shirt", "Jeans", "Jacket", "Sneakers", "Hat" } },
            { "Food", new[] { "Coffee", "Organic Snacks", "Energy Drink", "Protein Bar", "Tea" } },
            { "Home & Garden", new[] { "Plant Pot", "Garden Tools", "Lamp", "Rug", "Cushion" } },
            { "Sports", new[] { "Basketball", "Tennis Racket", "Yoga Mat", "Dumbbells", "Running Shoes" } }
        };
        var salesReps = new[] { "Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson", "Emma Brown" };

        var random = new Random(42);
        var sales = new List<Sale>();

        // Generate sales for the last 90 days
        for (int day = 0; day < 90; day++)
        {
            var date = DateTime.UtcNow.Date.AddDays(-day);
            var salesCount = random.Next(5, 15);

            for (int i = 0; i < salesCount; i++)
            {
                var category = categories[random.Next(categories.Length)];
                var product = products[category][random.Next(products[category].Length)];
                var quantity = random.Next(1, 10);
                var unitPrice = random.Next(10, 500) + random.NextDouble();
                var amount = (decimal)(quantity * unitPrice);

                sales.Add(new Sale
                {
                    ProductName = product,
                    Category = category,
                    Amount = Math.Round(amount, 2),
                    Quantity = quantity,
                    SaleDate = date.AddHours(random.Next(8, 20)).AddMinutes(random.Next(0, 60)),
                    Region = regions[random.Next(regions.Length)],
                    SalesRepresentative = salesReps[random.Next(salesReps.Length)]
                });
            }
        }

        context.Sales.AddRange(sales);
        context.SaveChanges();
    }
}
