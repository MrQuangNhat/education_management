import absenceRequestService from "../services/absenceRequestService";

module.exports = {
    requestAbsence: async (req, res) => {
        const { classId, date, reason } = req.body;
        const studentId = req.user.id;  // lấy studentId từ token đã được verify
        const result = await absenceRequestService.requestAbsence(classId, date, reason, studentId);
        return res.status(200).json(result);
    },

    reviewAbsenceRequest: async (req, res) => {
        const { requestId, status } = req.body;
        const teacherId = req.user.id;  // lấy teacherId từ token đã được verify
        const { role } = req.user;  // Lấy role từ token (đã check trong verifyToken)
        if (role !== "0") { // Kiểm tra nếu người dùng không phải là giảng viên
            return res.status(403).json({ code: 9995, message: "Lỗi phiên đăng nhập", role });
        }
        const result = await absenceRequestService.reviewAbsenceRequest(requestId, status, teacherId);
        return res.status(200).json(result);
    },

    getAbsenceRequests: async (req, res) => {
        const { classId, date } = req.query;  // Lấy classId và date từ query string
        const teacherId = req.user.id;  // lấy teacherId từ token đã được verify
        const { role } = req.user;  // Lấy role từ token (đã check trong verifyToken)

        if (role !== "0") { // Kiểm tra nếu người dùng không phải là giảng viên
            return res.status(403).json({ code: 9995, message: "Lỗi phiên đăng nhập", role });
        }
        const result = await absenceRequestService.getAbsenceRequests(classId, date, teacherId);
        return res.status(200).json(result);
    }
};
