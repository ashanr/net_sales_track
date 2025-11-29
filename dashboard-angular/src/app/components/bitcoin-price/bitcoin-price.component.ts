import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BitcoinService } from '../../services/bitcoin.service';
import { BitcoinPrice } from '../../models/bitcoin.model';

@Component({
    selector: 'app-bitcoin-price',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="metric-card bitcoin-card">
      <div class="metric-header">
        <span class="metric-label">Bitcoin Price</span>
        <div class="metric-icon crypto">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.06 11.57C17.65 10.88 18 9.98 18 9c0-2.21-1.79-4-4-4h-1V3h-2v2h-1V3H8v2H6v2h2v10H6v2h2v2h2v-2h1v2h2v-2h1c2.21 0 4-1.79 4-4 0-1.45-.78-2.73-1.94-3.43zM10 7h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4V7zm4 10h-4v-4h4c1.1 0 2 .9 2 2s-.9 2-2 2z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      <div class="metric-value" *ngIf="bitcoinPrice">
        {{ formatCurrency(bitcoinPrice.usd) }}
      </div>
      <div class="metric-value" *ngIf="!bitcoinPrice">
        <span class="loading-text">Loading...</span>
      </div>
      <div class="metric-details">
        <span *ngIf="bitcoinPrice" 
              [class.price-up]="isPriceUp()"
              [class.price-down]="!isPriceUp()">
          <svg *ngIf="isPriceUp()" viewBox="0 0 12 12" class="trend-arrow">
            <path d="M6 2L10 8H2L6 2Z" fill="currentColor"/>
          </svg>
          <svg *ngIf="!isPriceUp()" viewBox="0 0 12 12" class="trend-arrow">
            <path d="M6 10L10 4H2L6 10Z" fill="currentColor"/>
          </svg>
          {{ formatPercentage(bitcoinPrice.usd_24h_change) }}% (24h)
        </span>
        <span *ngIf="bitcoinPrice" class="last-update">
          Updated {{ getLastUpdateTime(bitcoinPrice.last_updated_at) }}
        </span>
      </div>
      <div class="loading-shimmer"></div>
    </div>
  `,
    styleUrls: ['./bitcoin-price.component.scss']
})
export class BitcoinPriceComponent implements OnInit, OnDestroy {
    bitcoinPrice: BitcoinPrice | null = null;
    private subscription?: Subscription;

    constructor(private bitcoinService: BitcoinService) { }

    ngOnInit(): void {
        // Auto-refresh every 60 seconds
        this.subscription = this.bitcoinService.getBitcoinPriceWithInterval(60000).subscribe({
            next: (price) => { this.bitcoinPrice = price; },
            error: (error) => { console.error('Bitcoin price update failed:', error); }
        });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatPercentage(value: number): string {
        return (value >= 0 ? '+' : '') + value.toFixed(2);
    }

    isPriceUp(): boolean {
        return (this.bitcoinPrice?.usd_24h_change || 0) >= 0;
    }

    getLastUpdateTime(timestamp: number): string {
        const now = Date.now();
        const diff = now - (timestamp * 1000);
        const seconds = Math.floor(diff / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 120) return '1 min ago';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
        return new Date(timestamp * 1000).toLocaleTimeString();
    }
}
