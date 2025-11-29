import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="dashboard-header">
      <div class="header-content">
        <div class="brand">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
            </svg>
          </div>
          <h1>Sales Track</h1>
        </div>
        <div class="header-actions">
          <!-- Logged In Actions -->
          <ng-container *ngIf="isAuthenticated">
            <span class="user-name">{{ userName }}</span>
            <button (click)="onRefreshClick()" class="btn-refresh" title="Refresh Data">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
              </svg>
              <span>Refresh</span>
            </button>
            <button (click)="onLogout()" class="btn-secondary">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
              </svg>
              <span>Logout</span>
            </button>
          </ng-container>
          
          <!-- Logged Out Actions -->
          <ng-container *ngIf="!isAuthenticated">
            <a routerLink="/login" class="btn-secondary">Login</a>
            <a routerLink="/register" class="btn-primary">Register</a>
          </ng-container>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() refresh = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get userName(): string {
    return this.authService.getCurrentUser()?.name || '';
  }

  onRefreshClick(): void {
    this.refresh.emit();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
