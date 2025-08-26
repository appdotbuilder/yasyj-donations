import React from 'react';

interface PieChartDataPoint {
    membership_category: string;
    count: number;
    total_amount: string;
}

interface SimplePieChartProps {
    data: PieChartDataPoint[];
    height?: number;
}

const COLORS = ['#0d9488', '#059669', '#10b981', '#34d399'];

export function SimplePieChart({ data, height = 200 }: SimplePieChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                Tidak ada data
            </div>
        );
    }

    const total = data.reduce((sum, item) => sum + item.count, 0);
    let currentAngle = 0;

    const radius = 80;
    const centerX = 120;
    const centerY = 120;

    const createArcPath = (startAngle: number, endAngle: number) => {
        const start = {
            x: centerX + Math.cos(startAngle) * radius,
            y: centerY + Math.sin(startAngle) * radius
        };
        const end = {
            x: centerX + Math.cos(endAngle) * radius,
            y: centerY + Math.sin(endAngle) * radius
        };
        
        const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
        
        return `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
    };

    return (
        <div className="w-full flex items-center justify-center" style={{ height }}>
            <div className="flex items-center gap-8">
                <div className="relative">
                    <svg width="240" height="240" className="transform -rotate-90">
                        {data.map((item, index) => {
                            const percentage = item.count / total;
                            const angle = percentage * 2 * Math.PI;
                            const endAngle = currentAngle + angle;
                            
                            const path = createArcPath(currentAngle, endAngle);
                            const color = COLORS[index % COLORS.length];
                            
                            const result = (
                                <path
                                    key={item.membership_category}
                                    d={path}
                                    fill={color}
                                    stroke="white"
                                    strokeWidth="2"
                                    className="hover:opacity-80 transition-opacity"
                                />
                            );
                            
                            currentAngle = endAngle;
                            return result;
                        })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-800 dark:text-white">{total}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Total</div>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-3">
                    {data.map((item, index) => (
                        <div key={item.membership_category} className="flex items-center gap-3">
                            <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <div className="text-sm">
                                <div className="font-medium text-slate-800 dark:text-white">
                                    {item.membership_category}
                                </div>
                                <div className="text-slate-600 dark:text-slate-400">
                                    {item.count} donatur ({Math.round((item.count / total) * 100)}%)
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}