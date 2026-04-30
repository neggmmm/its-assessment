import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionsAPI } from '../services/api';

interface Choice {
  id?: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  text: string;
  choices: Choice[];
  createdAt?: string;
}

const ListQuestions: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await questionsAPI.getAll();
      setQuestions(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionsAPI.delete(id);
        setQuestions(questions.filter((q) => q.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete question');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Questions</h2>
            <p className="mt-2 text-slate-600">Manage existing questions and add new ones.</p>
          </div>
          <button
            onClick={() => navigate('/admin/create-question')}
            className="rounded-3xl bg-blue-600 px-5 py-3 text-white font-semibold transition hover:bg-blue-700"
          >
            + Create Question
          </button>
        </div>

        {error && <div className="mt-4 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

        {loading ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-600">No questions found. Create one to get started!</div>
        ) : (
          <div className="mt-8 space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{question.text}</h3>
                    {question.createdAt && (
                      <p className="mt-2 text-sm text-slate-500">Created: {new Date(question.createdAt).toLocaleDateString()}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="rounded-3xl bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-700"
                  >
                    Delete
                  </button>
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

export default ListQuestions;
