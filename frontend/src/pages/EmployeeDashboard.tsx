import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <header className="mb-10 flex flex-col gap-4 rounded-3xl bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Employee Dashboard</h1>
            <p className="mt-2 text-slate-600">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-2xl bg-rose-600 px-5 py-3 text-white transition hover:bg-rose-700"
          >
            Logout
          </button>
        </header>

        <main className="grid gap-4 sm:grid-cols-2">
          <div
            onClick={() => navigate('/assignments')}
            className="cursor-pointer rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">📋 My Assignments</h2>
            <p className="mt-2 text-slate-600">View your assigned exams and submissions</p>
          </div>

          <div
            onClick={() => navigate('/exams')}
            className="cursor-pointer rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">📝 Exams</h2>
            <p className="mt-2 text-slate-600">Take available exams</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
