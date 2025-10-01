import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Member } from '../redux/slices/membersSlice';
import { useState, useEffect } from 'react';

interface PerformanceChartProps {
  members: Member[];
}

export default function PerformanceChart({ members }: PerformanceChartProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const data = members.map(member => {
    const completed = member.tasks.filter(t => t.taskStatus === 'completed').length;
    const inProgress = member.tasks.filter(t => t.taskStatus === 'in-progress').length;
    const pending = member.tasks.filter(t => t.taskStatus === 'pending').length;

    return {
      name: member.name,
      Completed: completed,
      'In Progress': inProgress,
      Pending: pending,
    };
  });

  const colors = {
    Completed: '#22c55e',
    'In Progress': '#3b82f6',
    Pending: '#f59e0b',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Member Performance</h2>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={!isSmallScreen ? { fontSize: 14, fill: '#4b5563', fontWeight: 500 } : false}
            interval={0}
            angle={!isSmallScreen ? -45 : 0}
            textAnchor={!isSmallScreen ? 'end' : 'middle'}
            height={!isSmallScreen ? 80 : 20}
          />
          <YAxis
            tick={{ fontSize: 14, fill: '#4b5563', fontWeight: 500 }}
            allowDecimals={false}
            padding={{ top: 40, bottom: 10 }} // <-- This adds vertical space above/below lines
          />
          <Tooltip
            formatter={(value, name) => [value, name]}
            labelFormatter={(label) => `Member: ${label}`}
          />
          <Legend verticalAlign="top" height={60} />
          {Object.keys(colors).map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[key]}
              strokeWidth={3}
              activeDot={{ r: 8 }}
              dot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
