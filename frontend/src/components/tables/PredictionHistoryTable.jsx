import { formatDateTime } from '../../utils/helpers';
import RiskBadge from '../common/RiskBadge';
import { Eye } from 'lucide-react';

const PredictionHistoryTable = ({ predictions, onView }) => {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="card text-center py-8 text-gray-500">
        No prediction history available
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GPA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {predictions.map((prediction) => (
              <tr key={prediction._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDateTime(prediction.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RiskBadge riskLevel={prediction.riskLevel} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {prediction.riskScore}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {prediction.studentId?.gpa || prediction.inputData?.gpa || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {prediction.studentId?.attendance || prediction.inputData?.attendance || 'N/A'}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {onView && (
                    <button
                      onClick={() => onView(prediction)}
                      className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionHistoryTable;