import db from "../models/index";
import moment from "moment";

module.exports = {
    // API take_attendance
    takeAttendance: async (classId, attendanceList) => {
        try {
            // Kiểm tra định dạng ngày
            // if (!moment(date, "YYYY-MM-DD", true).isValid()) {
            //     return { code: 1004, message: "Ngày điểm danh không hợp lệ" };
            // }

            // Kiểm tra lớp học tồn tại
            const classExists = await db.Class.findByPk(classId);
            if (!classExists) {
                return { code: 1004, message: "ID lớp học không hợp lệ" };
            }

            // Tạo bản ghi điểm danh cho lớp học và ngày học
            const attendance = await db.Attendance.create({
                classId: classId,
                sessionDate: new Date(),
            });

            // Nếu không có sinh viên vắng mặt
            if (attendanceList.length === 0) {
                return { code: 1000, message: "OK, điểm danh thành công với không có sinh viên vắng mặt" };
            }

            // Điểm danh các sinh viên vắng mặt
            for (const studentId of attendanceList) {
                // Kiểm tra sinh viên tồn tại trong bảng students dựa trên cột id
                const studentExists = await db.Student.findByPk(studentId);
                if (!studentExists) {
                    return { code: 1004, message: `Sinh viên với ID ${studentId} không tồn tại` };
                }

                // Tạo bản ghi điểm danh cho sinh viên
                await db.AttendanceRecord.create({
                    attendanceId: attendance.id,
                    studentId: studentId,
                    status: 'absent',
                    timestamp: new Date(),
                });
            }

            return { code: 1000, message: "OK, điểm danh thành công" };
        } catch (error) {
            console.error("Error in takeAttendance:", error);
            return { code: 500, message: "Lỗi hệ thống", error };
        }
    },


    // API get_attendance_record
    getAttendanceRecord: async (classId, studentId) => {
        try {
            // Kiểm tra sinh viên có đăng ký lớp học không
            const studentInClass = await db.Class.findOne({
                where: { id: classId },
                raw: true,
                include: [{
                    model: db.Student,
                    where: { id: studentId }
                }]
            });
            if (!studentInClass) {
                return { code: 1004, message: "Sinh viên không tham gia lớp học này" };
            }

            // Lấy lịch sử điểm danh của sinh viên trong lớp
            const records = await db.AttendanceRecord.findAll({
                where: { studentId: studentId },
                attributes: ['status'],
                raw: true,
                include: [
                    {
                        model: db.Attendance,
                        where: { classId: classId },
                        attributes: ['sessionDate'],
                    }
                ]

            });

            if (!records || records.length === 0) {
                return { code: 1004, message: "Không có lịch sử điểm danh" };
            }

            return { code: 1000, message: "OK", data: records };
        } catch (error) {
            console.error("Error in getAttendanceRecord:", error);
            throw error;
        }
    },

    // API set_attendance_status
    setAttendanceStatus: async (attendanceId, studentId, classId, status, userId) => {
        try {
            // Kiểm tra trạng thái hợp lệ (present, absent, late)
            if (!['present', 'absent', 'late'].includes(status)) {
                return { code: 1006, message: "Trạng thái không hợp lệ" };
            }

            // Kiểm tra bản ghi điểm danh có tồn tại
            const record = await db.AttendanceRecord.findByPk(attendanceId, { raw: false });
            if (!record) {
                return { code: 1004, message: "ID bản ghi không hợp lệ" };
            }

            // Kiểm tra quyền giảng viên khi chỉnh sửa điểm danh
            const attendance = await db.Attendance.findOne({
                where: { id: record.attendanceId },
                raw: false,
                include: [{
                    model: db.Class,
                    attributes: ['teacherId'], // Chỉ lấy teacherId từ bảng Class
                    where: { id: classId }
                }]
            });

            // Kiểm tra xem giảng viên có quyền chỉnh sửa điểm danh này không
            if (attendance && attendance.Class.teacherId !== userId) {
                return { code: 1005, message: "Giảng viên không có quyền chỉnh sửa điểm danh này" };
            }

            // Kiểm tra sinh viên có thuộc lớp học này không
            const studentInClass = await db.Class.findOne({
                where: { id: classId },
                raw: false,
                include: [{
                    model: db.Student,
                    where: { id: studentId }
                }]
            });
            if (!studentInClass) {
                return { code: 1004, message: "Sinh viên không thuộc lớp này" };
            }

            // Kiểm tra nếu trạng thái không thay đổi
            if (record.status === status) {
                return { code: 1012, message: "Không có thay đổi" };
            }

            // Cập nhật trạng thái điểm danh
            record.status = status;
            await record.save();

            return { code: 1000, message: "Cập nhật trạng thái thành công", data: record };
        } catch (error) {
            console.error("Error in setAttendanceStatus:", error);
            return { code: 500, message: "Lỗi hệ thống", error };
        }
    },


    // API get_attendance_list
    getAttendanceList: async (classId, date) => {
        try {
            // Log classId để kiểm tra dữ liệu
            console.log("classId received:", classId, date);

            // Kiểm tra ID lớp học hợp lệ
            const classDetails = await db.Class.findByPk(classId);  // Không cần raw: true nếu không cần dữ liệu thuần túy
            if (!classDetails) {
                return { code: 1004, message: "ID lớp học không hợp lệ" };
            }

            // Kiểm tra ngày điểm danh có hợp lệ trong phạm vi lịch học
            if (new Date(date) < new Date(classDetails.start_date) || new Date(date) > new Date(classDetails.end_date)) {
                return { code: 1004, message: "Ngày điểm danh không hợp lệ" };
            }

            // Lấy bản ghi điểm danh cho lớp học và ngày điểm danh
            const attendance = await db.Attendance.findOne({ where: { classId, sessionDate: date }, raw: false });
            console.log('check attendance', attendance)
            if (!attendance) {
                return { code: 1004, message: "Ngày điểm danh không tồn tại" };
            }

            // Lấy danh sách sinh viên đã điểm danh
            const records = await db.AttendanceRecord.findAll({
                where: { attendanceId: attendance.id },
                raw: false,
                include: [
                    {
                        model: db.Student,
                        attributes: ['id', 'name', 'email'],
                    }
                ]
            });

            // Kiểm tra nếu không có sinh viên nào điểm danh
            if (records.length === 0) {
                return { code: 1004, message: "Không có sinh viên nào điểm danh trong ngày này" };
            }

            return { code: 1000, message: "OK", data: records };
        } catch (error) {
            console.error("Error in getAttendanceList:", error);
            return { code: 500, message: "Lỗi hệ thống", error };
        }
    },


};
