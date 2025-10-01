import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Status } from '../redux/slices/membersSlice';
import type { PieLabelRenderProps } from 'recharts';

interface StatusChartProps {
  statusCounts: Record<Status, number>;
}

const COLORS: Record<Status, string> = {
  Working: '#22c55e', // green
  Break: '#facc15',   // yellow
  Meeting: '#3b82f6', // blue
  Offline: '#6b7280', // gray
};

export default function StatusChart({ statusCounts }: StatusChartProps) {
  const data = Object.entries(statusCounts).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50} // Donut chart
            outerRadius={90}
            paddingAngle={4} // Spacing between slices
            label={({ name, percent }: PieLabelRenderProps) => 
              `${name} ${(percent! * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as Status]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string) => [`${value}`, name]} 
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
