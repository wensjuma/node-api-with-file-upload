const db = require("../models"); // models path depend on your structure
const Staff = db.staff;
const LoanLimits = db.loansLimits;
const Staging = db.staging;
const readXlsxFile = require("read-excel-file/node");
const generator = require('generate-password');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const request = require('../helpers/global.requests');
const axios = require("axios");

let mailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        "user": "churchappalert@ekenya.co.ke",
        "pass": "[0PerA!/3#.(hUL&%"
    }
})
exports.createStaff = async (req, res) => {
    try {
        if (!req.body.first_name) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }
        // Create a Staff
        const salt = await bcrypt.genSalt(10);
        console.log("..........", user);
        // const hashPassword = await bcrypt.hash(generator.generate({ length: 8, numbers: true }), salt);
        const staffCreateObject = {
            staff_id: req.body.staff_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            middle_name: req.body.middle_name,
            email_address: req.body.email_address,
            mobile_number: req.body.mobile_number,
            loan_limit: req.body.loan_limit,
            dob: req.body.dob,
            gender: req.body.gender,
            employment_date: req.body.employment_date,
            position: req.body.position,
            revenue_no: req.body.revenue_no,
            status: req.body.status,
            national_id: req.body.national_id,

            password: generator.generate({ length: 8, numbers: true })
        };
        console.log("XXXXXXXXXXXXXXXXXXXX", staffCreateObject);
        let staffStagingObject = {
            data: JSON.stringify(staffCreateObject),
            is_complete: false,
            is_approved: false,
            data_channel: 'tb_staff',
            created_by: user.email,
        }
        // Save Staff in the database
        Staging.create(staffStagingObject).then(data => {
            res.status(200).send({
                data: data,
                resp_message: "Record created successfully",
                resp_code: '00'
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Staff."
            });
        });
    } catch (error) {
        res.send({
            resp_code: '04',
            resp_message: error.message
        })
    }
};
exports.findAllStaff = (req, res) => {
    Staging.findAll({
        // include: [
        //     {
        //         model: LoanLimits,
        //         as: 'limits'
        //     }
        // ],
        where: { data_channel: 'tb_staff' }
    }).then(data => {
        let resData = data.map(element => {
            let item = JSON.parse(element['data']);
            delete item['password']
            item['id'] = element.id
            return item;
        })
        res.send({
            data: resData,
            resp_code: '00',
            resp_message: 'Successful retrieval!'
        });
    })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Staffs."
            });
        });
};
exports.findApprovedStaff = (req, res) => {
   
    Staff.findAll({
        include: [
            {
                model: LoanLimits,
                as: 'limits'
            }
        ]
        // where: condition
    }).then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Staffs."
            });
        });
};
exports.findOne = (req, res) => {
    try {
        const id = req.body.id;
        Staff.findByPk(id)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error retrieving Staff with id=" + id
                });
            }); 
    } catch (error) {
       res.send({
           resp_message: error.message
       }) 
    }
};
exports.updateApproved = (req, res) => {
    console.log(req.body);
    const id = req.body.id;
    // console.log(id);
    // this.findone
    Staff.update(req.body, {
        where: {
            id: id
        }
    }).then(num => {
        console.log(num);
        // console.log(id);
        if (num[0] === 1) {
            LoanLimits.findOne({
                where: {
                    employee_id: id,
                    limit_status: 1
                }
            }).then((limitItem) => {
                console.log("limitItem data", limitItem['limit_amount'] !== req.body.loan_limit);
                if (limitItem['limit_amount'] !== req.body.loan_limit) {
                    let deactivateLimit = {
                        limit_status: 0,
                    }
                    LoanLimits.update(deactivateLimit,
                        {
                            where: {
                                id: limitItem['id']
                            }
                        }).then(finalRes => {
                            let employeeLimitUpdate = {
                                limit_amount: req.body.loan_limit,
                                limit_status: 1,
                                employee_id: id
                            }
                            // console.log("employeeLimitUpdate payload", employeeLimitUpdate);
                            LoanLimits.create(employeeLimitUpdate).then(element => {
                                // console.log(element);

                                res.status(200).send({
                                    data: element,
                                    message: "Staff was approved successfully."
                                })
                            })

                        })

                }
            })
            res.send({
                message: "Staff was approved successfully."
            });
        } else {
            res.send({
                message: `Cannot update Staff with id=${id}. Maybe Staff was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating Staff with id=" + id
        });
    });
};
exports.update = (req, res) => {
    const id = req.body.id;
    // console.log(id);
    // this.findone
    Staging.update(req.body, {
        where: {
            id: id
        }
    }).then(num => {
        if (num === 1) {
            res.send({
                message: "Staff was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Staff with id=${id}. Maybe Staff was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating Staff with id=" + id
        });
    });
};
exports.delete = (req, res) => {
  try {
    const id = req.body.id;
    Staff.destroy({
        where: {
            id: id
        }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "Staff was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Staff with id=${id}. Maybe Staff was not found!`
            });
        }
    }).catch(err => {
            res.status(500).send({
                message: "Could not delete Staff with id=" + id
            });
        });
  } catch (error) {
      
  }
};
//Admin Approver
exports.approveStaff = async (req, res) => {
    // console.log("sTAFF", staffToken);
    // console.log("USER ==>", user);
    let approvalReq = {
        is_complete: true,
        is_approved: true

    }
    try {
        let stagedStaffUpdate = await Staging.update(approvalReq, { where: { id: req.body.id } });
        console.log("track this", stagedStaffUpdate);
        if (stagedStaffUpdate[0] === 1) {
            let stagedStaff = await Staging.findOne({ where: { id: req.body.id, data_channel: 'tb_staff' } });
            if (user.email !== stagedStaff['created_by']) {

                console.log(stagedStaff);
                let createJsonRequest = JSON.parse(stagedStaff['data'])
                createJsonRequest['record_status'] = 1;
                let pushedStaffToTable = await Staff.create(JSON.parse(stagedStaff['data']));
                console.log(pushedStaffToTable);
                //    .then((resp => {
                let employeeLimit = {
                    limit_amount: pushedStaffToTable.loan_limit,
                    limit_status: 1,
                    employee_id: pushedStaffToTable.id
                }
                let pushedLimitForStaff = await LoanLimits.create(employeeLimit)
                    .catch(err => {
                        res.send({
                            resp_message: err.message + "Error occured!",
                            resp_code: '57'
                        })
                    })
                let smsRequest =
                {
                    "to": "254705319216",
                    "message": `Dear Employee, your onboarding request on Kentapay was successful, use ${pushedStaffToTable.password} and ${pushedStaffToTable.email_address} as your login credentials`,
                    "from": "ECLECTICS",
                    "transactionID": "ZHD839278X@",
                    // "clientid": "5181"
                }
                let smsResponse = await request.externalRequest('pgsms/send', smsRequest);
                console.log(smsResponse);
                if (pushedLimitForStaff) {
                    res.status(200).send({
                        resp_message: "Record Approved successfully",
                        resp_code: '00'
                    });
                }
            } else {
                res.send({
                    resp_message: "permission denied",
                    resp_code: '05'
                });
            }
        }
        else {
            res.status(500).send({
                message: "Error occured while approving record"
            });
        }
        // })

    } catch (error) {
        res.status(500).send({
            message: error.message + "."
        });
    }
}
exports.deleteAll = (req, res) => {
    Staff.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} Staffs were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Staffs."
            });
        });
};

