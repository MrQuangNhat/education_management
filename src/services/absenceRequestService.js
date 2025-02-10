import db from "../models/index";
const { Op } = require('sequelize');



module.exports = {
    requestAbsence: async (classId, date, reason, studentId) => {
        try {
            // Kiểm tra lý do xin vắng mặt
            if (!reason || reason.trim() === '') {
                return { code: 1004, message: "Lý do xin vắng mặt không hợp lệ" };
            }

            // Kiểm tra lớp học tồn tại
            const classExists = await db.Class.findByPk(classId);
            if (!classExists) {
                return { code: 1003, message: "ID lớp học không hợp lệ" };
            }

            // Kiểm tra ngày vắng mặt
            if (new Date(date) < new Date()) {
                return { code: 1004, message: "Ngày không hợp lệ, không thể xin vắng mặt trong quá khứ" };
            }

            // Tạo yêu cầu xin vắng mặt
            const request = await db.AbsenceRequest.create({
                studentId: studentId,
                classId: classId,
                reason: reason,
                status: 'pending',  // Mới tạo sẽ có trạng thái là 'pending'
                requestDate: date,
            });

            const student = await db.Student.findByPk(studentId);

            return { code: 1000, message: "Yêu cầu vắng mặt đã được gửi thành công", data: { requestId: request.id, studentId: request.studentId, studentName: student.name } };
        } catch (error) {
            console.error("Error in requestAbsence:", error);
            return { code: 500, message: "Lỗi hệ thống", error };
        }
    },


    reviewAbsenceRequest: async (requestId, status, teacherId) => {
        try {
            // Kiểm tra trạng thái hợp lệ (approved, rejected)
            if (!['approved', 'rejected'].includes(status)) {
                return { code: 1006, message: "Trạng thái xét duyệt không hợp lệ" };
            }

            // Kiểm tra yêu cầu vắng mặt tồn tại và giảng viên có quyền duyệt yêu cầu
            const request = await db.AbsenceRequest.findByPk(requestId, {
                raw: false,
                include: [
                    {
                        model: db.Class,
                        where: { teacherId: teacherId }, // Kiểm tra giảng viên có quyền duyệt yêu cầu
                    },
                    {
                        model: db.Student,
                        attributes: ['id', 'name']  // Lấy id và name của sinh viên
                    }
                ]
            });

            if (!request) {
                return { code: 1004, message: "Không có quyền xét duyệt yêu cầu" };
            }

            // Cập nhật trạng thái xét duyệt và thời gian phản hồi
            request.status = status;
            request.responseTime = new Date();

            // Lưu bản ghi đã cập nhật
            await request.save();

            return {
                code: 1000,
                message: "Yêu cầu đã được xử lý thành công",
                request: {
                    student: request.Student.name,
                    studentId: request.Student.id,
                    status: request.status,
                    responseTime: request.responseTime
                }
            };
        } catch (error) {
            console.error("Error in reviewAbsenceRequest:", error);
            return { code: 500, message: "Lỗi hệ thống", error };
        }
    },


    getAbsenceRequests: async (classId, date, teacherId) => {
        try {
            // Kiểm tra lớp học tồn tại và giảng viên có quyền truy cập lớp học này
            const classExists = await db.Class.findByPk(classId, {
                raw: true,
                include: [{
                    model: db.Teacher,
                    where: { id: teacherId },  // Kiểm tra giảng viên có quyền truy cập lớp học
                }]
            });

            if (!classExists) {
                return { code: 1003, message: "ID lớp học không hợp lệ hoặc bạn không có quyền truy cập lớp học này" };
            }

            // Kiểm tra ngày hợp lệ (Ngày vắng mặt không được trong quá khứ)
            // const classDate = new Date(date);
            // if (classDate < new Date()) {
            //     return { code: 1004, message: "Ngày không hợp lệ, không thể xin vắng mặt trong quá khứ" };
            // }

            // Kiểm tra ngày yêu cầu có hợp lệ trong phạm vi lịch học
            // if (classDate < new Date(classExists.start_date) || classDate > new Date(classExists.end_date)) {
            //     return { code: 1004, message: "Ngày không hợp lệ, ngoài phạm vi lịch học của lớp" };
            // }

            // Lấy danh sách yêu cầu vắng mặt trong ngày yêu cầu
            const requests = await db.AbsenceRequest.findAll({
                where: {
                    classId: classId,
                    requestDate: date
                },
                raw: false,
                include: [{
                    model: db.Student,
                    attributes: ['id', 'name', 'email']  // Lấy thông tin sinh viên
                }]
            });

            // Nếu không có yêu cầu xin vắng mặt trong ngày này
            if (!requests || requests.length === 0) {
                return { code: 1004, message: "Không có yêu cầu xin vắng mặt trong ngày này" };
            }

            return { code: 1000, message: "OK", data: requests }; // Trả về các yêu cầu vắng mặt
        } catch (error) {
            console.error("Error in getAbsenceRequests:", error);
            return { code: 500, message: "Lỗi hệ thống", error };
        }
    },


};
