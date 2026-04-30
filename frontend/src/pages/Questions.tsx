import React, { useState, useEffect } from 'react';
import { questionsAPI } from '../services/api';

interface Question {
  id: string;
  text: string;
  type: string;
}

const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [text, setText] = useState('');
  const [type, setType] = useState('multiple-choice');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQuestions = async () => {
    try {
      const data = await questionsAPI.getAll();
      setQuestions(data);
    } catch (err: unknown) {
      setError('Failed to fetch questions');
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await questionsAPI.create({ text, type });
      setText('');
      setType('multiple-choice');
      fetchQuestions();
    } catch (err: unknown) {
      setError('Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionsAPI.delete(id);
        fetchQuestions();
      } catch (err: unknown) {
        setError('Failed to delete question');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Questions</h1>
            <p className="mt-2 text-slate-600">Create and manage question entries.</p>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleCreate} className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Create New Question</h2>
          <div className="mt-6 grid gap-6">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Question Text
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                className="min-h-[120px] rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Type
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="short-answer">Short Answer</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-6 py-3 text-white font-semibold shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating...' : 'Create Question'}
          </button>
        </form>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-900">Question List</h2>
          <div className="mt-4 space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{question.text}</p>
                    <p className="text-sm text-slate-600">Type: {question.type}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(question.id)}
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

export default Questions;