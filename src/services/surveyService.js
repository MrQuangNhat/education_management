import db from "../models/index";

module.exports = {
    // Create a new survey
    createSurvey: async (title, description, file, deadline) => {
        try {
            if (deadline && new Date(deadline) < new Date()) {
                return { code: 1010, message: "Deadline không hợp lệ, không thể là ngày trong quá khứ" };
            }

            const survey = await db.Survey.create({
                title,
                description,
                file: file || null,
                deadline
            });

            return { code: 1000, message: "Khảo sát đã được tạo", data: survey };
        } catch (error) {
            console.error("Error in createSurvey:", error);
            throw error;
        }
    },

    // Chỉnh sửa khảo sát
    editSurvey: async (survey_id, description, file, deadline) => {
        try {
            const survey = await db.Survey.findOne({ where: { id: survey_id }, raw: false });
            if (!survey) {
                return { code: 9992, message: "Khảo sát không tồn tại" };
            }

            if (deadline && new Date(deadline) < new Date()) {
                return { code: 1010, message: "Deadline không hợp lệ, không thể là ngày trong quá khứ" };
            }

            // Chỉnh sửa các trường dữ liệu
            survey.description = description || survey.description;
            survey.file = file || survey.file;
            survey.deadline = deadline || survey.deadline;

            await survey.save();

            return { code: 1000, message: "OK", data: survey };
        } catch (error) {
            console.error("Error in editSurvey:", error);
            throw error;
        }
    },

    // Xóa khảo sát
    deleteSurvey: async (survey_id) => {
        try {
            const survey = await db.Survey.findOne({ where: { id: survey_id }, raw: false });
            if (!survey) {
                return { code: 9992, message: "Khảo sát không tồn tại" };
            }

            // Kiểm tra nếu có sinh viên đã nộp bài thì không xóa được
            const responses = await db.Response.findAll({ where: { surveyId: survey_id } });
            if (responses.length > 0) {
                return { code: 1011, message: "Không thể xóa khảo sát đã có bài nộp" };
            }

            await survey.destroy();
            return { code: 1000, message: "OK", data: "Khảo sát đã xóa" };
        } catch (error) {
            console.error("Error in deleteSurvey:", error);
            throw error;
        }
    },

    // Nộp khảo sát
    submitSurvey: async (survey_id, file, text_response, user_id) => {
        try {
            const survey = await db.Survey.findOne({ where: { id: survey_id } });
            if (!survey) {
                return { code: 9992, message: "Khảo sát không tồn tại" };
            }

            // Kiểm tra deadline
            if (new Date() > new Date(survey.deadline)) {
                return { code: 1012, message: "Đã qua deadline nộp bài" };
            }

            // Lưu bài nộp
            const response = await db.Response.create({
                surveyId: survey_id,
                file: file || null,
                text_response: text_response || null,
                userId: user_id,  // Lưu ID người nộp
            });

            return { code: 1000, message: "OK", survey_submited: response };
        } catch (error) {
            console.error("Error in submitSurvey:", error);
            throw error;
        }
    },

    // Lấy thông tin các bài nộp khảo sát
    getSurveyResponses: async (survey_id) => {
        try {
            // Truy vấn Survey
            const survey = await db.Survey.findOne({ where: { id: survey_id } });
            if (!survey) {
                return { code: 9992, message: "Khảo sát không tồn tại" };
            }

            // Truy vấn các Responses và bao gồm User thông qua `include`
            const responses = await db.Response.findAll({
                where: { surveyId: survey_id },
                raw: false,
                include: [
                    {
                        model: db.User,
                        as: 'user',  // Alias phải khớp với alias trong mối quan hệ Sequelize
                        attributes: ['id', 'name', 'email'],  // Các thuộc tính bạn muốn trả về từ User
                    }
                ]
            });

            // Duyệt qua các responses và lấy dữ liệu từ instance Sequelize
            const responseData = responses.map(response => {
                // Kiểm tra nếu 'user' tồn tại, sau đó gọi .get() để lấy thông tin từ instance
                const user = response.user ? response.user.get() : null;

                return {
                    submission_id: response.id,
                    // surveyId: response.surveyId,
                    // survey_title: survey.title,
                    file: response.file,
                    text_response: response.text_response,
                    user_id: user.id,
                    user_name: user.name,
                    user_email: user.email,
                    // user // Trả về thông tin người nộp bài
                };
            });

            return { code: 1000, message: "OK", survey_title: survey.title, responses: responseData };
        } catch (error) {
            console.error("Error in getSurveyResponses:", error);
            throw error;
        }
    }
};
