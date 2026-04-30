import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examsAPI } from '../services/api';

interface Exam {
  id: number;
  title: string;
  description: string;
  createdAt?: string;
}

const ListExams: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await examsAPI.getAll();
      setExams(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await examsAPI.delete(id);
        setExams(exams.filter((exam) => exam.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete exam');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Exams</h2>
            <p className="mt-2 text-slate-600">Browse your exam catalog and add questions.</p>
          </div>
          <button
            onClick={() => navigate('/admin/create-exam')}
            className="rounded-3xl bg-blue-600 px-5 py-3 text-white font-semibold transition hover:bg-blue-700"
          >
            + Create Exam
          </button>
        </div>

        {error && <div className="mt-4 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

        {loading ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-600">No exams found. Create one to get started!</div>
        ) : (
          <div className="mt-8 space-y-4">
            {exams.map((exam) => (
              <div key={exam.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{exam.title}</h3>
                    <p className="mt-2 text-slate-600">{exam.description}</p>
                    {exam.createdAt && (
                      <p className="mt-2 text-sm text-slate-500">Created: {new Date(exam.createdAt).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate(`/admin/add-questions-to-exam?examId=${exam.id}`)}
                      className="rounded-3xl bg-slate-100 px-4 py-2 text-slate-700 transition hover:bg-slate-200"
                    >
                      Add Questions
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="rounded-3xl bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate('/admin')}
            className="rounded-3xl border border-slate-300 bg-white px-6 py-3 text-slate-700 transition hover:bg-slate-100"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListExams;
