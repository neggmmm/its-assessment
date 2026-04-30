import React, { useState, useEffect } from 'react';
import { examsAPI } from '../services/api';

interface Exam {
  id: string;
  title: string;
  description: string;
  // Add other exam properties as needed
}

const Exams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchExams = async () => {
    try {
      const data = await examsAPI.getAll();
      setExams(data);
    } catch (err: unknown) {
      setError('Failed to fetch exams');
    }
  };

  useEffect(() => {
    fetchExams(); // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await examsAPI.create({ title, description });
      setTitle('');
      setDescription('');
      fetchExams();
    } catch (err: unknown) {
      setError('Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await examsAPI.delete(id);
        fetchExams();
      } catch (err: unknown) {
        setError('Failed to delete exam');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Exams</h1>
            <p className="mt-2 text-slate-600">Create new exams and manage the current list.</p>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleCreate} className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Create New Exam</h2>
          <div className="mt-6 grid gap-6">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Title
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[140px] rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-6 py-3 text-white font-semibold shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating...' : 'Create Exam'}
          </button>
        </form>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-900">Exam List</h2>
          <div className="mt-4 space-y-4">
            {exams.map((exam) => (
              <div key={exam.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{exam.title}</h3>
                    <p className="mt-2 text-slate-600">{exam.description}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="rounded-2xl bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exams;