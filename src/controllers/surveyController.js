import surveyService from "../services/surveyService";

module.exports = {
    // Create survey
    createSurvey: async (req, res) => {
        try {
            const { title, description, file, deadline } = req.body;
            const { role } = req.user;  // Lấy role từ token (đã check trong verifyToken)

            if (role !== "0") { // Kiểm tra nếu người dùng không phải là giảng viên
                return res.status(403).json({ code: 9995, message: "Lỗi phiên đăng nhập", role });
            }

            if (!title || !description || !deadline) {
                return res.status(400).json({ code: 1004, message: "Thiếu tham số trong yêu cầu" });
            }

            const result = await surveyService.createSurvey(title, description, file, deadline);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in createSurvey:", error);
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Chỉnh sửa khảo sát
    editSurvey: async (req, res) => {
        try {
            const { survey_id, description, file, deadline } = req.body;
            const { role } = req.user;
            // Lấy role từ token (đã check trong verifyToken)

            if (role !== "0") { // Nếu không phải giảng viên
                return res.status(403).json({ code: 9995, message: "Lỗi phiên đăng nhập", role });
            }

            if (!survey_id) {
                return res.status(400).json({ code: 1004, message: "Thiếu tham số survey_id" });
            }

            const result = await surveyService.editSurvey(survey_id, description, file, deadline);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Xóa khảo sát
    deleteSurvey: async (req, res) => {
        try {
            const { survey_id } = req.body;
            const { role } = req.user; // Lấy role từ token (đã check trong verifyToken)

            if (role !== "0") { // Nếu không phải giảng viên
                return res.status(403).json({ code: 9995, message: "Lỗi phiên đăng nhập" });
            }

            if (!survey_id) {
                return res.status(400).json({ code: 1004, message: "Thiếu tham số survey_id" });
            }

            const result = await surveyService.deleteSurvey(survey_id);
            return res.status(200).json(result);
        } catch (error) {
            console.log("chech error", error)
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Nộp khảo sát
    submitSurvey: async (req, res) => {
        try {
            const { survey_id, file, text_response } = req.body;
            const { id: userId, role } = req.user; // Lấy userId từ token

            // if (role !== "1") { // Nếu không phải sinh viên
            //     return res.status(403).json({ code: 9995, message: "Lỗi phiên đăng nhập" });
            // }

            if (!survey_id) {
                return res.status(400).json({ code: 1004, message: "Thiếu tham số survey_id" });
            }

            const result = await surveyService.submitSurvey(survey_id, file, text_response, userId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },


    // Lấy thông tin đáp án của khảo sát
    getSurveyResponses: async (req, res) => {
        try {
            const { survey_id } = req.query;
            const { role } = req.user; // Lấy role từ token (đã check trong verifyToken)

            if (role !== "0") { // Nếu không phải giảng viên
                return res.status(403).json({ code: 9995, message: "Access denied" });
            }

            if (!survey_id) {
                return res.status(400).json({ code: 1004, message: "Thiếu tham số survey_id" });
            }

            const result = await surveyService.getSurveyResponses(survey_id);
            return res.status(200).json(result);  // Trả kết quả từ surveyService
        } catch (error) {
            console.error("Error in getSurveyResponses:", error);
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },
};
