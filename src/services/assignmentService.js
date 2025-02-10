import db from "../models/index";

module.exports = {
    // Create a new assignment
    createAssignment: async (title, description, classId, teacherId, deadline) => {
        try {
            const assignment = await db.Assignment.create({
                title,
                description,
                classId,
                teacherId,
                deadline
            });
            return { code: 1000, message: "Assignment created successfully", data: assignment };
        } catch (error) {
            console.error("Error in createAssignment:", error);
            throw error;
        }
    },

    // Edit an assignment
    editAssignment: async (assignmentId, title, description, deadline) => {
        try {
            const assignment = await db.Assignment.findOne({ where: { id: assignmentId }, raw: false });
            if (!assignment) {
                return { code: 9992, message: "Assignment not found" };
            }

            assignment.title = title || assignment.title;
            assignment.description = description || assignment.description;
            assignment.deadline = deadline || assignment.deadline;

            await assignment.save();
            return { code: 1000, message: "Assignment updated successfully", data: assignment };
        } catch (error) {
            console.error("Error in editAssignment:", error);
            throw error;
        }
    },

    // Delete an assignment
    deleteAssignment: async (assignmentId) => {
        try {
            const assignment = await db.Assignment.findOne({ where: { id: assignmentId }, raw: false });
            if (!assignment) {
                return { code: 9992, message: "Assignment not found" };
            }

            await assignment.destroy();
            return { code: 1000, message: "Assignment deleted successfully" };
        } catch (error) {
            console.error("Error in deleteAssignment:", error);
            throw error;
        }
    },

    // Submit an assignment
    submitAssignment: async (assignmentId, studentId, submissionLink) => {
        try {
            const assignment = await db.Assignment.findOne({ where: { id: assignmentId } });
            if (!assignment) {
                return { code: 9992, message: "Assignment not found" };
            }

            const submission = await db.AssignmentSubmission.create({
                assignmentId,
                studentId,
                submissionLink,
                isSubmitted: true,
                submittedAt: new Date()
            });

            return { code: 1000, message: "Assignment submitted successfully", data: submission };
        } catch (error) {
            console.error("Error in submitAssignment:", error);
            throw error;
        }
    },

    // Grade an assignment
    gradeAssignment: async (assignmentId, studentId, grade, feedback) => {
        try {
            const submission = await db.AssignmentSubmission.findOne({ where: { assignmentId, studentId }, raw: false });
            if (!submission) {
                return { code: 9992, message: "Submission not found" };
            }

            submission.grade = grade;
            submission.feedback = feedback;
            await submission.save();

            return { code: 1000, message: "Assignment graded successfully", data: submission };
        } catch (error) {
            console.error("Error in gradeAssignment:", error);
            throw error;
        }
    },

    // Get assignment info
    getAssignmentInfo: async (assignmentId) => {
        try {
            const assignment = await db.Assignment.findOne({
                where: { id: assignmentId },
                raw: false,
                include: [
                    {
                        model: db.Teacher,
                        attributes: ['name', 'email']
                    },
                    {
                        model: db.Class,
                        attributes: ['name']
                    }
                ]
            });

            if (!assignment) {
                return { code: 9992, message: "Assignment not found" };
            }

            return { code: 1000, message: "OK", data: assignment };
        } catch (error) {
            console.error("Error in getAssignmentInfo:", error);
            throw error;
        }
    },

    // Get assignment list for a class
    getAssignmentList: async (classId) => {
        try {
            const assignments = await db.Assignment.findAll({
                where: { classId },
                raw: false,
                include: [
                    {
                        model: db.Teacher,
                        attributes: ['name']
                    },
                    {
                        model: db.Class,
                        attributes: ['name']
                    }
                ]
            });

            return { code: 1000, message: "OK", data: assignments };
        } catch (error) {
            console.error("Error in getAssignmentList:", error);
            throw error;
        }
    }
};
