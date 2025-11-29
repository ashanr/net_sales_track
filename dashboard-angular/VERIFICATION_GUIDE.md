# Angular Dashboard with Bitcoin Price - Verification Guide

This guide will help you run and verify the Angular dashboard with the new Bitcoin price integration.

## Prerequisites Check

Before running the dashboard, ensure you have:

1. **Node.js and npm installed**
   ```powershell
   node --version  # Should be 18.x or higher
   npm --version   # Should be 9.x or higher
   ```

2. **PowerShell Execution Policy** (if needed)
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

## Step-by-Step Setup

### 1. Install Dependencies

Navigate to the Angular dashboard directory and install:

```powershell
cd c:\Users\asus\Documents\apps\net_sales_track\dashboard-angular
npm install
```

This will install:
- Angular 18 framework
- Chart.js and ng2-charts
- RxJS for reactive programming
- TypeScript compiler
- Development tools

### 2. Start the Sales API

In a separate terminal window:

```powershell
cd c:\Users\asus\Documents\apps\net_sales_track\src\SalesTrackApi
dotnet run
```

Verify the API is running at `http://localhost:5158`

### 3. Start the Angular Development Server

Back in the dashboard-angular directory:

```powershell
npm start
```

Or if you prefer:
```powershell
npx ng serve
```

The dashboard will be available at `http://localhost:4200`

### 4. Open in Browser

Navigate to `http://localhost:4200` in your web browser.

## What to Verify

### ✅ Visual Checks

- [ ] Premium dark theme displays correctly
- [ ] Glassmorphism effects on cards
- [ ] Gradient accents throughout the UI
- [ ] Smooth fade-in animations on page load
- [ ] Responsive layout on different screen sizes

### ✅ Sales Metrics

- [ ] Today's metrics load and display
-[] Weekly metrics load and display
- [ ] Monthly metrics load and display
- [ ] Average Order Value displays
- [ ] Values animate when loading

### ✅ Bitcoin Price (NEW FEATURE!)

- [ ] Bitcoin price card displays
- [ ] Current BTC/USD price shows
- [ ] 24-hour change percentage displays
- [ ] Green up arrow for positive change
- [ ] Red down arrow for negative change
- [ ] "Last updated" timestamp appears
- [ ] Price updates automatically after 60 seconds

### ✅ Charts

- [ ] Sales by Category doughnut chart renders
- [ ] Sales by Region bar chart renders
- [ ] Sales Trend line chart renders
- [ ] Charts display actual data from API
- [ ] Hover tooltips work on all charts

### ✅ Sales Table

- [ ] Recent sales data loads
- [ ] Table displays properly formatted data
- [ ] Search box filters sales correctly
- [ ] Row hover effects work

### ✅ Functionality

- [ ] Refresh button reloads all data
- [ ] No JavaScript errors in browser console
- [ ] TypeScript compilation succeeds
- [ ] All API calls complete successfully

## Troubleshooting Commands

### If npm install fails:

```powershell
# Clear npm cache
npm cache clean --force

# Try install again
npm install
```

### If ng serve fails:

```powershell
# Install Angular CLI globally
npm install -g @angular/cli

# Try serve again
ng serve
```

### If execution policy blocks scripts:

```powershell
# Run as Administrator and execute:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
```

### Check for errors:

```powershell
# Build in development mode to see detailed errors
npx ng build --configuration development
```

## Expected Console Output

When everything is working, you should see:

```
✔ Browser application bundle generation complete.
Initial Chunk Files   | Names         |  Raw Size
main.js               | main          |   X KB
polyfills.js          | polyfills     |   Y KB
styles.css            | styles        |   Z KB

Application bundle generation complete.
** Angular Live Development Server is listening on localhost:4200 **
✔ Compiled successfully.
```

## Browser Console Check

Open browser DevTools (F12) and verify:

1. **No errors** in the Console tab
2. **Network tab** shows successful API calls:
   - `GET http://localhost:5158/api/metrics/today` - 200 OK
   - `GET http://localhost:5158/api/metrics/week` - 200 OK
   - `GET http://localhost:5158/api/metrics/month` - 200 OK
   - `GET http://localhost:5158/api/visualization/charts` - 200 OK
   - `GET http://localhost:5158/api/sales` - 200 OK
   - `GET https://api.coingecko.com/api/v3/simple/price...` - 200 OK

## Success Criteria

The Angular dashboard is successfully running if:

✅ Page loads without errors  
✅ All four sales metrics display with real data  
✅ **Bitcoin price card shows current BTC price**  
✅ **Bitcoin price updates automatically every 60 seconds**  
✅ All three charts render with data  
✅ Sales table populates with transactions  
✅ Search functionality filters the table  
✅ Refresh button reloads all data  
✅ No console errors  

## Next Steps After Verification

Once verified, you can:

1. **Build for production**:
   ```powershell
   npm run build
   ```

2. **Deploy** the `dist/` folder to your web server

3. **Customize** colors and styling in `src/styles.scss`

4. **Extend** functionality by adding new components

5. **Configure** the Bitcoin refresh interval in `bitcoin-price.component.ts`

---

**If all checks pass, your Angular dashboard with Bitcoin price integration is ready to use! 🎉**
