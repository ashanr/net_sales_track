import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { SalesApiService } from '../../services/sales-api.service';
import { SalesChartData } from '../../models/sales.model';

@Component({
    selector: 'app-charts',
    standalone: true,
    imports: [CommonModule, BaseChartDirective],
    template: `
    <section class="charts-section">
      <h2 class="section-title">Sales Analytics</h2>
      <div class="charts-grid">
        <!-- Category Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Sales by Category</h3>
          </div>
          <div class="chart-container">
            <canvas baseChart
              *ngIf="categoryChartData"
              [data]="categoryChartData"
              [options]="doughnutChartOptions"
              [type]="'doughnut'">
            </canvas>
          </div>
        </div>

        <!-- Region Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Sales by Region</h3>
          </div>
          <div class="chart-container">
            <canvas baseChart
              *ngIf="regionChartData"
              [data]="regionChartData"
              [options]="barChartOptions"
              [type]="'bar'">
            </canvas>
          </div>
        </div>

        <!-- Time Series Chart -->
        <div class="chart-card chart-wide">
          <div class="chart-header">
            <h3>Sales Trend (Last 30 Days)</h3>
          </div>
          <div class="chart-container">
            <canvas baseChart
              *ngIf="timeSeriesChartData"
              [data]="timeSeriesChartData"
              [options]="lineChartOptions"
              [type]="'line'">
            </canvas>
          </div>
        </div>
      </div>
    </section>
  `,
    styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnChanges {
    @Input() refreshTrigger = 0;

    categoryChartData?: ChartConfiguration['data'];
    regionChartData?: ChartConfiguration['data'];
    timeSeriesChartData?: ChartConfiguration['data'];

    doughnutChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(18, 24, 43, 0.9)',
                padding: 12,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1
            }
        }
    };

    barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(18, 24, 43, 0.9)',
                padding: 12,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.05)' }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    lineChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(18, 24, 43, 0.9)',
                padding: 12,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.05)' }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    constructor(private salesApi: SalesApiService) { }

    ngOnInit(): void {
        this.loadChartData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
            this.loadChartData();
        }
    }

    private loadChartData(): void {
        this.salesApi.getChartData().subscribe({
            next: (data) => {
                this.categoryChartData = this.createCategoryChart(data);
                this.regionChartData = this.createRegionChart(data);
                this.timeSeriesChartData = this.createTimeSeriesChart(data);
            },
            error: (error) => console.error('Failed to load chart data:', error)
        });
    }

    private createCategoryChart(data: SalesChartData): ChartConfiguration['data'] {
        const colors = [
            'rgba(102, 126, 234, 0.8)',
            'rgba(79, 172, 254, 0.8)',
            'rgba(240, 147, 251, 0.8)',
            'rgba(255, 167, 38, 0.8)',
            'rgba(118, 75, 162, 0.8)'
        ];

        return {
            labels: data.salesByCategory.map(item => item.category),
            datasets: [{
                data: data.salesByCategory.map(item => item.totalAmount),
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#0a0e1a'
            }]
        };
    }

    private createRegionChart(data: SalesChartData): ChartConfiguration['data'] {
        return {
            labels: data.salesByRegion.map(item => item.region),
            datasets: [{
                label: 'Sales',
                data: data.salesByRegion.map(item => item.totalAmount),
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2
            }]
        };
    }

    private createTimeSeriesChart(data: SalesChartData): ChartConfiguration['data'] {
        const sortedData = [...data.salesOverTime]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-30);

        return {
            labels: sortedData.map(item => new Date(item.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })),
            datasets: [{
                label: 'Daily Sales',
                data: sortedData.map(item => item.totalAmount),
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }]
        };
    }
}
