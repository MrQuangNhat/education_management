import notificationService from "../services/notificationService";

module.exports = {
    sendNotification: async (req, res) => {
        const { id } = req.user;  // Lấy senderId từ token
        const { user_id, message, type } = req.body;

        const result = await notificationService.sendNotification(id, user_id, message, type);
        return res.status(200).json(result);
    },

    getNotifications: async (req, res) => {
        const { id } = req.user;
        const { index, count } = req.query;

        const result = await notificationService.getNotifications(id, parseInt(index), parseInt(count));
        return res.status(200).json(result);
    },

    markNotificationAsRead: async (req, res) => {
        const { notification_ids } = req.body;
        const result = await notificationService.markNotificationAsRead(notification_ids);
        return res.status(200).json(result);
    }
};
