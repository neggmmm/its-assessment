import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Exams from './pages/Exams';
import Questions from './pages/Questions';
import Assignments from './pages/Assignments';
import AdminDashboard from './pages/AdminDashboard';
import CreateExam from './pages/CreateExam';
import ListExams from './pages/ListExams';
import CreateQuestion from './pages/CreateQuestion';
import ListQuestions from './pages/ListQuestions';
import AddQuestionsToExam from './pages/AddQuestionsToExam';
import HRDashboard from './pages/HRDashboard';
import HRAssignments from './pages/HRAssignments';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ExamTaking from './pages/ExamTaking';

const App: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();

  // Redirect to appropriate dashboard based on role
  const getDashboardRedirect = () => {
    if (!isAuthenticated) return '/login';
    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'hr':
        return '/hr';
      case 'employee':
        return '/employee';
      default:
        return '/login';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={getDashboardRedirect()} replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to={getDashboardRedirect()} replace /> : <Register />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-exam"
          element={
            <ProtectedRoute requiredRole="admin">
              <CreateExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exams"
          element={
            <ProtectedRoute requiredRole="admin">
              <ListExams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-question"
          element={
            <ProtectedRoute requiredRole="admin">
              <CreateQuestion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <ProtectedRoute requiredRole="admin">
              <ListQuestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-questions-to-exam"
          element={
            <ProtectedRoute requiredRole="admin">
              <AddQuestionsToExam />
            </ProtectedRoute>
          }
        />

        {/* HR Routes */}
        <Route
          path="/hr"
          element={
            <ProtectedRoute requiredRole="hr">
              <HRDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/assignments"
          element={
            <ProtectedRoute requiredRole="hr">
              <HRAssignments />
            </ProtectedRoute>
          }
        />

        {/* Employee Routes */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* Shared Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exams"
          element={
            <ProtectedRoute>
              <Exams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions"
          element={
            <ProtectedRoute>
              <Questions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <Assignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam/:assignmentId"
          element={
            <ProtectedRoute>
              <ExamTaking />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to={getDashboardRedirect()} replace />} />
        <Route path="*" element={<Navigate to={getDashboardRedirect()} replace />} />
      </Routes>
    </div>
  );
};

export default App;
