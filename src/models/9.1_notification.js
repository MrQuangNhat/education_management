'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate(models) {
            Notification.belongsTo(models.User, { foreignKey: 'senderId', as: 'Sender' });
            Notification.belongsTo(models.User, { foreignKey: 'recipientId', as: 'Recipient' });
        }
    }
    Notification.init(
        {
            senderId: DataTypes.INTEGER,
            recipientId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            content: DataTypes.TEXT,
            isRead: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'Notification',
        }
    );
    return Notification;
};
