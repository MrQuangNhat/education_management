// migrations/YYYYMMDDHHMMSS-create-message.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Messages', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            conversationId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Conversations', // Bảng Conversation
                    key: 'id'
                }
            },
            senderId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // Bảng Users
                    key: 'id'
                }
            },
            receiverId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // Bảng Users
                    key: 'id'
                }
            },
            content: {
                type: Sequelize.STRING,
                allowNull: false
            },
            isRead: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
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
        await queryInterface.dropTable('Messages');
    }
};
