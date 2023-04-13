
module.exports = (sequelize, Sequelize) => {
    const LoanMessage = sequelize.define("loan_service_messages", {
       id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        amount: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        phone_number: {
            type: Sequelize.STRING(22),
            allowNull: false
        },
        loan_code: {
            type: Sequelize.STRING(22),
            allowNull: false
        },
        transaction_code: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        transaction_type: {
            type: Sequelize.STRING(105),
            allowNull: false,
        },
        host_code: {
            type: Sequelize.STRING(100)
        },
        response_code: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        response_message: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        status_code: {
            type: Sequelize.STRING(100)
        },
        created_on: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false
        },
        created_by: {
            type: Sequelize.STRING(100)
        },
    },
    {
       sequelize,
       timestamps: true,
       createdAt: true,
       updatedAt: 'updateTimestamp'
     } 
    );
    return LoanMessage;
};