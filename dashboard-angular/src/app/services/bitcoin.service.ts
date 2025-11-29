import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap, startWith, catchError, of, map } from 'rxjs';
import { BitcoinPrice, BitcoinApiResponse } from '../models/bitcoin.model';

@Injectable({
    providedIn: 'root'
})
export class BitcoinService {
    private readonly apiUrl = 'https://api.coingecko.com/api/v3/simple/price';
    private readonly params = {
        ids: 'bitcoin',
        vs_currencies: 'usd',
        include_24hr_change: 'true',
        include_last_updated_at: 'true'
    };

    constructor(private http: HttpClient) { }

    getBitcoinPrice(): Observable<BitcoinPrice | null> {
        return this.http.get<BitcoinApiResponse>(this.apiUrl, { params: this.params }).pipe(
            map(response => ({
                usd: response.bitcoin.usd,
                usd_24h_change: response.bitcoin.usd_24h_change,
                last_updated_at: response.bitcoin.last_updated_at
            })),
            catchError(error => {
                console.error('Failed to fetch Bitcoin price:', error);
                return of(null);
            })
        );
    }

    getBitcoinPriceWithInterval(intervalMs: number = 60000): Observable<BitcoinPrice | null> {
        return interval(intervalMs).pipe(
            startWith(0),
            switchMap(() => this.getBitcoinPrice())
        );
    }
}
