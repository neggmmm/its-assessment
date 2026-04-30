import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <header className="mb-10 flex flex-col gap-4 rounded-3xl bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
            <p className="mt-2 text-slate-600">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-2xl bg-rose-600 px-5 py-3 text-white transition hover:bg-rose-700"
          >
            Logout
          </button>
        </header>

        <main className="grid gap-4 sm:grid-cols-3">
          <div
            onClick={() => navigate('/admin/exams')}
            className="cursor-pointer rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">📋 Manage Exams</h2>
            <p className="mt-2 text-slate-600">View, create, and manage exams</p>
          </div>

          <div
            onClick={() => navigate('/admin/questions')}
            className="cursor-pointer rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">❓ Manage Questions</h2>
            <p className="mt-2 text-slate-600">View, create, and manage questions</p>
          </div>

          <div
            onClick={() => navigate('/admin/add-questions-to-exam')}
            className="cursor-pointer rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">➕ Add Questions to Exam</h2>
            <p className="mt-2 text-slate-600">Add questions to existing exams</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
