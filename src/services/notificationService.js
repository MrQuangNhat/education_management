import db from "../models/index";

const sendNotification = async (senderId, recipientId, message, type) => {
    try {
        if (!recipientId) {
            return { code: 1002, message: "Yêu cầu nhập user_id." };
        }

        // Kiểm tra người nhận tồn tại
        const recipient = await db.User.findByPk(recipientId);
        if (!recipient) {
            return { code: 9992, message: "Người nhận không tồn tại." };
        }

        if (!message || message.length === 0) {
            return { code: 1002, message: "Yêu cầu nhập nội dung thông báo." };
        }

        if (message.length > 500) {
            return { code: 1004, message: "Yêu cầu rút gọn nội dung thông báo." };
        }

        // Tạo thông báo
        const notification = await db.Notification.create({
            senderId,
            recipientId,
            title: type,
            content: message,
            isRead: false,
        });

        return { code: 1000, message: "Thông báo đã được gửi thành công", notificationId: notification.id };
    } catch (error) {
        console.error("Error in sendNotification:", error);
        return { code: 500, message: "Lỗi hệ thống", error };
    }
};

const getNotifications = async (userId, index, count) => {
    try {
        if (index < 0 || count <= 0) {
            return { code: 1002, message: "Yêu cầu kiểm tra lại giá trị index hoặc count." };
        }

        const notifications = await db.Notification.findAll({
            where: { recipientId: userId },
            offset: index,
            limit: count,
            order: [['createdAt', 'DESC']],
        });

        if (notifications.length === 0) {
            return { code: 1004, message: "Không có thông báo nào." };
        }

        return { code: 1000, message: "OK", data: notifications };
    } catch (error) {
        console.error("Error in getNotifications:", error);
        return { code: 500, message: "Lỗi hệ thống", error };
    }
};

const markNotificationAsRead = async (notificationIds) => {
    try {
        const result = await db.Notification.update(
            { isRead: true },
            { where: { id: notificationIds } }
        );

        if (result[0] === 0) {
            return { code: 1004, message: "Không có thông báo nào được đánh dấu là đã đọc" };
        }

        return { code: 1000, message: "Đã đánh dấu thông báo là đã đọc" };
    } catch (error) {
        console.error("Error in markNotificationAsRead:", error);
        return { code: 500, message: "Lỗi hệ thống", error };
    }
};

export default { sendNotification, getNotifications, markNotificationAsRead };
