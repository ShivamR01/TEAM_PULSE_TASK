import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Status } from '../redux/slices/membersSlice';
import type { PieLabelRenderProps } from 'recharts';
import { useState, useEffect } from 'react';

interface StatusChartProps {
  statusCounts: Record<Status, number>;
}

const COLORS: Record<Status, string> = {
  Working: '#22c55e',
  Break: '#facc15',
  Meeting: '#3b82f6',
  Offline: '#6b7280',
};

export default function StatusChart({ statusCounts }: StatusChartProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const data = Object.entries(statusCounts).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h2>
      <ResponsiveContainer width="100%" height={isSmallScreen ? 300 : 430}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={isSmallScreen ? 30 : 50}
            outerRadius={isSmallScreen ? 60 : 90}
            paddingAngle={4}
            label={({ name, percent }: PieLabelRenderProps) => {
              const fontSize = isSmallScreen ? 10 : 14;
              return `${name} ${(percent! * 100).toFixed(0)}%`;
            }}
            labelLine={false} // cleaner look
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as Status]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name: string) => [`${value}`, name]} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
