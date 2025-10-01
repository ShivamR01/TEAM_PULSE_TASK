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

  // Prepare chart data
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

  // Determine max Y-axis value
  const maxValue = Math.max(
    ...data.map(d => Math.max(d.Completed, d['In Progress'], d.Pending))
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4">Member Performance</h2>
      <ResponsiveContainer width="100%" height={isSmallScreen ? 300 : 450}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 10,
            left: isSmallScreen ? 0 : 10, // reduced left padding on small screens
            bottom: isSmallScreen ? 30 : 60,
          }}
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
            tick={{ fontSize: isSmallScreen ? 10 : 14, fill: '#4b5563', fontWeight: 500 }}
            allowDecimals={false}
            domain={[0, maxValue + 1]} // add space above max value
            tickCount={isSmallScreen ? 3 : undefined} // fewer ticks on small screens
            padding={{ top: 20, bottom: 10 }}
          />
          <Tooltip
            formatter={(value, name) => [value, name]}
            labelFormatter={(label) => `Member: ${label}`}
          />
          <Legend
            verticalAlign="top"
            height={isSmallScreen ? 50 : 60}
            wrapperStyle={{ paddingBottom: isSmallScreen ? 10 : 0 }}
          />
          {Object.keys(colors).map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[key]}
              strokeWidth={3}
              activeDot={{ r: isSmallScreen ? 5 : 8 }}
              dot={{ r: isSmallScreen ? 3 : 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
