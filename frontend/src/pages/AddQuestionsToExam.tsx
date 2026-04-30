import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { examsAPI, questionsAPI } from '../services/api';

interface Question {
  id: number;
  text: string;
  choices?: any[];
}

interface Exam {
  id: number;
  title: string;
  description: string;
}

const AddQuestionsToExam: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [exams, setExams] = useState<Exam[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(
    searchParams.get('examId') ? parseInt(searchParams.get('examId')!) : null
  );
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetchingQuestions, setFetchingQuestions] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExamId) {
      fetchQuestions();
    }
  }, [selectedExamId]);

  const fetchExams = async () => {
    try {
      const data = await examsAPI.getAll();
      setExams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exams');
    }
  };

  const fetchQuestions = async () => {
    try {
      setFetchingQuestions(true);
      const data = await questionsAPI.getAll();
      setQuestions(data);
      setSelectedQuestionIds([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    } finally {
      setFetchingQuestions(false);
    }
  };

  const handleQuestionToggle = (questionId: number) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedExamId) {
      setError('Please select an exam');
      return;
    }

    if (selectedQuestionIds.length === 0) {
      setError('Please select at least one question');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await examsAPI.addQuestions(selectedExamId, selectedQuestionIds);
      setSuccess('Questions added to exam successfully!');
      setSelectedQuestionIds([]);
      setTimeout(() => navigate('/admin/exams'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add questions to exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <h2 className="text-3xl font-semibold text-slate-900">Add Questions to Exam</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-2 text-sm font-medium text-slate-700">
            <label htmlFor="exam">Select Exam *</label>
            <select
              id="exam"
              value={selectedExamId || ''}
              onChange={(e) => setSelectedExamId(e.target.value ? parseInt(e.target.value) : null)}
              required
              className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">-- Select an exam --</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.title}
                </option>
              ))}
            </select>
          </div>

          {selectedExamId && (
            <div className="space-y-4">
              <div className="text-sm font-medium text-slate-700">Select Questions *</div>
              {fetchingQuestions ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-600">Loading questions...</div>
              ) : questions.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4 text-slate-600">No questions available</div>
              ) : (
                <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  {questions.map((question) => (
                    <label key={question.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-300">
                      <div className="flex items-center justify-between gap-3 text-sm font-medium text-slate-900">
                        <span>{question.text}</span>
                        <input
                          type="checkbox"
                          checked={selectedQuestionIds.includes(question.id)}
                          onChange={() => handleQuestionToggle(question.id)}
                          className="h-5 w-5 rounded border border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      {question.choices && (
                        <span className="text-xs text-slate-500">{question.choices.length} choices</span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
          {success && <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div>}

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <button
              type="submit"
              disabled={loading}
              className="rounded-3xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Adding...' : 'Add Questions'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/exams')}
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

export default AddQuestionsToExam;
