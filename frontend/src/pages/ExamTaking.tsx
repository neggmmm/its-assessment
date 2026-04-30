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
  answer: string;
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

  const handleAnswerSelect = (questionId: number, selectedChoice: string) => {
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

  const handleImageUpload = (
    questionId: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setAnswers((prev) => {
          const existing = prev.find((a) => a.questionId === questionId);
          if (existing) {
            return prev.map((a) =>
              a.questionId === questionId ? { ...a, evidence: base64 } : a
            );
          }
          return [...prev, { questionId, answer: '', evidence: base64 }];
        });
      };
      reader.readAsDataURL(file);
    }
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

    setSubmitting(true);
    setError('');

    try {
      await submissionsAPI.submit(parseInt(assignmentId), answers);
      // Redirect to assignments page
      setTimeout(() => navigate('/assignments'), 1500);
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

                  <div className="mt-5">
                    <textarea
                      value={questionAnswer?.answer ?? ''}
                      onChange={(e) => handleAnswerSelect(question.id, e.target.value)}
                      placeholder="Enter your answer"
                      rows={5}
                      className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="mt-5 space-y-3">
                    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                      Evidence (optional)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(question.id, e)}
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
      </div>
    </div>
  );
};

export default ExamTaking;
