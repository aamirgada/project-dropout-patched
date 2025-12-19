import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

const StudentForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    gpa: "",
    attendance: "",
    disciplinaryActions: 0,
    extracurricularActivities: 0,
    parentalSupport: "medium",
    familyIncome: "medium",
    workingHours: 0,
    healthIssues: false,
    mentalHealthSupport: false,
    tutoringHours: 0,
    studyHoursPerWeek: "",
    transportationIssues: false,
    internetAccess: true,
    notes: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        studentId: initialData.studentId || "",
        gpa: initialData.gpa || "",
        attendance: initialData.attendance || "",
        disciplinaryActions: initialData.disciplinaryActions || 0,
        extracurricularActivities: initialData.extracurricularActivities || 0,
        parentalSupport: initialData.parentalSupport || "medium",
        familyIncome: initialData.familyIncome || "medium",
        workingHours: initialData.workingHours || 0,
        healthIssues: initialData.healthIssues || false,
        mentalHealthSupport: initialData.mentalHealthSupport || false,
        tutoringHours: initialData.tutoringHours || 0,
        studyHoursPerWeek: initialData.studyHoursPerWeek || "",
        transportationIssues: initialData.transportationIssues || false,
        internetAccess: initialData.internetAccess !== false,
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Academic Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <CheckCircle className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Academic Information
              </h3>
              <p className="text-xs text-slate-500">
                Key academic factors used by the AI model.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Student ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              required
              placeholder="e.g., STU12345678"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              CGPA (0.0 - 10.0) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              required
              placeholder="e.g., 8.5"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Attendance (0–100%) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              name="attendance"
              value={formData.attendance}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              required
              placeholder="e.g., 85"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Study Hours Per Week <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              name="studyHoursPerWeek"
              value={formData.studyHoursPerWeek}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              required
              placeholder="e.g., 20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Tutoring Hours Per Week
            </label>
            <input
              type="number"
              min="0"
              name="tutoringHours"
              value={formData.tutoringHours}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              placeholder="e.g., 2"
            />
          </div>
        </div>
      </div>

      {/* Behavioral Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <AlertCircle className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Behavioral Indicators
            </h3>
            <p className="text-xs text-slate-500">
              Engagement and discipline related information.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Disciplinary Actions
            </label>
            <input
              type="number"
              min="0"
              name="disciplinaryActions"
              value={formData.disciplinaryActions}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              placeholder="e.g., 0"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Extracurricular Activities
            </label>
            <input
              type="number"
              min="0"
              name="extracurricularActivities"
              value={formData.extracurricularActivities}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              placeholder="e.g., 2"
            />
          </div>
        </div>
      </div>

      {/* Family & Social Support */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <CheckCircle className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Family & Social Support
            </h3>
            <p className="text-xs text-slate-500">
              Family background and support indicators.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Parental Support <span className="text-rose-500">*</span>
            </label>
            <select
              name="parentalSupport"
              value={formData.parentalSupport}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Family Income Level <span className="text-rose-500">*</span>
            </label>
            <select
              name="familyIncome"
              value={formData.familyIncome}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Working Hours Per Week
            </label>
            <input
              type="number"
              min="0"
              name="workingHours"
              value={formData.workingHours}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              placeholder="e.g., 10"
            />
          </div>
        </div>
      </div>

      {/* Health & Wellbeing */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
            <AlertCircle className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Health & Wellbeing
            </h3>
            <p className="text-xs text-slate-500">
              Factors that may affect attendance or performance.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="healthIssues"
              checked={formData.healthIssues}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Student has health issues affecting attendance</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="mentalHealthSupport"
              checked={formData.mentalHealthSupport}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Student receives mental health support</span>
          </label>
        </div>
      </div>

      {/* Transportation & Access */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <CheckCircle className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Transportation & Access
            </h3>
            <p className="text-xs text-slate-500">
              Practical barriers to regular attendance and study.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="transportationIssues"
              checked={formData.transportationIssues}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Student has transportation issues</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="internetAccess"
              checked={formData.internetAccess}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Student has reliable internet access</span>
          </label>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">
          Additional Notes
        </h3>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
          placeholder="Any additional information about the student..."
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
