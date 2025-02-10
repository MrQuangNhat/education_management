import assignmentService from "../services/assignmentService";

module.exports = {
    // Create an assignment
    createAssignment: async (req, res) => {
        try {
            const { title, description, classId, deadline } = req.body;
            const { id: teacherId } = req.user; // Teacher's ID from token

            if (!title || !description || !classId || !deadline) {
                return res.status(400).json({ code: 1004, message: "Missing parameters" });
            }

            const result = await assignmentService.createAssignment(title, description, classId, teacherId, deadline);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Edit an assignment
    editAssignment: async (req, res) => {
        try {
            const { assignmentId, title, description, deadline } = req.body;

            const result = await assignmentService.editAssignment(assignmentId, title, description, deadline);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Delete an assignment
    deleteAssignment: async (req, res) => {
        try {
            const { assignmentId } = req.body;

            const result = await assignmentService.deleteAssignment(assignmentId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Submit an assignment
    submitAssignment: async (req, res) => {
        try {
            const { assignmentId, submissionLink } = req.body;
            const { id: studentId, role } = req.user; // Student's ID from token

            if (role !== "1") {
                return res.status(403).json({ code: 1003, message: "Access denied" });
            }

            const result = await assignmentService.submitAssignment(assignmentId, studentId, submissionLink);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Grade an assignment
    gradeAssignment: async (req, res) => {
        try {
            const { assignmentId, studentId, grade, feedback } = req.body;

            const result = await assignmentService.gradeAssignment(assignmentId, studentId, grade, feedback);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Get assignment info
    getAssignmentInfo: async (req, res) => {
        try {
            const { assignmentId } = req.params;

            const result = await assignmentService.getAssignmentInfo(assignmentId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Get assignment list for a class
    getAssignmentList: async (req, res) => {
        try {
            const { classId } = req.params;

            const result = await assignmentService.getAssignmentList(classId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    }
};
