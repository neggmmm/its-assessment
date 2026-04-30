import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assignmentsAPI, submissionsAPI } from '../services/api';

interface Question {
  id: number;
  text: string;
}

interface Exam {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

interface Answer {
  questionId: number;
  answer: 'yes' | 'no' | 'partial';
  evidence?: string; // Base64 encoded image
}

const ExamTaking: React.FC = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  useEffect(() => {
    fetchExam();
  }, []);

  const fetchExam = async () => {
    try {
      setLoading(true);
      if (!assignmentId) {
        throw new Error('Assignment ID not found');
      }
      const assignment = await assignmentsAPI.getById(Number(assignmentId));
      if (!assignment || !assignment.Exam) {
        throw new Error('Exam not found for this assignment');
      }

      const examData: Exam = {
        id: assignment.Exam.id,
        title: assignment.Exam.title,
        description: assignment.Exam.description,
        questions: assignment.Exam.questions || [],
      };

      setExam(examData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, selectedChoice: 'yes' | 'no' | 'partial') => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, answer: selectedChoice } : a
        );
      }
      return [...prev, { questionId, answer: selectedChoice }];
    });
  };

  const calculateScore = (answers: Answer[]): number => {
    const totalPoints = answers.reduce((sum, answer) => {
      switch (answer.answer) {
        case 'yes':
          return sum + 2;
        case 'partial':
          return sum + 1;
        case 'no':
          return sum + 0;
        default:
          return sum;
      }
    }, 0);

    // Scale to out of 5: max points = questions.length * 2, so divide by 2
    const maxPoints = answers.length * 2;
    return maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 5 * 10) / 10 : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignmentId) {
      setError('Assignment ID not found');
      return;
    }

    // Validate that all questions have answers
    const unansweredQuestions = exam?.questions.filter(
      (q) => !answers.find((a) => a.questionId === q.id)
    );

    if (unansweredQuestions && unansweredQuestions.length > 0) {
      setError('Please answer all questions before submitting');
      return;
    }

    const invalidAnswer = answers.some(
      (a) => !['yes', 'partial', 'no'].includes(a.answer)
    );

    if (invalidAnswer) {
      setError('Please select only yes, partial, or no for each question');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await submissionsAPI.submit(parseInt(assignmentId), answers);
      const score = calculateScore(answers);
      setFinalScore(score);
      // Don't redirect immediately, show the score
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
        <div className="rounded-3xl bg-white px-8 py-6 shadow-xl ring-1 ring-slate-200">Loading exam...</div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
        <div className="rounded-3xl bg-white px-8 py-6 shadow-xl ring-1 ring-slate-200 text-slate-800">
          {error || 'Failed to load exam'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="mb-8 rounded-3xl bg-slate-50 p-6">
          <h1 className="text-3xl font-semibold text-slate-900">{exam.title}</h1>
          <p className="mt-3 text-slate-600">{exam.description}</p>
          <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            Question 1 of {exam.questions.length}
          </div>
        </div>

        {finalScore === null && (
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {exam.questions.map((question, qIndex) => {
              const questionAnswer = answers.find((a) => a.questionId === question.id);
              return (
                <div key={question.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <div className="text-sm text-slate-500">Question {qIndex + 1}</div>
                      <h3 className="mt-2 text-xl font-semibold text-slate-900">{question.text}</h3>
                    </div>
                    <div className="text-sm font-medium text-slate-700">
                      {questionAnswer?.answer ? 'Answered' : 'Pending'}
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="text-sm font-medium text-slate-700">Select an answer</div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {(['yes', 'partial', 'no'] as const).map((option) => (
                        <label
                          key={option}
                          className={`rounded-3xl border px-4 py-4 text-center transition ${
                            questionAnswer?.answer === option
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-slate-200 bg-white text-slate-900'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`answer-${question.id}`}
                            value={option}
                            checked={questionAnswer?.answer === option}
                            onChange={() => handleAnswerSelect(question.id, option)}
                            className="sr-only"
                          />
                          <span className="block text-lg font-semibold capitalize">{option}</span>
                          <span className="mt-1 block text-sm text-slate-500">
                            {option === 'yes' ? 'Score 2' : option === 'partial' ? 'Score 1' : 'Score 0'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                      Evidence (optional)
                      <input
                        type="file"
                        accept="image/*"
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none"
                      />
                    </label>
                    {questionAnswer?.evidence && (
                      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4">
                        <img src={questionAnswer.evidence} alt="Evidence" className="max-h-64 w-full rounded-2xl object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setAnswers((prev) =>
                              prev.map((a) =>
                                a.questionId === question.id
                                  ? { ...a, evidence: undefined }
                                  : a
                              )
                            );
                          }}
                          className="w-fit rounded-2xl bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-700"
                        >
                          Remove evidence
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {error && <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-3xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Submitting...' : 'Submit Exam'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/assignments')}
              className="rounded-3xl border border-slate-300 bg-white px-6 py-3 text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
        )}

        {finalScore !== null && (
          <div className="mt-8 rounded-3xl bg-emerald-50 p-8 text-center shadow-xl ring-1 ring-emerald-200">
            <div className="text-4xl font-bold text-emerald-700 mb-4">
              Your Score: {finalScore}/5
            </div>
            <p className="text-lg text-emerald-600 mb-6">
              Exam submitted successfully!
            </p>
            <button
              onClick={() => navigate('/assignments')}
              className="rounded-3xl bg-emerald-600 px-6 py-3 text-white font-semibold shadow-sm transition hover:bg-emerald-700"
            >
              Back to Assignments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamTaking;
