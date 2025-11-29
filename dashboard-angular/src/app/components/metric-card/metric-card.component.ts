import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesMetrics } from '../../models/sales.model';

@Component({
    selector: 'app-metric-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="metric-card">
      <div class="metric-header">
        <span class="metric-label">{{ label }}</span>
        <div class="metric-icon" [ngClass]="iconClass">
          <svg *ngIf="icon === 'clock'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
          </svg>
          <svg *ngIf="icon === 'calendar'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" fill="currentColor"/>
          </svg>
          <svg *ngIf="icon === 'info'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
          </svg>
          <svg *ngIf="icon === 'cart'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 6V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H2v13c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6h-6zm-6-2h4v2h-4V4zM9 18c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      <div class="metric-value">
        {{ showAOV ? formatCurrency(metrics?.averageOrderValue || 0) : formatCurrency(metrics?.totalRevenue || 0) }}
      </div>
      <div class="metric-details">
        <span *ngIf="!showAOV">{{ formatNumber(metrics?.totalSales || 0) }} sales</span>
        <span *ngIf="!showAOV">{{ formatNumber(metrics?.totalQuantity || 0) }} units</span>
        <span *ngIf="showAOV">Monthly average</span>
      </div>
      <div class="loading-shimmer"></div>
    </div>
  `,
    styleUrls: ['./metric-card.component.scss']
})
export class MetricCardComponent {
    @Input() label = '';
    @Input() icon = '';
    @Input() iconClass = '';
    @Input() metrics: SalesMetrics | null = null;
    @Input() showAOV = false;

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatNumber(num: number): string {
        return new Intl.NumberFormat('en-US').format(num);
    }
}
