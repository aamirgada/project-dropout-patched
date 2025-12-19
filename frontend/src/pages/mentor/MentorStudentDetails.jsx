import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import RiskBadge from '../../components/common/RiskBadge';
import {
  ArrowLeft,
  User,
  Mail,
  IdCard,
  Activity,
  TrendingUp,
  ShieldAlert,
  Calendar,
} from 'lucide-react';

const MentorStudentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;

  // If user refreshed or opened directly, state will be missing
  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <button
            onClick={() => navigate('/mentor')}
            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Mentor Dashboard
          </button>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-slate-700 text-sm">
              Student details are not available. Please go back to the mentor
              dashboard and open the student again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const attendance = student.attendance ?? 0;
  const gpa = student.gpa ?? 0;
  const riskScore = student.riskScore ?? 0;
  const riskLevel = student.riskLevel ?? 'unknown';
  const lastUpdated = student.lastUpdated
    ? new Date(student.lastUpdated).toLocaleString()
    : 'Not available';

  const gpaPercent = gpa ? Math.round((gpa / 10) * 100) : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/mentor')}
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Mentor Dashboard
        </button>

        {/* Top profile card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold">
              {student.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                {student.name}
              </h1>
              <div className="flex flex-wrap gap-2 mt-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <IdCard className="h-3 w-3" />
                  ID: {student.studentId || 'Not set'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Last updated: {lastUpdated}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <RiskBadge riskLevel={riskLevel} showScore score={riskScore} />
            <span className="text-xs text-slate-500">
              Overall dropout risk for this student
            </span>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-6 text-sm text-slate-700">
            <div className="inline-flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              <span>{student.name}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{student.email || 'Email not available'}</span>
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-blue-700">
                Attendance
              </span>
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-semibold text-blue-900">
              {attendance ? `${attendance}%` : 'Not set'}
            </div>
            <p className="text-[11px] text-blue-600 mt-1">
              Regular class presence
            </p>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-green-700">
                CGPA (0–10)
              </span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-semibold text-green-900">
              {gpa ? gpa.toFixed(2) : 'Not set'}
            </div>
            <p className="text-[11px] text-green-600 mt-1">
              {gpaPercent ? `${gpaPercent}% of maximum` : 'CGPA not recorded'}
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-rose-700">
                Risk Score
              </span>
              <ShieldAlert className="h-4 w-4 text-rose-500" />
            </div>
            <div className="text-2xl font-semibold text-rose-900">
              {riskScore}/100
            </div>
            <p className="text-[11px] text-rose-600 mt-1">
              Higher score indicates higher dropout risk
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-indigo-700">
                Sessions (Mentoring)
              </span>
              <Calendar className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-semibold text-indigo-900">
              0
            </div>
            <p className="text-[11px] text-indigo-600 mt-1">
              Track future mentoring sessions here
            </p>
          </div>
        </div>

        {/* Simple summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">
            Summary Notes
          </h2>
          <p className="text-sm text-slate-700">
            This view currently shows basic risk and performance indicators for
            the student. You can extend this page to show attendance trends,
            subject-wise marks, mentoring notes, and intervention history based
            on your project requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentorStudentDetails;
