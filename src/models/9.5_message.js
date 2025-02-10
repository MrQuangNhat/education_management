// models/message.js
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        conversationId: { type: DataTypes.INTEGER, allowNull: false },
        senderId: { type: DataTypes.INTEGER, allowNull: false },
        receiverId: { type: DataTypes.INTEGER, allowNull: false },
        content: { type: DataTypes.STRING, allowNull: false },
        isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
    });

    Message.associate = function (models) {
        // Tin nhắn thuộc về một conversation
        Message.belongsTo(models.Conversation, { foreignKey: 'conversationId' });
        Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
        Message.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' });
    };

    return Message;
};