exports.upload = async (req, res) => {
    console.log('===========ferw');
    console.log("file= ========", req.file);
    console.log("body =========", req.body);
    try {
        if (req.file == undefined) {
            return res.status(400).send("Please upload an excel file!");
        }
        let path = __basedir + "/resources/static/assets/uploads/" + req.file.filename;
        readXlsxFile(path).then((rows) => {
            rows.shift();
            let employeesList = [];
            rows.forEach((row) => {
                let employees = {
                    id: row[0],
                    first_name: row[1],
                    last_name: row[2],
                    middle_name: row[3],
                    email_address: row[4],
                    mobile_number: row[5],
                    position: row[6],
                    gender: row[7],
                    dob: row[8],
                    national_id: row[9],
                    revenue_no: row[10],
                    staff_id: row[11],
                    employment_date: row[12],
                    loan_limit: row[13],
                    status: row[14],
                    password: generator.generate({ length: 8, numbers: true })
                };
                employeesList.push(employees);
            });
            Staff.bulkCreate(employeesList)
                .then((data) => {
                    let pushedLimitsArray = data.map(item => {
                        let employeeLimits = {
                            limit_amount: item.loan_limit,
                            limit_status: 1,
                            employee_id: item.id
                        }
                        return employeeLimits;
                    })
                    LoanLimits.bulkCreate(pushedLimitsArray)
                        .then(item => {

                            item = item;
                            res.status(200).send({
                                resp_message: "Uploaded the file successfully: " + req.file.originalname,
                                resp_code: '00'
                            });
                        })
                    // res.status(200).send({

                    // });
                })
                .catch((error) => {
                    res.send({
                        // message: "Fail to import data into database!",
                        resp_code: '04',
                        resp_message: error.message + "-Duplicate records detected",
                    });
                });
        });
    } catch (error) {
        // console.log(error);
        res.send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};
