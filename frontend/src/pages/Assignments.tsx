import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignmentsAPI } from '../services/api';

interface Assignment {
  id: string;
  examId: string;
  status: string;
  // Add other assignment properties as needed
}

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const fetchAssignments = async () => {
    try {
      const data = await assignmentsAPI.getMyAssignments();
      setAssignments(data);
    } catch {
      setError('Failed to fetch assignments');
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []); 

  const handleStartExam = (id: string) => {
    navigate(`/exam/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold text-slate-900">My Assignments</h1>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 space-y-4">
          {assignments.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
              No assignments found.
            </div>
          ) : (
            assignments.map((assignment) => (
              <div key={assignment.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Exam ID</p>
                    <p className="text-lg font-medium text-slate-900">{assignment.examId}</p>
                    <p className="mt-2 text-sm text-slate-600">Status: <span className="font-medium text-slate-800">{assignment.status}</span></p>
                  </div>
                  <button
                    onClick={() => handleStartExam(assignment.id)}
                    className="rounded-2xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                  >
                    Start Exam
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignments;