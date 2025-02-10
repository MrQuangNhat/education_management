// migrations/YYYYMMDDHHMMSS-create-conversation.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Conversations', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            senderId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            receiverId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            lastMessageId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now')
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now')
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Conversations');
    }
};
