// API Configuration
const API_BASE_URL = 'http://localhost:5158/api';

// Chart.js global configuration
Chart.defaults.color = '#a8b2d1';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
Chart.defaults.font.family = "'Inter', sans-serif";

// State
let charts = {
    category: null,
    region: null,
    timeSeries: null
};

let allSales = [];

// ===== Utility Functions =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showError(message) {
    console.error(message);
    // You could add a toast notification here
}

// ===== API Functions =====
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        showError(`Failed to fetch data from ${endpoint}: ${error.message}`);
        throw error;
    }
}

async function loadMetrics(period, cardId) {
    try {
        const data = await fetchData(`/metrics/${period}`);
        updateMetricCard(cardId, data);
    } catch (error) {
        console.error(`Failed to load ${period} metrics:`, error);
    }
}

async function loadChartData() {
    try {
        const data = await fetchData('/visualization/charts');
        renderCategoryChart(data.salesByCategory);
        renderRegionChart(data.salesByRegion);
        renderTimeSeriesChart(data.salesOverTime);
    } catch (error) {
        console.error('Failed to load chart data:', error);
    }
}

async function loadSales() {
    const tableBody = document.getElementById('salesTableBody');
    const loadingEl = document.querySelector('.table-loading');
    const errorEl = document.querySelector('.table-error');
    
    try {
        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';
        
        const data = await fetchData('/sales');
        allSales = data;
        
        loadingEl.style.display = 'none';
        renderSalesTable(allSales);
    } catch (error) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        console.error('Failed to load sales:', error);
    }
}

// ===== Update Functions =====
function updateMetricCard(cardId, data) {
    const card = document.getElementById(cardId);
    if (!card) return;
    
    const revenueEl = card.querySelector('[data-target="revenue"]');
    const salesEl = card.querySelector('[data-target="sales"]');
    const quantityEl = card.querySelector('[data-target="quantity"]');
    const aovEl = card.querySelector('[data-target="aov"]');
    
    if (revenueEl) {
        animateValue(revenueEl, 0, data.totalRevenue, 1000, formatCurrency);
    }
    
    if (salesEl) {
        salesEl.textContent = `${formatNumber(data.totalSales)} sales`;
    }
    
    if (quantityEl) {
        quantityEl.textContent = `${formatNumber(data.totalQuantity)} units`;
    }
    
    if (aovEl) {
        animateValue(aovEl, 0, data.averageOrderValue, 1000, formatCurrency);
    }
}

function animateValue(element, start, end, duration, formatter = (val) => val) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * easeOutQuad(progress);
        element.textContent = formatter(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = formatter(end);
        }
    }
    
    requestAnimationFrame(update);
}

function easeOutQuad(t) {
    return t * (2 - t);
}

// ===== Chart Rendering Functions =====
function renderCategoryChart(data) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    if (charts.category) {
        charts.category.destroy();
    }
    
    const colors = [
        'rgba(102, 126, 234, 0.8)',
        'rgba(79, 172, 254, 0.8)',
        'rgba(240, 147, 251, 0.8)',
        'rgba(255, 167, 38, 0.8)',
        'rgba(118, 75, 162, 0.8)'
    ];
    
    charts.category = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(item => item.category),
            datasets: [{
                data: data.map(item => item.totalAmount),
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#0a0e1a'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(18, 24, 43, 0.9)',
                    padding: 12,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = formatCurrency(context.parsed);
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function renderRegionChart(data) {
    const ctx = document.getElementById('regionChart');
    if (!ctx) return;
    
    if (charts.region) {
        charts.region.destroy();
    }
    
    charts.region = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.region),
            datasets: [{
                label: 'Sales',
                data: data.map(item => item.totalAmount),
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(18, 24, 43, 0.9)',
                    padding: 12,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `Sales: ${formatCurrency(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function renderTimeSeriesChart(data) {
    const ctx = document.getElementById('timeSeriesChart');
    if (!ctx) return;
    
    if (charts.timeSeries) {
        charts.timeSeries.destroy();
    }
    
    // Sort data by date and take last 30 days
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-30);
    
    charts.timeSeries = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedData.map(item => formatDate(item.date)),
            datasets: [{
                label: 'Daily Sales',
                data: sortedData.map(item => item.totalAmount),
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: createGradient(ctx),
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(18, 24, 43, 0.9)',
                    padding: 12,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `Sales: ${formatCurrency(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

function createGradient(ctx) {
    const canvas = ctx.canvas;
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.4)');
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0)');
    return gradient;
}

// ===== Table Rendering =====
function renderSalesTable(sales) {
    const tableBody = document.getElementById('salesTableBody');
    if (!tableBody) return;
    
    // Take only the most recent 50 sales
    const recentSales = [...sales]
        .sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate))
        .slice(0, 50);
    
    tableBody.innerHTML = recentSales.map(sale => `
        <tr>
            <td>${formatDate(sale.saleDate)}</td>
            <td>${sale.productName}</td>
            <td>${sale.category}</td>
            <td>${sale.region}</td>
            <td>${sale.salesRepresentative}</td>
            <td>${formatNumber(sale.quantity)}</td>
            <td><strong>${formatCurrency(sale.amount)}</strong></td>
        </tr>
    `).join('');
}

// ===== Search Functionality =====
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (!query) {
            renderSalesTable(allSales);
            return;
        }
        
        const filtered = allSales.filter(sale => 
            sale.productName.toLowerCase().includes(query) ||
            sale.category.toLowerCase().includes(query) ||
            sale.region.toLowerCase().includes(query) ||
            sale.salesRepresentative.toLowerCase().includes(query)
        );
        
        renderSalesTable(filtered);
    });
}

// ===== Refresh Functionality =====
function setupRefresh() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (!refreshBtn) return;
    
    refreshBtn.addEventListener('click', async () => {
        refreshBtn.disabled = true;
        refreshBtn.style.opacity = '0.6';
        
        await loadAllData();
        
        refreshBtn.disabled = false;
        refreshBtn.style.opacity = '1';
    });
}

// ===== Load All Data =====
async function loadAllData() {
    try {
        await Promise.all([
            loadMetrics('today', 'todayMetrics'),
            loadMetrics('week', 'weekMetrics'),
            loadMetrics('month', 'monthMetrics'),
            loadChartData(),
            loadSales()
        ]);
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showError('Failed to load dashboard data. Please ensure the API is running.');
    }
}

// ===== Initialize Dashboard =====
async function initDashboard() {
    console.log('Initializing Sales Dashboard...');
    console.log('API Base URL:', API_BASE_URL);
    
    setupSearch();
    setupRefresh();
    
    // Load all data
    await loadAllData();
    
    console.log('Dashboard initialized successfully!');
}

// Start the dashboard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}
