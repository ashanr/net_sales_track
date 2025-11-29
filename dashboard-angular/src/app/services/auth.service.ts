import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = 'http://localhost:5158/api/auth';
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'current_user';

    private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) { }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(response => {
                this.setToken(response.token);
                this.setUser(response.user);
                this.currentUserSubject.next(response.user);
            })
        );
    }

    register(request: RegisterRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, request);
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getCurrentUser(): User | null {
        const userJson = localStorage.getItem(this.USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    private setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    private setUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
}
