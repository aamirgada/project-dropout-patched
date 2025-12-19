import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PerformanceChart = ({ factors }) => {
  const chartData = [
    { name: 'Academic', value: factors.academic || 0 },
    { name: 'Behavioral', value: factors.behavioral || 0 },
    { name: 'Social', value: factors.social || 0 },
    { name: 'Health', value: factors.health || 0 },
    { name: 'Support', value: factors.support || 0 }
  ];

  const getColor = (value) => {
    if (value < 33) return '#10b981';
    if (value < 67) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factor Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;