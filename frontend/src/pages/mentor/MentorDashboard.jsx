import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import StatsCard from '../../components/common/StatsCard';
import RiskBadge from '../../components/common/RiskBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RiskDistributionChart from '../../components/charts/RiskDistributionChart';
import SessionBookingForm from '../../components/forms/SessionBookingForm';
import { AuthContext } from '../../context/AuthContext';
import { Users, TrendingUp, AlertTriangle, Download, Search, Filter, CheckCircle, X, Clock, Trash2, CalendarPlus } from 'lucide-react';

const MentorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sessions, setSessions] = useState([]);
  const [pendingSessions, setPendingSessions] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [approvingSession, setApprovingSession] = useState(null);
  const [approvalForm, setApprovalForm] = useState({
    date: '',
    time: '',
    duration: 60
  });
  const [bookingStudent, setBookingStudent] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, riskFilter, students]);

  const fetchData = async () => {
    try {
      const statsRes = await api.get('/dashboard/mentor');
      setStats(statsRes.data.stats);
      setStudents(statsRes.data.stats.students);
      setFilteredStudents(statsRes.data.stats.students);
      setSessions(statsRes.data.stats.sessions || []);
      setPendingSessions(statsRes.data.stats.pendingSessions || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleApproveSession = async (sessionId, useOriginalTime = false) => {
    try {
      let scheduledDate = null;
      
      if (useOriginalTime) {
        // Use original requested time
        const session = pendingSessions.find(s => s._id === sessionId);
        if (session) {
          scheduledDate = new Date(session.scheduledDate);
        }
      } else {
        // Use mentor's approved time
        scheduledDate = approvalForm.date && approvalForm.time 
          ? new Date(`${approvalForm.date}T${approvalForm.time}`)
          : null;
      }

      await api.put(`/sessions/${sessionId}/approve`, {
        scheduledDate: scheduledDate?.toISOString(),
        duration: approvalForm.duration || 60
      });

      setMessage({ type: 'success', text: 'Session approved successfully!' });
      setApprovingSession(null);
      setApprovalForm({ date: '', time: '', duration: 60 });
      fetchData();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to approve session'
      });
    }
  };

  const handleRejectSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to reject this session request?')) {
      return;
    }
    try {
      await api.put(`/sessions/${sessionId}/reject`);
      setMessage({ type: 'success', text: 'Session request rejected' });
      fetchData();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to reject session'
      });
    }
  };

  const handleDeleteStudent = async (student) => {
    if (!window.confirm('Delete this student and all related data?')) {
      return;
    }
    try {
      await api.delete(`/students/${student.id || student._id}`);
      setMessage({ type: 'success', text: 'Student deleted successfully' });
      fetchData();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete student',
      });
    }
  };

  const handleBookSession = async (formData) => {
    if (!bookingStudent) return;
    if (!user?.id) {
      setMessage({ type: 'error', text: 'Missing mentor account information' });
      return;
    }
    setBookingLoading(true);
    try {
      await api.post('/sessions/book', {
        ...formData,
        studentId: bookingStudent.id || bookingStudent._id,
        mentorId: user?.id,
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

  const filterStudents = () => {
    let filtered = [...students];

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (riskFilter !== 'all') {
      filtered = filtered.filter((student) => student.riskLevel === riskFilter);
    }

    setFilteredStudents(filtered);
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/predictions/export/csv', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `predictions_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  // pass the whole student object so details page can use it
  const handleViewStudent = (student) => {
    navigate(`/mentor/students/${student.id}`, {
      state: { student },
    });
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
            <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Monitor and support your assigned students
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={Users}
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
            value={
              stats?.avgGPA && stats.avgGPA > 0
                ? stats.avgGPA.toFixed(2)
                : 'Not set'
            }
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="Avg Attendance"
            value={
              stats?.avgAttendance && stats.avgAttendance > 0
                ? `${stats.avgAttendance.toFixed(1)}%`
                : 'Not set'
            }
            icon={Users}
            color="purple"
          />
        </div>

        {/* Risk Distribution Chart */}
        <div className="mb-8">
          <RiskDistributionChart data={stats?.riskDistribution || {}} />
        </div>

        {/* Message */}
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

        {/* Pending Session Approvals */}
        {pendingSessions.length > 0 && (
          <div className="card mb-8 border-l-4 border-amber-500">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Pending Session Approvals ({pendingSessions.length})
              </h3>
            </div>
            <div className="space-y-4">
              {pendingSessions.map((session) => (
                <div
                  key={session._id}
                  className="border border-amber-200 rounded-lg p-4 bg-amber-50"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {session.studentId?.name || 'Student'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {session.studentId?.email || ''} • ID: {session.studentId?.studentId || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p><span className="font-medium">Topic:</span> {session.topic}</p>
                        <p><span className="font-medium">Requested Date:</span> {new Date(session.scheduledDate).toLocaleString()}</p>
                        {session.notes && (
                          <p><span className="font-medium">Notes:</span> {session.notes}</p>
                        )}
                      </div>
                    </div>
                    {approvingSession === session._id ? (
                      <div className="md:w-80 space-y-3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Approved Date
                          </label>
                          <input
                            type="date"
                            value={approvalForm.date}
                            onChange={(e) => setApprovalForm({ ...approvalForm, date: e.target.value })}
                            className="input text-sm w-full"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Approved Time
                          </label>
                          <input
                            type="time"
                            value={approvalForm.time}
                            onChange={(e) => setApprovalForm({ ...approvalForm, time: e.target.value })}
                            className="input text-sm w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Duration (minutes)
                          </label>
                          <input
                            type="number"
                            value={approvalForm.duration}
                            onChange={(e) => setApprovalForm({ ...approvalForm, duration: parseInt(e.target.value) || 60 })}
                            className="input text-sm w-full"
                            min="15"
                            max="120"
                            step="15"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveSession(session._id, false)}
                              className="flex-1 btn btn-sm btn-primary flex items-center gap-1"
                              disabled={!approvalForm.date || !approvalForm.time}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve with New Time
                            </button>
                            <button
                              onClick={() => setApprovingSession(null)}
                              className="btn btn-sm btn-secondary"
                            >
                              Cancel
                            </button>
                          </div>
                          <button
                            onClick={() => handleApproveSession(session._id, true)}
                            className="w-full btn btn-sm bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve with Original Time
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setApprovingSession(session._id);
                            const sessionDate = new Date(session.scheduledDate);
                            setApprovalForm({
                              date: sessionDate.toISOString().split('T')[0],
                              time: sessionDate.toTimeString().slice(0, 5),
                              duration: session.duration || 60
                            });
                          }}
                          className="btn btn-sm btn-primary flex items-center gap-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectSession(session._id)}
                          className="btn btn-sm bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Sessions */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
            <span className="text-xs text-gray-500">
              Showing scheduled sessions for you
            </span>
          </div>
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-600">No upcoming sessions.</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session._id}
                  className="border border-gray-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {session.studentId?.name || 'Student'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {session.studentId?.email || ''}
                    </p>
                  </div>
                  <div className="text-sm text-gray-700">
                    {new Date(session.scheduledDate).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {session.topic} • {session.duration || 60} mins
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* High Risk Students Alert */}
        {stats?.highRiskStudents && stats.highRiskStudents.length > 0 && (
          <div className="card mb-8 border-l-4 border-red-500">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Students Requiring Immediate Attention
                </h3>
                <div className="space-y-2">
                  {stats.highRiskStudents.slice(0, 5).map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {student.studentId}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-semibold text-red-600">
                          Score: {student.riskScore}
                        </span>
                        <button
                          onClick={() => handleViewStudent(student)}
                          className="btn btn-sm btn-primary"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student List with Filters */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              All Students
            </h3>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="input pl-10 pr-8"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>
          </div>

          {/* Students Table */}
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
                    Risk Level
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
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className={
                        'hover:bg-gray-50 ' +
                        (student.riskLevel === 'high'
                          ? 'bg-red-50'
                          : student.riskLevel === 'medium'
                          ? 'bg-amber-50'
                          : student.riskLevel === 'low'
                          ? 'bg-emerald-50'
                          : '')
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RiskBadge
                          riskLevel={student.riskLevel}
                          showScore
                          score={student.riskScore}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.gpa && student.gpa > 0 ? (
                          student.gpa.toFixed(2)
                        ) : (
                          <span className="text-gray-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.attendance && student.attendance > 0 ? (
                          `${student.attendance}%`
                        ) : (
                          <span className="text-gray-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleViewStudent(student)}
                            className="text-primary-600 hover:text-primary-900 font-medium flex items-center gap-1"
                          >
                            <Users className="h-4 w-4" />
                            View
                          </button>
                          <button
                            onClick={() => setBookingStudent(student)}
                            className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1"
                          >
                            <CalendarPlus className="h-4 w-4" />
                            Book
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student)}
                            className="text-red-600 hover:text-red-900 font-medium flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {bookingStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="max-w-2xl w-full">
            <SessionBookingForm
              mentorId={user?.id}
              mentorName={user?.name || 'Assigned mentor'}
              onSubmit={handleBookSession}
              onCancel={() => setBookingStudent(null)}
              loading={bookingLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
