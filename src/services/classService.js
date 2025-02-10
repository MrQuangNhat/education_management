import db from "../models/index";

module.exports = {
    createClass: async (teacherId, data) => {
        try {
            // Kiểm tra giảng viên tồn tại
            const teacher = await db.Teacher.findOne({ where: { id: teacherId } });
            if (!teacher) {
                return { message: "Teacher not found or not authorized" };
            }

            // Kiểm tra tính hợp lệ của tên lớp học
            if (!data.class_name || data.class_name.length > 100) {
                return { message: "Invalid class name. It must not be empty or exceed 100 characters." };
            }

            // Kiểm tra tính hợp lệ của số lượng sinh viên tối đa
            if (Number.isInteger(data.max_students) || data.max_students <= 0) {
                return { message: "Invalid max students value. It must be a positive integer." };
            }

            // Kiểm tra ngày bắt đầu và ngày kết thúc
            if (new Date(data.start_date) > new Date(data.end_date)) {
                return { message: "Invalid dates. Start date cannot be later than end date." };
            }

            // Tạo lớp học
            const newClass = await db.Class.create({
                name: data.class_name,
                semester: data.semester,
                max_students: data.max_students,
                start_date: data.start_date,
                end_date: data.end_date,
                teacherId,
            });

            // Tạo lịch cho lớp học
            if (data.schedule) {
                const schedules = data.schedule.map((s) => ({
                    classId: newClass.id,
                    dayOfWeek: s.dayOfWeek,
                    startTime: s.startTime,
                    endTime: s.endTime,
                    location: s.location,
                }));
                await db.Schedule.bulkCreate(schedules);
            }

            return { code: 1000, message: "OK(Class created successfully)", Class: newClass };
        } catch (error) {
            throw error;
        }
    },


    // Edit Class
    editClass: async (teacherId, classId, data) => {
        try {
            // Truy vấn thông tin lớp học cùng với sinh viên và lịch
            const classInfo = await db.Class.findOne({
                where: { id: classId },
                include: [
                    db.Schedule,
                    { model: db.Student, attributes: ["id", "name"] },
                    { model: db.Teacher, attributes: ["id"] }, // Lấy giảng viên của lớp học
                ],
                raw: false,  // Đảm bảo kết quả là instance của Sequelize
            });

            // Kiểm tra nếu lớp không tồn tại hoặc giảng viên không phải là người chỉnh sửa lớp
            if (!classInfo || classInfo.Teacher.id !== teacherId) {
                return { code: 1002, message: "Unauthorized to edit this class" };
            }

            // Kiểm tra tính hợp lệ của lịch học (trùng lịch với các lớp khác)
            if (data.schedule) {
                for (const s of data.schedule) {
                    const overlappingSchedules = await db.Schedule.findAll({
                        where: {
                            classId: { [db.Sequelize.Op.ne]: classId }, // Không phải lớp hiện tại
                            dayOfWeek: s.dayOfWeek,
                            startTime: { [db.Sequelize.Op.lt]: s.endTime },
                            endTime: { [db.Sequelize.Op.gt]: s.startTime },
                        },
                    });

                    if (overlappingSchedules.length > 0) {
                        return { code: 1003, message: "Schedule conflict with another class" };
                    }
                }
            }

            // Cập nhật tên lớp, ngày bắt đầu và ngày kết thúc
            classInfo.name = data.name || classInfo.name;
            classInfo.start_date = data.start_date || classInfo.start_date;
            classInfo.end_date = data.end_date || classInfo.end_date;
            // delete classInfo.max_students;
            delete classInfo.semester;
            delete classInfo.teacherId;
            delete classInfo.createdAt;
            delete classInfo.updatedAt;
            await classInfo.save();

            // Cập nhật lịch học
            if (data.schedule) {
                // Xóa tất cả lịch học cũ
                await db.Schedule.destroy({ where: { classId } });

                // Tạo lịch học mới
                const schedules = data.schedule.map((s) => ({
                    classId,
                    dayOfWeek: s.dayOfWeek,
                    startTime: s.startTime,
                    endTime: s.endTime,
                    location: s.location,
                }));
                await db.Schedule.bulkCreate(schedules);
            }

            // Thêm sinh viên vào lớp
            if (data.studentIds && data.studentIds.length > 0) {
                // Kiểm tra các studentIds có tồn tại trong bảng Student
                const students = await db.Student.findAll({
                    where: { id: data.studentIds },
                });

                if (students.length !== data.studentIds.length) {
                    return { code: 9994, message: "One or more students do not exist" };
                }

                // Thêm sinh viên vào lớp
                await classInfo.setStudents(data.studentIds);
            }

            return { code: 1000, message: "OK(Class updated successfully)", classInfo };
        } catch (error) {
            console.error('Error in editClass service:', error);  // Log lỗi chi tiết
            throw error;
        }
    },



    // Delete Class
    deleteClass: async (teacherId, classId) => {
        try {
            const classInfo = await db.Class.findOne({ where: { id: classId, teacherId } });
            console.log('check class', classInfo);
            // Tiến hành xóa các bản ghi liên quan
            await db.ClassStudent.destroy({ where: { classId } });
            await db.Schedule.destroy({ where: { classId } })
            // Gọi destroy trên classInfo nếu là instance hợp lệ
            await db.Class.destroy({ where: { id: classId } });

            return { code: 0, message: "Class deleted successfully" };
        } catch (error) {
            console.error('Error in deleteClass service:', error);  // Log lỗi chi tiết
            throw error;
        }
    },


    // Get Class Info
    getClassInfo: async (classId) => {
        try {
            const classInfo = await db.Class.findOne({
                where: { id: classId },
                include: [
                    { model: db.Student, attributes: ["id", "name"] },
                    { model: db.Schedule, attributes: ["dayOfWeek", "startTime", "endTime", "location"] },
                ],
                raw: false,  // Đảm bảo kết quả là instance của Sequelize
            });

            if (!classInfo) {
                return { code: 1, message: "Class not found" };
            }

            const classInstance = classInfo instanceof db.Class ? classInfo.get() : classInfo;

            return {
                code: 1000,
                data: {
                    name: classInstance.name,
                    schedule: classInstance.Schedules,
                    students: classInstance.Students,
                },
            };
        } catch (error) {
            console.error('Error in getClassInfo service:', error);  // Log lỗi chi tiết
            throw error;
        }
    },

    // Get Class List
    getClassList: async (teacherId) => {
        try {
            const classList = await db.Class.findAll({
                where: { teacherId },
                include: [
                    { model: db.Student },
                    { model: db.Teacher },
                    { model: db.Schedule, attributes: ["dayOfWeek", "startTime", "endTime", "location"] }
                ],
                raw: false,  // Đảm bảo kết quả là instance của Sequelize
            });

            // Kiểm tra nếu không có lớp học
            if (classList.length === 0) {
                return { code: 1000, data: [], message: "No classes available for this teacher." };
            }

            const result = classList.map((cls) => {
                // Chắc chắn rằng bạn đang truy cập vào instance của Sequelize
                const classInstance = cls instanceof db.Class ? cls.get() : cls;

                // Xác định trạng thái của lớp học
                const currentDate = new Date();
                let status = '';

                if (currentDate < new Date(classInstance.start_date)) {
                    status = 'Sắp diễn ra'; // Lớp học chưa bắt đầu
                } else if (currentDate > new Date(classInstance.end_date)) {
                    status = 'Đã kết thúc'; // Lớp học đã kết thúc
                } else {
                    status = 'Đang hoạt động'; // Lớp học đang diễn ra
                }

                return {
                    id: classInstance.id,
                    class_name: classInstance.name,
                    lecturer_name: classInstance.Teacher.name,
                    student_count: classInstance.Students.length,
                    start_date: classInstance.start_date,
                    end_date: classInstance.end_date,
                    status: status, // Trả về trạng thái
                    schedule: classInstance.Schedules
                };
            });

            return { code: 1000, data: result };
        } catch (error) {
            console.error('Error in getClassList service:', error);  // Log lỗi chi tiết
            throw error;
        }
    },

};
