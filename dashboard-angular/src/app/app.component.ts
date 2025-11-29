import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { MetricsComponent } from './components/metrics/metrics.component';
import { ChartsComponent } from './components/charts/charts.component';
import { SalesTableComponent } from './components/sales-table/sales-table.component';

@Component({
    selector: 'app-root',
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
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    refreshTrigger = 0;

    onRefresh(): void {
        this.refreshTrigger++;
    }
}
