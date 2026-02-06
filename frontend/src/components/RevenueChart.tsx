'use client';

import { motion } from 'framer-motion';

interface ChartPoint {
    label: string;
    value: number;
}

interface RevenueChartProps {
    data: ChartPoint[];
    height?: number;
}

export default function RevenueChart({ data, height = 200 }: RevenueChartProps) {
    if (!data.length) return null;

    const maxValue = Math.max(...data.map(d => d.value), 100);
    const chartPadding = 40;
    const chartWidth = 800;
    const chartHeight = height;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (chartWidth - chartPadding * 2) + chartPadding;
        const y = chartHeight - ((d.value / maxValue) * (chartHeight - chartPadding)) - chartPadding / 2;
        return { x, y };
    });

    const pathData = `M ${points[0].x} ${points[0].y} ` +
        points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

    const areaData = pathData + ` L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

    return (
        <div className="w-full bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 glass-effect">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary/60 italic">Rendimiento Mensual</h3>
                <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span>Ingresos</span>
                    </div>
                </div>
            </div>

            <div className="relative h-[200px] w-full">
                <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                >
                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
                        <line
                            key={i}
                            x1={chartPadding}
                            y1={chartHeight - (v * (chartHeight - chartPadding)) - chartPadding / 2}
                            x2={chartWidth - chartPadding}
                            y2={chartHeight - (v * (chartHeight - chartPadding)) - chartPadding / 2}
                            stroke="currentColor"
                            className="text-primary/5"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Simple Y Axis Labels */}
                    <text x="0" y={chartPadding / 2} className="text-[10px] fill-primary/40 font-bold uppercase tracking-tighter">
                        ${maxValue}
                    </text>
                    <text x="0" y={chartHeight - chartPadding / 2} className="text-[10px] fill-primary/40 font-bold uppercase tracking-tighter">
                        $0
                    </text>

                    {/* Area Gradient */}
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    <path
                        d={areaData}
                        fill="url(#chartGradient)"
                    />

                    {/* Line Path */}
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        d={pathData}
                        fill="none"
                        stroke="currentColor"
                        className="text-primary"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Points */}
                    {points.map((p, i) => (
                        <circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r="4"
                            className="fill-background stroke-primary stroke-[2]"
                        />
                    ))}
                </svg>
            </div>

            <div className="flex justify-between mt-4 px-10">
                {data.map((d, i) => (
                    <span key={i} className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground opacity-50 italic">
                        {d.label}
                    </span>
                ))}
            </div>
        </div>
    );
}
