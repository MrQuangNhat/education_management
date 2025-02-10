import classService from "../services/classService"

module.exports = {
    createClass: async (req, res) => {
        try {
            const { id, role } = req.user;
            if (role !== "0") {
                return res.status(403).json({ message: "Unauthorized. Only teachers can create classes" });
            }

            const result = await classService.createClass(id, req.body);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Edit Class
    editClass: async (req, res) => {
        try {
            const { id, role } = req.user;
            const { classId } = req.params;

            if (role !== "0") {
                return res.status(403).json({ code: 1003, message: "Access denied" });
            }

            const result = await classService.editClass(id, classId, req.body);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in editClass:', error);  // Log lỗi chi tiết
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Delete Class
    deleteClass: async (req, res) => {
        try {
            const { id, role } = req.user;
            const { classId } = req.params;

            if (role !== "0") {
                return res.status(403).json({ code: 1, message: "Unauthorized" });
            }

            const result = await classService.deleteClass(id, classId);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in deleteClass:', error);  // Log lỗi chi tiết
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Get Class Info
    getClassInfo: async (req, res) => {
        try {
            const { classId } = req.params;
            const result = await classService.getClassInfo(classId);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in getClassInfo:', error);  // Log lỗi chi tiết
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Get Class List
    getClassList: async (req, res) => {
        try {
            const { id, role } = req.user;
            if (role !== "0") {
                return res.status(403).json({ message: "Unauthorized" });
            }

            const result = await classService.getClassList(id);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in getClassList:', error);  // Log lỗi chi tiết
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },
};
