import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricCardComponent } from '../metric-card/metric-card.component';
import { BitcoinPriceComponent } from '../bitcoin-price/bitcoin-price.component';
import { SalesApiService } from '../../services/sales-api.service';
import { SalesMetrics } from '../../models/sales.model';

@Component({
    selector: 'app-metrics',
    standalone: true,
    imports: [CommonModule, MetricCardComponent, BitcoinPriceComponent],
    template: `
    <section class="metrics-section">
      <h2 class="section-title">Key Performance Indicators</h2>
      <div class="metrics-grid">
        <app-metric-card
          [label]="'Today'"
          [icon]="'clock'"
          [metrics]="todayMetrics"
          [iconClass]="'today'"
        ></app-metric-card>

        <app-metric-card
          [label]="'This Week'"
          [icon]="'calendar'"
          [metrics]="weekMetrics"
          [iconClass]="'week'"
        ></app-metric-card>

        <app-metric-card
          [label]="'This Month'"
          [icon]="'info'"
          [metrics]="monthMetrics"
          [iconClass]="'month'"
        ></app-metric-card>

        <app-metric-card
          [label]="'Avg Order Value'"
          [icon]="'cart'"
          [metrics]="aovMetrics"
          [iconClass]="'aov'"
          [showAOV]="true"
        ></app-metric-card>

        <app-bitcoin-price></app-bitcoin-price>
      </div>
    </section>
  `,
    styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit, OnChanges {
    @Input() refreshTrigger = 0;

    todayMetrics: SalesMetrics | null = null;
    weekMetrics: SalesMetrics | null = null;
    monthMetrics: SalesMetrics | null = null;
    aovMetrics: SalesMetrics | null = null;

    constructor(private salesApi: SalesApiService) { }

    ngOnInit(): void {
        this.loadAllMetrics();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
            this.loadAllMetrics();
        }
    }

    private loadAllMetrics(): void {
        this.salesApi.getMetrics('today').subscribe({
            next: (metrics) => { this.todayMetrics = metrics; },
            error: (error) => { console.error('Failed to load today metrics:', error); }
        });

        this.salesApi.getMetrics('week').subscribe({
            next: (metrics) => { this.weekMetrics = metrics; },
            error: (error) => { console.error('Failed to load week metrics:', error); }
        });

        this.salesApi.getMetrics('month').subscribe({
            next: (metrics) => {
                this.monthMetrics = metrics;
                this.aovMetrics = metrics;
            },
            error: (error) => { console.error('Failed to load month metrics:', error); }
        });
    }
}
