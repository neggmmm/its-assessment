import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionsAPI } from '../services/api';

const CreateQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [questionText, setQuestionText] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionText.trim()) {
      setError('Question text is required');
      return;
    }


    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const questionData = {
        text: questionText,
      };

      await questionsAPI.create(questionData);
      setSuccess('Question created successfully!');
      setQuestionText('');
      setTimeout(() => navigate('/admin/questions'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <h2 className="text-3xl font-semibold text-slate-900">Create New Question</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-2 text-sm font-medium text-slate-700">
            <label htmlFor="question">Question Text *</label>
            <textarea
              id="question"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter the question"
              rows={3}
              required
              className="min-h-[100px] rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>


          {error && <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
          {success && <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div>}

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <button
              type="submit"
              disabled={loading}
              className="rounded-3xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Creating...' : 'Create Question'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/questions')}
              className="rounded-3xl border border-slate-300 bg-white px-6 py-3 text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestion;
