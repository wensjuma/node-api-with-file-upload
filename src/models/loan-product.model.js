
module.exports = (sequelize, Sequelize) => {
  
    const LoanProduct = sequelize.define("loan_product", {
       id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        product_name: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        interest_rate: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        processing_fee: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        product_code: {
            type: Sequelize.STRING(45),
            allowNull: false,
            unique:true
        },
        min_period: {
            type: Sequelize.STRING,
            allowNull: false
        },
        max_period: {
            type: Sequelize.STRING,
            allowNull: false
        },
        penalty_rate: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
    },
    {
       sequelize,
       timestamps: true,
       createdAt: true,
       updatedAt: 'updateTimestamp'
     } 
    );
    return LoanProduct;
};