import React from 'react';

interface ChartDataPoint {
    month: string;
    amount?: number;
    count?: number;
}

interface SimpleChartProps {
    data: ChartDataPoint[];
    type: 'amount' | 'count';
    height?: number;
    color?: string;
}

export function SimpleChart({ data, type, height = 200, color = '#0d9488' }: SimpleChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                Tidak ada data
            </div>
        );
    }

    const values = data.map(item => type === 'amount' ? (item.amount || 0) : (item.count || 0));
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `${(amount / 1000000).toFixed(1)}M`;
        }
        if (amount >= 1000) {
            return `${(amount / 1000).toFixed(0)}K`;
        }
        return amount.toString();
    };

    const formatValue = (value: number) => {
        return type === 'amount' ? formatCurrency(value) : value.toString();
    };

    return (
        <div className="w-full" style={{ height }}>
            <div className="relative h-full flex items-end justify-between gap-1 px-2">
                {data.map((item, index) => {
                    const value = type === 'amount' ? (item.amount || 0) : (item.count || 0);
                    const percentage = range === 0 ? 50 : ((value - minValue) / range) * 80 + 10;
                    
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center group">
                            <div className="relative flex-1 flex items-end justify-center w-full">
                                <div
                                    className="w-full max-w-8 rounded-t transition-all duration-300 group-hover:opacity-80"
                                    style={{
                                        height: `${percentage}%`,
                                        backgroundColor: color,
                                        minHeight: '8px'
                                    }}
                                    title={`${item.month}: ${formatValue(value)}`}
                                />
                                <div className="absolute -top-8 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {formatValue(value)}
                                </div>
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 text-center rotate-45 origin-left transform">
                                {item.month}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}