# Sales Dashboard

A modern, real-time sales tracking dashboard with interactive visualizations and premium design aesthetics.

## Features

- **Real-time Metrics**: Daily, weekly, and monthly KPIs with animated counters
- **Interactive Charts**: 
  - Sales breakdown by category (doughnut chart)
  - Sales by region (bar chart)
  - Time-series trend analysis (line chart)
- **Sales Data Table**: Recent sales with search functionality
- **Premium Dark Theme**: Glassmorphism effects with vibrant gradients
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Micro-interactions for enhanced user experience

## Quick Start

### Prerequisites

Ensure the Sales Track API is running on `http://localhost:5158`

```bash
# From the project root
cd src/SalesTrackApi
dotnet run
```

### Running the Dashboard

Simply open `index.html` in a modern web browser:

```bash
# Windows
start index.html

# Or double-click the index.html file
```

The dashboard will automatically:
- Connect to the API
- Load metrics and chart data
- Display recent sales transactions
- Enable real-time search and filtering

## Usage

### Refresh Data

Click the **Refresh** button in the header to reload all dashboard data from the API.

### Search Sales

Use the search box to filter sales by:
- Product name
- Category
- Region
- Sales representative

### View Different Time Periods

The dashboard shows metrics for:
- **Today**: Current day's performance
- **This Week**: Week-to-date metrics
- **This Month**: Month-to-date metrics
- **Average Order Value**: Monthly average

## Technology Stack

- **HTML5**: Semantic structure for SEO
- **CSS3**: Modern design with custom properties, glassmorphism, and animations
- **Vanilla JavaScript**: No framework dependencies
- **Chart.js**: Interactive data visualizations
- **Google Fonts**: Inter font family for premium typography

## Design Features

- **Dark Theme**: Easy on the eyes with high contrast
- **Glassmorphism**: Frosted glass effect on cards and sections
- **Gradient Accents**: Vibrant color gradients throughout
- **Micro-animations**: Smooth transitions and hover effects
- **Loading States**: Shimmer effects while data loads
- **Responsive Grid**: Adapts to any screen size

## API Integration

The dashboard connects to the following API endpoints:

- `/api/metrics/today` - Today's metrics
- `/api/metrics/week` - Weekly metrics
- `/api/metrics/month` - Monthly metrics
- `/api/visualization/charts` - Chart data
- `/api/sales` - Recent sales transactions

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Modern browsers with ES6+ support required.

## Troubleshooting

### Dashboard shows "Failed to load data"

1. Ensure the API is running on `http://localhost:5158`
2. Check browser console for CORS errors
3. Verify database is initialized with sample data
4. Try the refresh button

### Charts not rendering

1. Check that Chart.js CDN is accessible
2. Open browser developer tools to check for JavaScript errors
3. Ensure API returns valid data

### Search not working

Clear the search box to reset the table view.

## Customization

### Change API URL

Edit `app.js` and update the `API_BASE_URL` constant:

```javascript
const API_BASE_URL = 'http://your-api-url/api';
```

### Modify Colors

Edit `styles.css` and update the CSS custom properties in the `:root` selector.

### Adjust Chart Styles

Modify the chart configuration in `app.js` functions:
- `renderCategoryChart()`
- `renderRegionChart()`
- `renderTimeSeriesChart()`

## License

Part of the Sales Track API project.
