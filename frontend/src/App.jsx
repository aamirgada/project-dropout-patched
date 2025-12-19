import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Home Page
import Home from "./pages/home";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";

// Mentor Pages
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorStudentDetails from "./pages/mentor/MentorStudentDetails";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";


// ===============
// Protected Route
// ===============
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Not allowed
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    if (user?.role === "mentor") return <Navigate to="/mentor" replace />;
    if (user?.role === "student") return <Navigate to="/student" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};


// ===============
// Public Route
// ===============
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) return <LoadingSpinner />;

  if (isAuthenticated) {
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    if (user?.role === "mentor") return <Navigate to="/mentor" replace />;
    if (user?.role === "student") return <Navigate to="/student" replace />;
  }

  return children;
};


// ===============
// App
// ===============
function App() {
  return (
    <Routes>

      {/* -------- Public -------- */}

      <Route
        path="/"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />


      {/* -------- Student -------- */}

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />


      {/* -------- Mentor -------- */}

      <Route
        path="/mentor"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <MentorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mentor/students/:id"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <MentorStudentDetails />
          </ProtectedRoute>
        }
      />


      {/* -------- Admin -------- */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <UserManagement />
          </ProtectedRoute>
        }
      />


      {/* -------- Fallback -------- */}

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;
