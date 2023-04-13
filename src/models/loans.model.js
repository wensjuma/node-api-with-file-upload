
module.exports = (sequelize, Sequelize) => {
  
     const Loan = sequelize.define("loans", {
        id: {
             type: Sequelize.INTEGER,
             allowNull: false,
             autoIncrement: true,
             primaryKey: true
         },
         amount: {
             type: Sequelize.TEXT,
             allowNull: false
         },
         loan_fee: {
             type: Sequelize.TEXT,
             allowNull: false
         },
         interest_rate: {
             type: Sequelize.TEXT,
             allowNull: false
         },
         penalties: {
             type: Sequelize.STRING,
             allowNull: false
         },
         duration_days: {
             type: Sequelize.STRING,
             allowNull: false
         },
         phone_number: {
             type: Sequelize.STRING,
             allowNull: false
         },
         phone_number: {
             type: Sequelize.STRING,
             allowNull: false
         },
         transaction_code: {
             type: Sequelize.STRING
         },
         transaction_type: {
             type: Sequelize.STRING(64),
             allowNull: false
         },
         disbursement_status: {
             type: Sequelize.STRING(103)
         },
         loan_repayment_status: {
             type: Sequelize.INTEGER(2)
         },
         loan_product_id: {
             type: Sequelize.INTEGER(11)
         },
         disbursement_ref: {
             type: Sequelize.INTEGER(2)
         },
         disbursement_code: {
             type: Sequelize.INTEGER(2)
         },
         created_on: {
             type: Sequelize.INTEGER(11)
         },
         applied_by: {
             type: Sequelize.STRING
         },
         debit_account: {
             type: Sequelize.STRING(20)
         },
         disbursement_account: {
             type: Sequelize.STRING
         },
         loan_account: {
             type: Sequelize.STRING
         },
         loan_balance: {
             type: Sequelize.FLOAT
         },
         created_by: {
             type: Sequelize.DATE
         },
         due_on: {
             type: Sequelize.DATE
         },
         response_message: {
             type: Sequelize.TEXT
         },
     },
     {
        sequelize,
        timestamps: true,
        createdAt: true,
        updatedAt: 'updateTimestamp'
      } 
     );
    //  employeeInstance(Staff)
     return Loan;
 };