import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import StatsCard from '../../components/common/StatsCard';
import RiskBadge from '../../components/common/RiskBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StudentForm from '../../components/forms/StudentForm';
import PredictionHistoryTable from '../../components/tables/PredictionHistoryTable';
import PerformanceChart from '../../components/charts/PerformanceChart';
import {
  TrendingUp,
  BookOpen,
  Calendar,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  User,
} from 'lucide-react';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [sessions, setSessions] = useState([]);

  // booking state (no dummy sessions)
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    sessionType: 'Academic',
    date: '',
    time: '',
    notes: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, profileRes, predictionsRes, sessionsRes] = await Promise.allSettled([
        api.get('/dashboard/student'),
        api.get('/students/profile'),
        api.get('/predictions/history?limit=5'),
        api.get('/sessions/student'),
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data.stats);
      }
      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value.data.student);
      }
      if (predictionsRes.status === 'fulfilled') {
        setPredictions(predictionsRes.value.data.predictions);
      }
      
      // Use sessions from dashboard if available, otherwise from sessions endpoint
      const dashboardSessions = statsRes.status === 'fulfilled' 
        ? statsRes.value.data.stats?.counselingSessions 
        : [];
      const sessionsEndpointData = sessionsRes.status === 'fulfilled'
        ? sessionsRes.value.data.sessions
        : [];
      
      setSessions(dashboardSessions?.length ? dashboardSessions : sessionsEndpointData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (formData) => {
    setFormLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/students/profile', formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleGeneratePrediction = async () => {
    try {
      await api.post('/predictions');
      setMessage({
        type: 'success',
        text: 'Prediction generated successfully!',
      });
      fetchData();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to generate prediction',
      });
    }
  };

  // 👉 sessions are expected from backend (no dummy)
  const upcomingSessions = sessions || stats?.counselingSessions || [];

  const handleBookSessionClick = () => {
    if (!stats?.mentor) {
      setMessage({
        type: 'error',
        text: 'No mentor assigned yet. Please contact your admin.',
      });
      return;
    }
    setShowBookingForm((prev) => !prev);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!bookingForm.date || !bookingForm.time) {
      setMessage({ type: 'error', text: 'Please pick a date and time.' });
      return;
    }

    try {
      await api.post('/sessions', {
        sessionType: bookingForm.sessionType,
        date: bookingForm.date,
        time: bookingForm.time,
        notes: bookingForm.notes,
      });

      setMessage({
        type: 'success',
        text: 'Your session request has been submitted to your mentor.',
      });
      setShowBookingForm(false);
      setBookingForm({
        sessionType: 'Academic',
        date: '',
        time: '',
        notes: '',
      });
      // Refresh sessions immediately
      try {
        const sessionsRes = await api.get('/sessions/student');
        setSessions(sessionsRes.data.sessions || []);
      } catch (err) {
        console.error('Error refreshing sessions:', err);
      }
      // Also refresh all data
      fetchData();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to book session',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  if (!stats?.profileComplete) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
            <div className="text-center py-10 px-4">
              <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Complete your profile
              </h2>
              <p className="text-slate-600 mb-6 text-sm">
                Please complete your student profile to start generating
                predictions.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
              >
                Complete profile now
              </button>
            </div>
          </div>

          {showForm && (
            <StudentForm
              initialData={profile}
              onSubmit={handleProfileUpdate}
              loading={formLoading}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">
            Student Dashboard
          </h1>
          <p className="text-slate-600 mt-1 text-sm">
            Monitor your academic progress and dropout risk
          </p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Current Risk Level"
            value={
              <RiskBadge
                riskLevel={stats.currentRisk}
                showScore
                score={stats.currentRiskScore}
              />
            }
            icon={AlertTriangle}
            color={
              stats.currentRisk === 'low'
                ? 'green'
                : stats.currentRisk === 'medium'
                ? 'yellow'
                : 'red'
            }
          />
          <StatsCard
            title="Current CGPA"
            value={stats.gpa?.toFixed(2) || 'N/A'}
            icon={TrendingUp}
            color="blue"
            subtext="Out of 10.0"
          />
          <StatsCard
            title="Attendance"
            value={`${stats.attendance || 0}%`}
            icon={Calendar}
            color="purple"
          />
          <StatsCard
            title="Total Predictions"
            value={stats.totalPredictions || 0}
            icon={BookOpen}
            color="gray"
          />
        </div>

        {/* Risk overview & mentor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Risk status overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-800 text-sm">
                  Current risk level
                </span>
                <RiskBadge riskLevel={stats.currentRisk} />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-800 text-sm">
                  Risk score
                </span>
                <span className="text-2xl font-semibold text-slate-900">
                  {stats.currentRiskScore}/100
                </span>
              </div>
              <button
                onClick={handleGeneratePrediction}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Generate new prediction</span>
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                {showForm ? 'Hide profile form' : 'Update profile'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Your mentor
            </h3>
            {stats.mentor ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {stats.mentor.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      {stats.mentor.email}
                    </p>
                    {stats.mentor.phone && (
                      <p className="text-sm text-slate-600">
                        {stats.mentor.phone}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Use the &quot;Book Session&quot; button below to request a
                  counseling session with your mentor.
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-600">No mentor assigned yet.</p>
            )}
          </div>
        </div>

        {/* Recommendations */}
        {stats.recommendations && stats.recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Recommendations
            </h3>
            <div className="space-y-3">
              {stats.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border text-sm ${
                    rec.priority === 'critical'
                      ? 'bg-red-50 border-red-200'
                      : rec.priority === 'high'
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white ${
                        rec.priority === 'critical'
                          ? 'bg-red-500'
                          : rec.priority === 'high'
                          ? 'bg-orange-500'
                          : 'bg-blue-500'
                      }`}
                    >
                      {rec.priority.toUpperCase()}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">
                        {rec.category}
                      </p>
                      <p className="text-slate-700 mt-1 text-sm">
                        {rec.suggestion}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Update Profile Form */}
        {showForm && (
          <div className="mb-8">
            <StudentForm
              initialData={profile}
              onSubmit={handleProfileUpdate}
              loading={formLoading}
            />
          </div>
        )}

        {/* Upcoming Counseling Sessions + Book Session */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Upcoming Counseling Sessions
            </h3>
            <button
              onClick={handleBookSessionClick}
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Session</span>
            </button>
          </div>

          {upcomingSessions.length === 0 ? (
            <p className="text-sm text-slate-500">
              No upcoming sessions scheduled yet.
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session._id || session.id}
                  className="border border-slate-100 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-50 rounded-full h-9 w-9 flex items-center justify-center mt-1">
                      <User className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {session.mentorId?.name || 'Mentor'}
                      </p>
                      <p className="text-xs text-slate-600 mb-1">
                        {session.mentorId?.email || ''}
                      </p>
                      <p className="text-xs text-slate-600">
                        {new Date(session.scheduledDate).toLocaleString()} • {session.topic}
                      </p>
                      {session.status === 'pending' && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 mt-1">
                          Pending Approval
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-slate-500">
                      {session.duration || 60} mins
                    </span>
                    {session.status === 'pending' && (
                      <span className="text-xs text-amber-600">Awaiting mentor approval</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Booking panel with mentor details */}
          {showBookingForm && stats.mentor && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">
                Book a Session with Your Mentor
              </h4>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 rounded-full h-9 w-9 flex items-center justify-center">
                    <User className="h-4 w-4 text-indigo-700" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {stats.mentor.name}
                    </p>
                    <p className="text-xs text-slate-600">
                      {stats.mentor.email}
                    </p>
                    {stats.mentor.phone && (
                      <p className="text-xs text-slate-600">
                        {stats.mentor.phone}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Your booking request will be sent to this mentor.
                </p>
              </div>

              <form
                onSubmit={handleBookingSubmit}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Session Type
                  </label>
                  <select
                    name="sessionType"
                    value={bookingForm.sessionType}
                    onChange={handleBookingChange}
                    className="input text-sm"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Career">Career</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={bookingForm.date}
                    onChange={handleBookingChange}
                    className="input text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={bookingForm.time}
                    onChange={handleBookingChange}
                    className="input text-sm"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Notes for your mentor (optional)
                  </label>
                  <textarea
                    name="notes"
                    value={bookingForm.notes}
                    onChange={handleBookingChange}
                    rows="2"
                    className="input text-sm"
                    placeholder="Briefly describe what you want to discuss..."
                  />
                </div>
                <div className="md:col-span-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Risk Factor Analysis */}
        {stats.latestPredictionFactors && (
          <div className="mb-8">
            <PerformanceChart factors={stats.latestPredictionFactors} />
          </div>
        )}

        {/* Prediction History */}
        {predictions.length > 0 && (
          <PredictionHistoryTable predictions={predictions} />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
