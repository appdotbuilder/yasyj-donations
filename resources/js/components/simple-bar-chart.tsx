import React from 'react';

interface BarChartDataPoint {
    month: string;
    amount: number;
    count?: number;
}

interface SimpleBarChartProps {
    data: BarChartDataPoint[];
    height?: number;
    color?: string;
}

export function SimpleBarChart({ data, height = 200, color = '#0d9488' }: SimpleBarChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                Tidak ada data
            </div>
        );
    }

    const values = data.map(item => item.amount);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `Rp ${(amount / 1000000).toFixed(1)}M`;
        }
        if (amount >= 1000) {
            return `Rp ${(amount / 1000).toFixed(0)}K`;
        }
        return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    return (
        <div className="w-full" style={{ height }}>
            <div className="relative h-full flex items-end justify-between gap-2 px-4 pb-8">
                {data.map((item, index) => {
                    const percentage = range === 0 ? 50 : ((item.amount - minValue) / range) * 80 + 10;
                    
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center group max-w-16">
                            <div className="relative flex-1 flex items-end justify-center w-full">
                                <div
                                    className="w-full rounded-t transition-all duration-300 group-hover:opacity-80"
                                    style={{
                                        height: `${percentage}%`,
                                        backgroundColor: color,
                                        minHeight: '8px'
                                    }}
                                />
                                <div className="absolute -top-8 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    {formatCurrency(item.amount)}
                                </div>
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 text-center">
                                {item.month}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}