import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const RiskDistributionChart = ({ data }) => {
  const chartData = [
    { name: 'Low Risk', value: data.low || 0, color: '#10b981' },
    { name: 'Medium Risk', value: data.medium || 0, color: '#f59e0b' },
    { name: 'High Risk', value: data.high || 0, color: '#ef4444' },
    { name: 'Unknown', value: data.unknown || 0, color: '#6b7280' }
  ].filter(item => item.value > 0);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskDistributionChart;