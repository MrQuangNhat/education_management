// 202401010006-create-activity-log.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ActivityLogs', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Teachers',  // Trỏ đến bảng Teacher
                    key: 'id',  // Trỏ đến cột 'id' của bảng Teacher
                },
                onDelete: 'CASCADE',
                allowNull: false,
            },
            action: Sequelize.STRING,
            details: Sequelize.TEXT,
            timestamp: Sequelize.DATE,
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ActivityLogs');
    },
};
