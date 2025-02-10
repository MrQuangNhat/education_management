import attendanceService from "../services/attendanceService";

module.exports = {
    takeAttendance: async (req, res) => {
        try {
            const { class_id, attendance_list } = req.body;
            const result = await attendanceService.takeAttendance(class_id, attendance_list);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in takeAttendance:", error);
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    getAttendanceRecord: async (req, res) => {
        try {
            const { class_id } = req.body;
            const { id: studentId } = req.user; // Lấy ID sinh viên từ token (đã xác thực)

            // Gọi service để lấy lịch sử điểm danh
            const result = await attendanceService.getAttendanceRecord(class_id, studentId);

            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in getAttendanceRecord:", error);
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    setAttendanceStatus: async (req, res) => {
        try {
            const { attendance_id, student_id, class_id, status } = req.body;
            const { id: userId } = req.user; // Giảng viên đang yêu cầu cập nhật điểm danh

            // Gọi service để cập nhật trạng thái điểm danh
            const result = await attendanceService.setAttendanceStatus(attendance_id, student_id, class_id, status, userId);

            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in setAttendanceStatus:", error);
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    getAttendanceList: async (req, res) => {
        try {
            const { classId, date } = req.body;
            const result = await attendanceService.getAttendanceList(classId, date);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in getAttendanceList:", error);
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },
};
