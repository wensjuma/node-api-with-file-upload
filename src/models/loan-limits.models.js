const db = require("./employees.model"); // models path depend on your structure
// const Staff = db.staff;
module.exports = (sequelize, Sequelize) => {
  
    const LoanLimits = sequelize.define("loan_limits", {
       id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        limit_amount: {
            type: Sequelize.STRING,
            allowNull: false
        },
        limit_status: {
            type: Sequelize.TINYINT,
            allowNull: false
        },
        employee_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },
    {
       sequelize,
       timestamps: true,
       createdAt: true,
       updatedAt: 'updateTimestamp'
     });
    //  LoanLimits.associate = (models) =>{
    //      loansLimits.belongsTo(models.Staff, {foreignKey:'employee_id'})
    //  }
    return LoanLimits;
};