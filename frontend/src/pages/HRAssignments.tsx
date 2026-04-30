import React, { useEffect, useState } from 'react';
import { assignmentsAPI, examsAPI, usersAPI } from '../services/api';

interface Exam {
  id: number;
  title: string;
  description?: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface Assignment {
  id: number;
  examId: number;
  employeeId: number;
  status: string;
}

const HRAssignments: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    setError('');
    try {
      const [examData, userData, assignmentData] = await Promise.all([
        examsAPI.getAll(),
        usersAPI.getAll(),
        assignmentsAPI.getAll(),
      ]);

      setExams(examData || []);
      setEmployees((userData || []).filter((user: Employee) => user.role === 'employee'));
      setAssignments(assignmentData || []);
    } catch (err) {
      setError('Failed to load HR assignment data.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAssignment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!selectedExam || !selectedEmployee) {
      setError('Please select both an exam and an employee.');
      return;
    }

    try {
      await assignmentsAPI.create({ examId: Number(selectedExam), employeeId: Number(selectedEmployee) });
      setMessage('Exam assigned successfully.');
      setSelectedExam('');
      setSelectedEmployee('');
      loadData();
    } catch (err) {
      setError('Failed to assign exam.');
    }
  };

  const handleStatusUpdate = async (assignmentId: number, status: string) => {
    setError('');
    setMessage('');

    try {
      await assignmentsAPI.updateStatus(String(assignmentId), status);
      setMessage('Assignment status updated.');
      loadData();
    } catch (err) {
      setError('Failed to update assignment status.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold text-slate-900">HR Assignment Management</h1>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Assign Exam to Employee</h2>
          <form onSubmit={handleCreateAssignment} className="mt-6 grid gap-4 max-w-xl">
            <label className="block text-sm font-medium text-slate-700">
              Select exam
              <select
                value={selectedExam}
                onChange={(event) => setSelectedExam(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select exam</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title || `Exam ${exam.id}`}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Select employee
              <select
                value={selectedEmployee}
                onChange={(event) => setSelectedEmployee(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.email})
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="mt-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm transition hover:bg-blue-700"
            >
              Assign Exam
            </button>
          </form>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-900">Assignments</h2>
          {assignments.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
              No assignments found.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
                >
                  <div className="grid gap-3 sm:grid-cols-2 sm:items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-500">Assignment ID</p>
                      <p className="text-lg font-medium text-slate-900">{assignment.id}</p>
                      <p className="text-sm text-slate-600">Exam ID: {assignment.examId}</p>
                      <p className="text-sm text-slate-600">Employee ID: {assignment.employeeId}</p>
                      <p className="text-sm text-slate-600">Status: <span className="font-medium text-slate-800">{assignment.status}</span></p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleStatusUpdate(assignment.id, 'accepted')}
                        disabled={assignment.status === 'accepted'}
                        className="rounded-2xl bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(assignment.id, 'rejected')}
                        disabled={assignment.status === 'rejected'}
                        className="rounded-2xl bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HRAssignments;
