import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RiskBadge from '../../components/common/RiskBadge';
import PerformanceChart from '../../components/charts/PerformanceChart';
import PredictionHistoryTable from '../../components/tables/PredictionHistoryTable';
import { ArrowLeft, User, Mail, Phone, Calendar, BookOpen, TrendingUp } from 'lucide-react';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      const response = await api.get(`/students/${id}`);
      setStudent(response.data.student);
      setPredictions(response.data.predictions || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student details:', error);
      setLoading(false);
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

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-8">
            <p className="text-gray-600">Student not found</p>
            <button
              onClick={() => navigate('/mentor')}
              className="btn btn-primary mt-4"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const latestPrediction = predictions[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/mentor')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Students</span>
        </button>

        {/* Student Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-600 p-4 rounded-full">
                <User className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{student.userId?.name}</h1>
                <p className="text-gray-600 mt-1">Student ID: {student.studentId}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-1" />
                    {student.userId?.email}
                  </span>
                  {student.userId?.phone && (
                    <span className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-1" />
                      {student.userId.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {latestPrediction && (
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-2">Current Risk Level</p>
                <RiskBadge 
                  riskLevel={latestPrediction.riskLevel} 
                  showScore 
                  score={latestPrediction.riskScore} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Academic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Grade</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{student.currentGrade}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">GPA</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{student.gpa.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{student.attendance}%</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Study Hours/Week</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{student.studyHoursPerWeek}</p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">GPA:</span>
                <span className="font-medium">{student.gpa.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Attendance:</span>
                <span className="font-medium">{student.attendance}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Study Hours/Week:</span>
                <span className="font-medium">{student.studyHoursPerWeek}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tutoring Hours/Week:</span>
                <span className="font-medium">{student.tutoringHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Disciplinary Actions:</span>
                <span className="font-medium">{student.disciplinaryActions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Extracurricular Activities:</span>
                <span className="font-medium">{student.extracurricularActivities}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Family & Support</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Parental Support:</span>
                <span className="font-medium capitalize">{student.parentalSupport}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Family Income:</span>
                <span className="font-medium capitalize">{student.familyIncome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Working Hours/Week:</span>
                <span className="font-medium">{student.workingHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Health Issues:</span>
                <span className="font-medium">{student.healthIssues ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mental Health Support:</span>
                <span className="font-medium">{student.mentalHealthSupport ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transportation Issues:</span>
                <span className="font-medium">{student.transportationIssues ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Internet Access:</span>
                <span className="font-medium">{student.internetAccess ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Factor Analysis */}
        {latestPrediction && latestPrediction.factors && (
          <div className="mb-8">
            <PerformanceChart factors={latestPrediction.factors} />
          </div>
        )}

        {/* Recommendations */}
        {latestPrediction && latestPrediction.recommendations && latestPrediction.recommendations.length > 0 && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-3">
              {latestPrediction.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    rec.priority === 'critical' ? 'bg-red-50 border-red-200' :
                    rec.priority === 'high' ? 'bg-orange-50 border-orange-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`badge ${
                      rec.priority === 'critical' ? 'bg-red-500' :
                      rec.priority === 'high' ? 'bg-orange-500' :
                      'bg-blue-500'
                    } text-white`}>
                      {rec.priority.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{rec.category}</p>
                      <p className="text-sm text-gray-700 mt-1">{rec.suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {student.notes && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
            <p className="text-gray-700">{student.notes}</p>
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

export default StudentDetails;