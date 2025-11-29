# Sales Dashboard - Angular Edition

A modern Angular-based sales tracking dashboard with real-time metrics, interactive visualizations, and **live Bitcoin price tracking**.

## ✨ Features

### Sales Analytics
- **Real-time Metrics**: Daily, weekly, and monthly KPIs with type-safe data
- **Interactive Charts**: Category breakdown, regional analysis, and time-series trends using Chart.js
- **Sales Data Table**: Searchable, filterable table of recent transactions
- **Auto-refresh**: One-click refresh for all dashboard data

### 💰 Bitcoin Price Integration (NEW!)
- **Live Price Updates**: Real-time Bitcoin price from CoinGecko API
- **24h Change Indicator**: Green/red arrows with percentage change
- **Auto-refresh**: Updates every 60 seconds automatically
- **Last Update Timestamp**: Shows when data was last fetched

### Premium Design
- **Dark Theme**: Modern, eye-friendly dark mode
- **Glassmorphism Effects**: Frosted glass aesthetic with backdrop blur
- **Vibrant Gradients**: Custom color palette throughout
- **Smooth Animations**: Fade-in effects and micro-interactions
- **Responsive Layout**: Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **.NET 8 SDK** (for the API)
- **Angular CLI** (will be installed with npm install)

### Setup

1. **Install Dependencies**:
   ```powershell
   cd dashboard-angular
   npm install
   ```

2. **Start the Sales API**:
   ```powershell
   # In a separate terminal
   cd ../src/SalesTrackApi
   dotnet run
   ```
   API will run on `http://localhost:5158`

3. **Start the Angular Dashboard**:
   ```powershell
   # Back in dashboard-angular directory
   npm start
   # Or: npx ng serve
   ```
   Dashboard will be available at `http://localhost:4200`

The dashboard will automatically connect to both:
- Sales Track API (`http://localhost:5158`)
- CoinGecko API (for Bitcoin prices)

## 📦 Technology Stack

- **Angular 18**: Modern standalone components architecture
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming for data streams
- **Chart.js + ng2-charts**: Interactive data visualizations
- **SCSS**: Advanced styling with variables and mixins
- **CoinGecko API**: Real-time cryptocurrency prices

## 📁 Project Structure

```
dashboard-angular/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── header/              # Header with refresh button
│   │   │   ├── metrics/             # Metrics container
│   │   │   ├── metric-card/         # Reusable metric card
│   │   │   ├── bitcoin-price/       # 🆕 Bitcoin price card
│   │   │   ├── charts/              # Charts container with Chart.js
│   │   │   └── sales-table/         # Sales data table with search
│   │   ├── models/
│   │   │   ├── sales.model.ts       # Sales data interfaces
│   │   │   └── bitcoin.model.ts     # Bitcoin data interfaces
│   │   ├── services/
│   │   │   ├── sales-api.service.ts # Sales API client
│   │   │   └── bitcoin.service.ts   # Bitcoin price service
│   │   └── app.component.ts         # Root component
│   ├── styles.scss                  # Global styles with design system
│   ├── main.ts                      # Application entry point
│   └── index.html                   # HTML entry point
├── angular.json                     # Angular CLI configuration
├── package.json                     # Dependencies
└── tsconfig.json                    # TypeScript configuration
```

## 🎨 Features in Detail

### Bitcoin Price Card

The Bitcoin price component showcases advanced Angular features:

- **Reactive Data Stream**: Uses RxJS `interval` operator for auto-refresh
- **HTTP Client**: Fetches from CoinGecko API with type-safe responses
- **Error Handling**: Graceful degradation if API is unavailable
- **Dynamic Styling**: Green/red indicators based on price  movement
- **Lifecycle Management**: Proper cleanup with `OnDestroy`

Example usage:
```typescript
// Automatically updates every 60 seconds
this.bitcoinService.getBitcoinPriceWithInterval(60000).subscribe(price => {
  this.bitcoinPrice = price;
});
```

### Component Architecture

All components use Angular's modern **standalone** pattern:
- No NgModules required
- Simplified imports
- Better tree-shaking
- Easier testing

### Type Safety

Full TypeScript coverage with interfaces:
```typescript
export interface BitcoinPrice {
  usd: number;
  usd_24h_change: number;
  last_updated_at: number;
}
```

## 🛠️ Development

### Run Development Server

```powershell
npm start
```

Navigate to `http://localhost:4200`. The application will automatically reload when you change source files.

### Build for Production

```powershell
npm run build
```

Build artifacts will be stored in the `dist/` directory.

### Code Formatting

The project uses Angular's default code style. TypeScript strict mode is enabled for maximum type safety.

## 🔧 Configuration

### Change API URLs

Edit service files:

**Sales API** (`src/app/services/sales-api.service.ts`):
```typescript
private readonly apiUrl = 'http://localhost:5158/api';
```

**Bitcoin API** (`src/app/services/bitcoin.service.ts`):
```typescript
private readonly apiUrl = 'https://api.coingecko.com/api/v3/simple/price';
```

### Adjust Bitcoin Refresh Rate

In `bitcoin-price.component.ts`:
```typescript
// Change 60000 ms (60 seconds) to your preferred interval
this.bitcoinService.getBitcoinPriceWithInterval(60000)
```

### Customize Colors

Edit SCSS variables in `src/styles.scss`:
```scss
$color-accent-purple: #667eea;
$gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 📊 API Endpoints Used

### Sales Track API
- `GET /api/metrics/today` - Today's metrics
- `GET /api/metrics/week` - Weekly metrics
- `GET /api/metrics/month` - Monthly metrics
- `GET /api/visualization/charts` - All chart data
- `GET /api/sales` - Sales transactions

### CoinGecko API
- `GET /simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true`

## 🐛 Troubleshooting

### Dashboard shows "Loading..." indefinitely

1. Ensure the .NET API is running on port 5158
2. Check browser console for CORS errors
3. Verify database is initialized with sample data

### Bitcoin price not loading

1. Check internet connection
2. Verify CoinGecko API is accessible
3. Open browser dev tools and check Network tab for API errors
4. CoinGecko has rate limits - wait a minute and refresh

### Charts not rendering

1. Ensure `ng2-charts` is installed: `npm install ng2-charts chart.js`
2. Check browser console for Chart.js errors
3. Verify API returns valid chart data

### Build errors

If you encounter TypeScript errors:
```powershell
npm install
ng build --configuration development
```

## 🚀 Production Deployment

1. Build the application:
   ```powershell
   npm run build
   ```

2. Deploy the `dist/sales-dashboard-angular` folder to your web server

3. Configure environment-specific API URLs

4. Ensure CORS is properly configured on the backend API

## 📝 License

Part of the Sales Track API project.

## 🆕 What's New in Angular Version

- ✅ **TypeScript** throughout for type safety
- ✅ **Standalone components** (no NgModules)
- ✅ **RxJS** for reactive data streams
- ✅ **Bitcoin price integration** with auto-refresh
- ✅ **Component-based architecture** for maintainability
- ✅ **SCSS** with variables and mixins
- ✅ **Hot Module Replacement** for faster development
- ✅ **AOT compilation** for optimized production builds

---

**Enjoy your premium Angular dashboard! 🎉**
