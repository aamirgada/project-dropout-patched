/**
 * Risk Calculation Engine for Student Dropout Prediction
 * Uses weighted scoring across multiple factors
 */

const calculateRiskScore = (studentData) => {
  let totalScore = 0;
  const factors = {
    academic: 0,
    behavioral: 0,
    social: 0,
    health: 0,
    support: 0
  };

  // ACADEMIC FACTORS (Weight: 30%)
  const gpaScore = (10 - studentData.gpa) * 10; // 0-100 for CGPA scale 0-10
  const attendanceScore = (100 - studentData.attendance); // 0-100
  factors.academic = (gpaScore * 0.6 + attendanceScore * 0.4);
  totalScore += factors.academic * 0.30;

  // BEHAVIORAL FACTORS (Weight: 20%)
  const disciplinaryScore = Math.min(studentData.disciplinaryActions * 20, 100);
  const extracurricularScore = Math.max(0, 100 - (studentData.extracurricularActivities * 20));
  factors.behavioral = (disciplinaryScore * 0.7 + extracurricularScore * 0.3);
  totalScore += factors.behavioral * 0.20;

  // SOCIAL & FAMILY FACTORS (Weight: 25%)
  const supportMap = { low: 100, medium: 50, high: 0 };
  const incomeMap = { low: 100, medium: 40, high: 0 };
  const workingHoursScore = Math.min(studentData.workingHours * 5, 100);
  
  factors.social = (
    supportMap[studentData.parentalSupport] * 0.4 +
    incomeMap[studentData.familyIncome] * 0.3 +
    workingHoursScore * 0.3
  );
  totalScore += factors.social * 0.25;

  // HEALTH FACTORS (Weight: 15%)
  const healthScore = studentData.healthIssues ? 70 : 0;
  const mentalHealthScore = studentData.mentalHealthSupport ? 0 : 40;
  factors.health = (healthScore * 0.6 + mentalHealthScore * 0.4);
  totalScore += factors.health * 0.15;

  // SUPPORT & ACCESS FACTORS (Weight: 10%)
  const studyHoursScore = Math.max(0, 100 - (studentData.studyHoursPerWeek * 5));
  const tutoringScore = Math.max(0, 100 - (studentData.tutoringHours * 10));
  const transportScore = studentData.transportationIssues ? 50 : 0;
  const internetScore = studentData.internetAccess ? 0 : 30;
  
  factors.support = (
    studyHoursScore * 0.3 +
    tutoringScore * 0.2 +
    transportScore * 0.25 +
    internetScore * 0.25
  );
  totalScore += factors.support * 0.10;

  // Normalize to 0-100
  totalScore = Math.min(100, Math.max(0, totalScore));

  return {
    riskScore: Math.round(totalScore),
    factors: {
      academic: Math.round(factors.academic),
      behavioral: Math.round(factors.behavioral),
      social: Math.round(factors.social),
      health: Math.round(factors.health),
      support: Math.round(factors.support)
    }
  };
};

const getRiskLevel = (riskScore) => {
  if (riskScore < 33) return 'low';
  if (riskScore < 67) return 'medium';
  return 'high';
};

const generateRecommendations = (studentData, riskScore, factors) => {
  const recommendations = [];

  // Academic recommendations
  if (factors.academic > 50) {
    if (studentData.gpa < 6.25) {
      recommendations.push({
        category: 'Academic',
        suggestion: 'Enroll in academic tutoring program to improve GPA',
        priority: 'high'
      });
    }
    if (studentData.attendance < 75) {
      recommendations.push({
        category: 'Academic',
        suggestion: 'Work with counselor on attendance improvement plan',
        priority: 'high'
      });
    }
  }

  // Behavioral recommendations
  if (factors.behavioral > 50) {
    if (studentData.disciplinaryActions > 2) {
      recommendations.push({
        category: 'Behavioral',
        suggestion: 'Schedule behavioral counseling sessions',
        priority: 'medium'
      });
    }
    if (studentData.extracurricularActivities === 0) {
      recommendations.push({
        category: 'Engagement',
        suggestion: 'Encourage participation in extracurricular activities',
        priority: 'medium'
      });
    }
  }

  // Social recommendations
  if (factors.social > 60) {
    if (studentData.parentalSupport === 'low') {
      recommendations.push({
        category: 'Family Support',
        suggestion: 'Connect family with support services and resources',
        priority: 'high'
      });
    }
    if (studentData.workingHours > 15) {
      recommendations.push({
        category: 'Work-Life Balance',
        suggestion: 'Discuss reducing work hours to focus on academics',
        priority: 'medium'
      });
    }
  }

  // Health recommendations
  if (factors.health > 40) {
    recommendations.push({
      category: 'Health & Wellbeing',
      suggestion: 'Provide access to health and mental health services',
      priority: 'high'
    });
  }

  // Support recommendations
  if (factors.support > 50) {
    if (studentData.studyHoursPerWeek < 10) {
      recommendations.push({
        category: 'Study Habits',
        suggestion: 'Develop structured study schedule with mentor',
        priority: 'medium'
      });
    }
    if (!studentData.internetAccess) {
      recommendations.push({
        category: 'Resources',
        suggestion: 'Arrange internet access through school programs',
        priority: 'high'
      });
    }
  }

  // General high-risk recommendation
  if (riskScore > 67) {
    recommendations.push({
      category: 'Urgent',
      suggestion: 'Schedule immediate intervention meeting with counselor and mentor',
      priority: 'critical'
    });
  }

  return recommendations;
};

module.exports = {
  calculateRiskScore,
  getRiskLevel,
  generateRecommendations
};