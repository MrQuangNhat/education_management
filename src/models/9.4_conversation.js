module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define('Conversation', {
        senderId: { type: DataTypes.INTEGER, allowNull: false },
        receiverId: { type: DataTypes.INTEGER, allowNull: false },
        lastMessageId: { type: DataTypes.INTEGER, allowNull: true }
    });

    Conversation.associate = function (models) {
        // A conversation has many messages
        Conversation.hasMany(models.Message, { foreignKey: 'conversationId' });

        // Conversation has two users (sender and receiver)
        Conversation.belongsTo(models.User, { foreignKey: 'senderId', as: 'Sender' });
        Conversation.belongsTo(models.User, { foreignKey: 'receiverId', as: 'Receiver' });
    };

    return Conversation;
};
