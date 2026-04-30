import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionsAPI } from '../services/api';

interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

const CreateQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [questionText, setQuestionText] = useState('');
  const [choices, setChoices] = useState<Choice[]>([
    { id: '1', text: '', isCorrect: false },
    { id: '2', text: '', isCorrect: false },
    { id: '3', text: '', isCorrect: false },
    { id: '4', text: '', isCorrect: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChoiceChange = (id: string, field: 'text' | 'isCorrect', value: any) => {
    setChoices(
      choices.map((choice) =>
        choice.id === id ? { ...choice, [field]: value } : choice
      )
    );
  };

  const handleAddChoice = () => {
    const newId = String(Math.max(...choices.map((c) => parseInt(c.id, 10))) + 1);
    setChoices([...choices, { id: newId, text: '', isCorrect: false }]);
  };

  const handleRemoveChoice = (id: string) => {
    if (choices.length > 2) {
      setChoices(choices.filter((c) => c.id !== id));
    } else {
      setError('At least 2 choices are required');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionText.trim()) {
      setError('Question text is required');
      return;
    }

    const filledChoices = choices.filter((c) => c.text.trim());
    if (filledChoices.length < 2) {
      setError('At least 2 choices are required');
      return;
    }

    const hasCorrectAnswer = filledChoices.some((c) => c.isCorrect);
    if (!hasCorrectAnswer) {
      setError('At least one choice must be marked as correct');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const questionData = {
        text: questionText,
        choices: filledChoices.map((c) => ({
          text: c.text,
          isCorrect: c.isCorrect,
        })),
      };

      await questionsAPI.create(questionData);
      setSuccess('Question created successfully!');
      setQuestionText('');
      setChoices([
        { id: '1', text: '', isCorrect: false },
        { id: '2', text: '', isCorrect: false },
        { id: '3', text: '', isCorrect: false },
        { id: '4', text: '', isCorrect: false },
      ]);
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

          <div className="space-y-4">
            <div className="text-sm font-medium text-slate-700">Multiple Choice Options *</div>
            <div className="space-y-4">
              {choices.map((choice, index) => (
                <div key={choice.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-semibold text-slate-900">Choice {index + 1}</span>
                    {choices.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveChoice(choice.id)}
                        className="rounded-2xl bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={choice.text}
                    onChange={(e) => handleChoiceChange(choice.id, 'text', e.target.value)}
                    placeholder={`Choice ${index + 1}`}
                    className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <label className="mt-4 inline-flex items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={choice.isCorrect}
                      onChange={(e) => handleChoiceChange(choice.id, 'isCorrect', e.target.checked)}
                      className="h-5 w-5 rounded border border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Mark as correct answer
                  </label>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddChoice}
              className="rounded-3xl bg-slate-100 px-5 py-3 text-slate-700 transition hover:bg-slate-200"
            >
              + Add Choice
            </button>
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
