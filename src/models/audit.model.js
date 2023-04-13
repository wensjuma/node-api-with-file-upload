
module.exports = (sequelize, Sequelize) => {
    const AuditTrail = sequelize.define("audit_trail", {
       id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        ip_address: {
            type: Sequelize.STRING,
            allowNull: true
        },
        user_agent: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        browser: {
            type: Sequelize.DOUBLE,
            allowNull: true
        },
        action: {
            type: Sequelize.STRING,
            allowNull: true
        },
        action_data: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    },
    {
       sequelize,
       timestamps: true,
       createdAt: true,
       updatedAt: 'updateTimestamp'
     } 
    );
    return AuditTrail;
};