import express from "express";
import userController from "../controllers/userController";
import classController from "../controllers/classController";
import materialController from "../controllers/materialController";
import surveyController from "../controllers/surveyController";
import attendanceController from "../controllers/attendanceController";
import absenceRequestController from "../controllers/absenceRequestController";
import notificationController from "../controllers/notificationController";
import conversationController from "../controllers/conversationController";
import assignmentController from "../controllers/assignmentController";
import verifyToken from '../config/authMiddleware';

let router = express.Router();

let initWebRoutes = (app) => {

    // Authentication
    router.post('/api/login', userController.handleLogin); //login, get_verify_code, check_verify_code,
    router.post('/api/logout', userController.handleLogout); //logout,

    // Quản lý tài khoản
    router.post('/api/create-new-user', userController.handleCreateNewUser); // signup,
    router.get('/api/get-user-info', verifyToken, userController.handleGetUserInfo); //get_user_info,
    router.put('/api/edit-user', verifyToken, userController.handleEditUser); //change_info_after_signup, set_user_info, set_user_role, deactivate_user, reactivate_user.
    router.delete('/api/delete-user', verifyToken, userController.handleDeleteUser); //delete_user, deactivate_user

    // Quản lý lớp học
    router.post('/api/class/create-class', verifyToken, classController.createClass);
    router.put('/api/class/edit-class/:classId', verifyToken, classController.editClass);
    router.delete('/api/class/delete-class/:classId', verifyToken, classController.deleteClass);
    router.get('/api/class/get-class-info/:classId', verifyToken, classController.getClassInfo);
    router.get('/api/class/get-class-list', verifyToken, classController.getClassList);

    //Quản lý tài liệu học tập
    router.post('/api/material/upload-material', verifyToken, materialController.uploadMaterial);
    router.get('/api/material/get-material-list', verifyToken, materialController.getMaterialList);
    router.get('/api/material/get-material-info', verifyToken, materialController.getMaterialInfo);
    router.post('/api/material/delete-material', verifyToken, materialController.deleteMaterial);
    router.post('/api/material/edit-material', verifyToken, materialController.editMaterial);

    //Khảo sát và form
    router.post('/api/survey/create-survey', verifyToken, surveyController.createSurvey);
    router.post('/api/survey/edit-survey', verifyToken, surveyController.editSurvey);
    router.post('/api/survey/delete-survey', verifyToken, surveyController.deleteSurvey);
    router.post('/api/survey/submit-survey', verifyToken, surveyController.submitSurvey);
    router.get('/api/survey/get-survey-responses', verifyToken, surveyController.getSurveyResponses);

    //Điểm danh
    router.post('/api/attendance/take-attendance', verifyToken, attendanceController.takeAttendance);
    router.post('/api/attendance/get-attendance-record', verifyToken, attendanceController.getAttendanceRecord);
    router.post('/api/attendance/set-attendance-status', verifyToken, attendanceController.setAttendanceStatus);
    router.post('/api/attendance/get-attendance-list', verifyToken, attendanceController.getAttendanceList);

    //Xin phép nghỉ học
    router.post('/api/absence/request_absence', verifyToken, absenceRequestController.requestAbsence);
    router.post('/api/absence/review_absence_request', verifyToken, absenceRequestController.reviewAbsenceRequest);
    router.get('/api/absence/get_absence_requests', verifyToken, absenceRequestController.getAbsenceRequests);

    //Thông báo và giao tiếp
    router.post('/api/notification/send_notifications', verifyToken, notificationController.sendNotification);
    router.get('/api/notification/get_notifications', verifyToken, notificationController.getNotifications);
    router.post('/api/notification/mark_notification_as_read', verifyToken, notificationController.markNotificationAsRead);
    router.post('/api/conversation/get_list_conversation', verifyToken, conversationController.getListConversation);
    router.post('/api/conversation/get_conversation', verifyToken, conversationController.getConversation);
    router.post('/api/conversation/delete_message', verifyToken, conversationController.deleteMessage);

    //Hệ thống
    router.post('/api/user/change-password', verifyToken, userController.changePassword);

    //Quản lý bài tập
    router.post('/api/assignment/create-assignment', verifyToken, assignmentController.createAssignment);
    router.post('/api/assignment/edit-assignment', verifyToken, assignmentController.editAssignment);
    router.post('/api/assignment/delete-assignment', verifyToken, assignmentController.deleteAssignment);
    router.post('/api/assignment/submit-assignment', verifyToken, assignmentController.submitAssignment);
    router.post('/api/assignment/grade-assignment', verifyToken, assignmentController.gradeAssignment);
    router.get('/api/assignment/get-assignment-info/:assignmentId', verifyToken, assignmentController.getAssignmentInfo);
    router.get('/api/assignment/get-assignment-list/:classId', verifyToken, assignmentController.getAssignmentList);


    return app.use("/", router);
}

module.exports = initWebRoutes;