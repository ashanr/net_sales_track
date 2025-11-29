export interface Sale {
    id: number;
    productName: string;
    category: string;
    amount: number;
    quantity: number;
    saleDate: string;
    region: string;
    salesRepresentative: string;
}

export interface SalesMetrics {
    totalRevenue: number;
    totalSales: number;
    totalQuantity: number;
    averageOrderValue: number;
    periodStart: string;
    periodEnd: string;
}

export interface CategorySalesData {
    category: string;
    totalAmount: number;
    salesCount: number;
}

export interface RegionSalesData {
    region: string;
    totalAmount: number;
    salesCount: number;
}

export interface TimeSeriesData {
    date: string;
    totalAmount: number;
    salesCount: number;
}

export interface SalesChartData {
    salesByCategory: CategorySalesData[];
    salesByRegion: RegionSalesData[];
    salesOverTime: TimeSeriesData[];
}
