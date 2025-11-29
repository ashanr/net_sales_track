import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { MetricsComponent } from '../metrics/metrics.component';
import { ChartsComponent } from '../charts/charts.component';
import { SalesTableComponent } from '../sales-table/sales-table.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        HeaderComponent,
        MetricsComponent,
        ChartsComponent,
        SalesTableComponent
    ],
    template: `
    <app-header (refresh)="onRefresh()"></app-header>
    <main class="dashboard-main">
      <div class="container">
        <app-metrics [refreshTrigger]="refreshTrigger"></app-metrics>
        <app-charts [refreshTrigger]="refreshTrigger"></app-charts>
        <app-sales-table [refreshTrigger]="refreshTrigger"></app-sales-table>
      </div>
    </main>
    <footer class="dashboard-footer">
      <div class="footer-content">
        <p>&copy; 2025 Sales Track. Connected to API at <code>http://localhost:5158</code></p>
      </div>
    </footer>
  `,
    styles: []
})
export class DashboardComponent {
    refreshTrigger = 0;

    onRefresh(): void {
        this.refreshTrigger++;
    }
}
