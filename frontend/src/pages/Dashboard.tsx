import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-slate-600">Welcome, {user?.email}!</p>
          </div>
          <button
            onClick={logout}
            className="rounded-2xl bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link to="/exams" className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-blue-600 transition hover:border-blue-200 hover:bg-blue-50">
            Manage Exams
          </Link>
          <Link to="/questions" className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-blue-600 transition hover:border-blue-200 hover:bg-blue-50">
            Manage Questions
          </Link>
          <Link to="/assignments" className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-blue-600 transition hover:border-blue-200 hover:bg-blue-50">
            My Assignments
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;