export interface BitcoinPrice {
    usd: number;
    usd_24h_change: number;
    last_updated_at: number;
}

export interface BitcoinApiResponse {
    bitcoin: {
        usd: number;
        usd_24h_change: number;
        last_updated_at: number;
    };
}
