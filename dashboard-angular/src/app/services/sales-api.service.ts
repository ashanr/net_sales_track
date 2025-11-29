import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale, SalesMetrics, SalesChartData } from '../models/sales.model';

@Injectable({
    providedIn: 'root'
})
export class SalesApiService {
    private readonly apiUrl = 'http://localhost:5158/api';

    constructor(private http: HttpClient) { }

    getMetrics(period: 'today' | 'week' | 'month'): Observable<SalesMetrics> {
        return this.http.get<SalesMetrics>(`${this.apiUrl}/metrics/${period}`);
    }

    getChartData(): Observable<SalesChartData> {
        return this.http.get<SalesChartData>(`${this.apiUrl}/visualization/charts`);
    }

    getSales(): Observable<Sale[]> {
        return this.http.get<Sale[]>(`${this.apiUrl}/sales`);
    }
}
