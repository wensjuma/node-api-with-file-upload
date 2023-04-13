const db = require("./loan-limits.models"); // models path depend on your structure

module.exports = (sequelize, Sequelize) => {

    const Staff = sequelize.define("staff", {
        staff_id: {
            type: Sequelize.INTEGER
        },
        first_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        middle_name: {
            type: Sequelize.STRING
        },
        email_address: {
            type: Sequelize.STRING,
            unique:true
        },
        mobile_number: {
            type: Sequelize.STRING,
            unique:true
        },
        position: {
            type: Sequelize.STRING
        },
        // record_status: {
        //     type: Sequelize.TINYINT
        // },
        position: {
            type: Sequelize.STRING
        },
        gender: Sequelize.STRING,
        dob: Sequelize.DATE(6),
        national_id: Sequelize.STRING,
        revenue_no: Sequelize.STRING,
        staff_id: Sequelize.STRING,
        employment_date: Sequelize.DATE,
        loan_limit:Sequelize.STRING,
        status:Sequelize.STRING,
        password:Sequelize.STRING
    });

    return Staff;
   
};
