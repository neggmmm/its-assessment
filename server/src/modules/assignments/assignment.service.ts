import { Exam } from '../exams/exam.model.ts';
import { Question } from '../questions/question.model.ts';
import { Assignment } from './assignment.model.ts';

export class AssignmentService {
    async assignExam(examId: number, employeeId: number) {
        return Assignment.create({ examId, employeeId });
    }
    async getAllAssignments() {
        return Assignment.findAll();
    }

    async getAssignmentById(id: number) {
        return Assignment.findByPk(id, {
            include: [
                {
                    model: Exam,
                    include: [
                        {
                            model: Question,
                            as: 'questions',
                            through: { attributes: [] },
                        },
                    ],
                },
            ],
        });
    }

    async getEmployeeAssignments(employeeId: number) {
        return Assignment.findAll({
            where: { employeeId },
            include: [
                {
                    model: Exam,
                    include: [
                        {
                            model: Question,
                            as: 'questions',
                            through: { attributes: [] },
                        },
                    ],
                },
            ],
        });
    }

    async updateStatus(id: number, status: string) {
        const assignment = await Assignment.findByPk(id);
        if (!assignment) throw new Error('Assignment not found');

        await assignment.update({ status });
        return assignment;
    }
}
