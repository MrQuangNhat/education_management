import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import teacherController from "../controllers/teacherController";
import studentController from "../controllers/studentController";
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/account', homeController.getAccount);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);

    // api
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetALlUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);

    router.get('/api/allcode', userController.getAllCode);

    router.get('/api/top-teacher-home', teacherController.getTopTeacherHome);
    router.get('/api/get-all-teachers', teacherController.getAllTeachers);
    router.post('/api/save-infor-teacher', teacherController.postInforTeacher);
    router.get('/api/get-detail-teacher-by-id', teacherController.getDetailTeacherById);
    router.post('/api/bulk-create-schedule', teacherController.bulkCreateSchedule);
    router.get('/api/get-schedule-teacher-by-date', teacherController.getScheduleByDate);
    router.get('/api/get-profile-teacher-by-id', teacherController.getProfileTeacherById);
    router.get('/api/get-list-student-for-teacher', teacherController.getListStudentForTeacher);

    router.post('/api/student-book-appointment', studentController.postBookAppointment);


    return app.use("/", router);
}

module.exports = initWebRoutes;