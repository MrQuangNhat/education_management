import db from "../models/index";
const { Op } = require('sequelize');



module.exports = {
    getListConversation: async (userId, index, count) => {
        try {
            // Lấy danh sách hội thoại của người dùng
            const conversations = await db.Conversation.findAll({
                where: {
                    [Op.or]: [{ senderId: userId }, { receiverId: userId }]
                },
                offset: index,
                limit: count,
                include: [
                    // Include both sender and receiver details
                    {
                        model: db.User,
                        as: 'Sender',
                        attributes: ['id', 'avatar', 'name']
                    },
                    {
                        model: db.User,
                        as: 'Receiver',
                        attributes: ['id', 'avatar', 'name']
                    },
                    {
                        model: db.Message,
                        attributes: ['id', 'content', 'createdAt', 'isRead'],
                        order: [['createdAt', 'DESC']], // Sort by the last message created
                        limit: 1, // Only get the last message
                    }
                ]
            });

            if (!conversations.length) {
                return { code: 1004, message: "Không có cuộc hội thoại nào" };
            }

            return {
                code: 1000,
                message: 'OK',
                data: conversations.map(convo => ({
                    id: convo.id,
                    partnerId: convo.senderId === userId ? convo.Receiver.id : convo.Sender.id, // Get the other party's ID
                    lastMessage: convo.Messages[0]?.content || '',
                    numNewMessages: convo.Messages.filter(msg => !msg.isRead).length // Count the number of unread messages
                }))
            };
        } catch (error) {
            console.error('Error in getListConversation:', error);
            return { code: 500, message: 'Lỗi hệ thống', error };
        }
    },

    getConversation: async (userId, index = 0, count = 10, conversationId) => {
        try {
            // Kiểm tra sự tồn tại của cuộc hội thoại
            const conversation = await db.Conversation.findByPk(conversationId, {
                include: [{ model: db.User, as: 'partner', attributes: ['id', 'avatar', 'name'] }]
            });

            if (!conversation) {
                return { code: 1004, message: "Hội thoại không tồn tại" };
            }

            // Lấy tin nhắn từ hội thoại
            const messages = await db.Message.findAll({
                where: { conversationId },
                offset: index,
                limit: count,
                order: [['createdAt', 'ASC']]
            });

            return {
                code: 1000,
                message: 'OK',
                data: messages.map(msg => ({
                    message_id: msg.id,
                    sender: { id: msg.senderId, avatar: msg.sender.avatar, name: msg.sender.name },
                    receiver: { id: msg.receiverId, avatar: msg.receiver.avatar, name: msg.receiver.name },
                    content: msg.content,
                    created: msg.createdAt
                }))
            };
        } catch (error) {
            console.error('Error in getConversation:', error);
            return { code: 500, message: 'Lỗi hệ thống', error };
        }
    },

    deleteMessage: async (userId, messageId) => {
        try {
            // Tìm tin nhắn cần xóa
            const message = await db.Message.findByPk(messageId);

            if (!message || (message.senderId !== userId && message.receiverId !== userId)) {
                return { code: 1004, message: "Tin nhắn không tồn tại hoặc bạn không có quyền xóa" };
            }

            // Xóa tin nhắn
            await message.destroy();

            return { code: 1000, message: "Xóa tin nhắn thành công" };
        } catch (error) {
            console.error('Error in deleteMessage:', error);
            return { code: 500, message: 'Lỗi hệ thống', error };
        }
    },
};
