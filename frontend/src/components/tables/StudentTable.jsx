import { Eye, Mail, Phone } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';
import { formatDate } from '../../utils/helpers';

const StudentTable = ({ students, onView, onBook, onDelete }) => {
  if (!students || students.length === 0) {
    return (
      <div className="card text-center py-8 text-gray-500">
        No students found
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 px-6 pt-6">Students</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GPA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              {(onView || onBook || onDelete) && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student._id || student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {student.userId?.name || student.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center space-x-2">
                      {student.userId?.email || student.email ? (
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {student.userId?.email || student.email}
                        </span>
                      ) : null}
                    </div>
                    {(student.userId?.phone || student.phone) && (
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {student.userId?.phone || student.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.studentId || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.currentGrade || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.gpa ? student.gpa.toFixed(2) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full ${
                          student.attendance >= 75
                            ? 'bg-green-500'
                            : student.attendance >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${student.attendance || 0}%` }}
                      />
                    </div>
                    <span>{student.attendance || 0}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RiskBadge 
                    riskLevel={student.latestRisk || student.riskLevel} 
                    showScore 
                    score={student.latestRiskScore || student.riskScore || 0} 
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.updatedAt ? formatDate(student.updatedAt) : 
                   student.lastUpdated ? formatDate(student.lastUpdated) : 'N/A'}
                </td>
              {(onView || onBook || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex flex-wrap gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(student)}
                        className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    )}
                    {onBook && (
                      <button
                        onClick={() => onBook(student)}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <span>Book</span>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(student)}
                        className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                      >
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </td>
              )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;