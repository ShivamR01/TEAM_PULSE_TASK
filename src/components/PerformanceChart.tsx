import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Member } from '../redux/slices/membersSlice';

interface PerformanceChartProps {
  members: Member[];
}

export default function PerformanceChart({ members }: PerformanceChartProps) {
  // Prepare chart data
  const data = members.map(member => ({
    name: member.name,
    'Active Tasks': member.tasks.filter(t => !t.completed).length,
    'Completed Tasks': member.tasks.filter(t => t.completed).length,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Member Performance</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
          <Line type="monotone" dataKey="Active Tasks" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="Completed Tasks" stroke="#22c55e" strokeWidth={2} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
