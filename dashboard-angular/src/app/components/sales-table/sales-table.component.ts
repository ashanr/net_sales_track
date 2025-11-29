import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesApiService } from '../../services/sales-api.service';
import { Sale } from '../../models/sales.model';

@Component({
    selector: 'app-sales-table',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <section class="table-section">
      <div class="section-header">
        <h2 class="section-title">Recent Sales</h2>
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
          </svg>
          <input type="text" 
                 [(ngModel)]="searchQuery" 
                 (ngModelChange)="filterSales()"
                 placeholder="Search sales...">
        </div>
      </div>
      <div class="table-container">
        <table class="sales-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Category</th>
              <th>Region</th>
              <th>Sales Rep</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let sale of filteredSales">
              <td>{{ formatDate(sale.saleDate) }}</td>
              <td>{{ sale.productName }}</td>
              <td>{{ sale.category }}</td>
              <td>{{ sale.region }}</td>
              <td>{{ sale.salesRepresentative }}</td>
              <td>{{ formatNumber(sale.quantity) }}</td>
              <td><strong>{{ formatCurrency(sale.amount) }}</strong></td>
            </tr>
          </tbody>
        </table>
        <div class="table-loading" *ngIf="loading">
          <div class="loading-spinner"></div>
          <p>Loading sales data...</p>
        </div>
        <div class="table-error" *ngIf="error">
          <p>Failed to load sales data. Please try again.</p>
        </div>
      </div>
    </section>
  `,
    styleUrls: ['./sales-table.component.scss']
})
export class SalesTableComponent implements OnInit, OnChanges {
    @Input() refreshTrigger = 0;

    allSales: Sale[] = [];
    filteredSales: Sale[] = [];
    searchQuery = '';
    loading = false;
    error = false;

    constructor(private salesApi: SalesApiService) { }

    ngOnInit(): void {
        this.loadSales();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
            this.loadSales();
        }
    }

    private loadSales(): void {
        this.loading = true;
        this.error = false;

        this.salesApi.getSales().subscribe({
            next: (sales) => {
                this.allSales = sales.sort((a, b) =>
                    new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
                ).slice(0, 50);
                this.filterSales();
                this.loading = false;
            },
            error: (error) => {
                console.error('Failed to load sales:', error);
                this.error = true;
                this.loading = false;
            }
        });
    }

    filterSales(): void {
        if (!this.searchQuery) {
            this.filteredSales = this.allSales;
            return;
        }

        const query = this.searchQuery.toLowerCase();
        this.filteredSales = this.allSales.filter(sale =>
            sale.productName.toLowerCase().includes(query) ||
            sale.category.toLowerCase().includes(query) ||
            sale.region.toLowerCase().includes(query) ||
            sale.salesRepresentative.toLowerCase().includes(query)
        );
    }

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

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}
