import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import StatsCard from '../../components/common/StatsCard';
import RiskBadge from '../../components/common/RiskBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RiskDistributionChart from '../../components/charts/RiskDistributionChart';
import StudentTable from '../../components/tables/StudentTable';
import SessionBookingForm from '../../components/forms/SessionBookingForm';
import { Users, UserCheck, Shield, TrendingUp, AlertTriangle, Download } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [bookingStudent, setBookingStudent] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, studentsRes] = await Promise.all([
        api.get('/dashboard/admin'),
        api.get('/students'),
      ]);
      setStats(statsRes.data.stats);
      setStudents(studentsRes.data.students || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to load dashboard',
      });
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/predictions/export/csv', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `system_predictions_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const handleDeleteStudent = async (student) => {
    if (!window.confirm('Delete this student and all related data?')) {
      return;
    }
    try {
      await api.delete(`/students/${student._id || student.id}`);
      setMessage({ type: 'success', text: 'Student deleted successfully' });
      fetchData();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete student',
      });
    }
  };

  const handleBookStudentSession = async (formData) => {
    if (!bookingStudent) return;
    setBookingLoading(true);
    try {
      await api.post('/sessions/book', {
        ...formData,
        studentId: bookingStudent._id || bookingStudent.id,
        mentorId:
          bookingStudent.userId?.assignedMentor?._id ||
          bookingStudent.userId?.assignedMentor,
      });
      setMessage({ type: 'success', text: 'Session booked successfully' });
      setBookingStudent(null);
      fetchData();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to book session',
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">System-wide analytics and management</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Export All Data</span>
          </button>
        </div>

        {message.text && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Students"
            value={stats?.totalStudents || 0}
            icon={Users}
            color="green"
          />
          <StatsCard
            title="Mentors"
            value={stats?.totalMentors || 0}
            icon={UserCheck}
            color="purple"
          />
          <StatsCard
            title="Admins"
            value={stats?.totalAdmins || 0}
            icon={Shield}
            color="gray"
          />
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Predictions"
            value={stats?.totalPredictions || 0}
            icon={TrendingUp}
            color="blue"
          />
          <StatsCard
            title="High Risk Students"
            value={stats?.riskDistribution?.high || 0}
            icon={AlertTriangle}
            color="red"
          />
          <StatsCard
            title="Average GPA"
            value={stats?.avgGPA || 'N/A'}
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="Avg Attendance"
            value={`${stats?.avgAttendance || 0}%`}
            icon={Users}
            color="purple"
          />
        </div>

        {/* Risk Distribution Chart */}
        <div className="mb-8">
          <RiskDistributionChart data={stats?.riskDistribution || {}} />
        </div>

        {/* High Risk Students */}
        {stats?.highRiskStudents && stats.highRiskStudents.length > 0 && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              High Risk Students Requiring Attention
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Risk Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Risk Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.highRiskStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RiskBadge riskLevel={student.riskLevel} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                        {student.riskScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {stats?.recentActivity && stats.recentActivity.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Predictions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Risk Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Risk Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentActivity.map((activity) => (
                    <tr key={activity._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.userId?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.studentId?.studentId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RiskBadge riskLevel={activity.riskLevel} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.riskScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Student management */}
        <div className="mt-8">
          <StudentTable
            students={students}
            onBook={(student) => setBookingStudent(student)}
            onDelete={handleDeleteStudent}
          />
        </div>
      </div>

      {bookingStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="max-w-2xl w-full">
            <SessionBookingForm
              mentorId={
                bookingStudent.userId?.assignedMentor?._id ||
                bookingStudent.userId?.assignedMentor
              }
              mentorName={
                bookingStudent.userId?.assignedMentor?.name ||
                'Assigned mentor'
              }
              onSubmit={handleBookStudentSession}
              onCancel={() => setBookingStudent(null)}
              loading={bookingLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;