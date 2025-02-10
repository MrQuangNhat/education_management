import conversationService from "../services/conversationService";

module.exports = {
    getListConversation: async (req, res) => {
        const { token, index, count } = req.body;
        const userId = req.user.id; // lấy id người dùng từ verifyToken

        try {
            const result = await conversationService.getListConversation(userId, index, count);
            return res.status(result.code === 1000 ? 200 : 400).json(result);
        } catch (error) {
            return res.status(500).json({ code: 500, message: 'Lỗi hệ thống', error });
        }
    },

    getConversation: async (req, res) => {
        const { token, index, count, conversationId } = req.body;
        const userId = req.user.id; // lấy id người dùng từ verifyToken

        try {
            const result = await conversationService.getConversation(userId, index, count, conversationId);
            return res.status(result.code === 1000 ? 200 : 400).json(result);
        } catch (error) {
            return res.status(500).json({ code: 500, message: 'Lỗi hệ thống', error });
        }
    },

    deleteMessage: async (req, res) => {
        const { token, messageId } = req.body;
        const userId = req.user.id; // lấy id người dùng từ verifyToken

        try {
            const result = await conversationService.deleteMessage(userId, messageId);
            return res.status(result.code === 1000 ? 200 : 400).json(result);
        } catch (error) {
            return res.status(500).json({ code: 500, message: 'Lỗi hệ thống', error });
        }
    },
};
