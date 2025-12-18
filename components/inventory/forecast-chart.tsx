'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Legend,
} from 'recharts';
import type { ForecastDataPoint } from '@/types';

interface ForecastChartProps {
  data: ForecastDataPoint[];
  showConfidence?: boolean;
}

export function ForecastChart({ data, showConfidence = false }: ForecastChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          {showConfidence && (
            <Area
              type="monotone"
              dataKey="confidenceHigh"
              stroke="none"
              fill="url(#confidenceGradient)"
              fillOpacity={1}
              name="Intervalo Confianza"
            />
          )}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: '#22c55e', strokeWidth: 2 }}
            name="Real"
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#7C3AED"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#7C3AED', strokeWidth: 2 }}
            name="Predicción"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
