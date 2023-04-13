const db = require("../../models");
const bcrypt = require('bcrypt');
const loggerService = require("../../utils/logger.service");
const User = db.users;
const Staging = db.staging;

exports.create = async (req, res) => {
    // Validate request
    console.log("3437443y473r3e3uweuwewieiwee ====>",req.body);
    if (!req.body.username) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    let userDetails = {
        username: req.body.username,
        surname: req.body.surname,
        other_names: req.body.other_names,
        phone_number: req.body.phone_number,
        email: req.body.email,
        national_id: req.body.national_id,
        dob: req.body.dob,
        password: hashPassword,
        active: 0,
        user_type: req.body.user_type,
        account_status: 0,
        profile_id: req.body.profile_id ? req.body.profile_id : null

    };
    // console.log(user);
    let stageArray = {
        data: JSON.stringify(userDetails),
        is_complete: false,
        is_approved: false,
        data_channel: 'tb_users',
        created_by: "admin",
    }
    Staging.create(stageArray)
        .then(data => {
            data;
            res.send({
                data: data,
                resp_message: "Record created successfully",
                resp_code: '00'
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
};
exports.approveUser = async (req, res) => {
    console.log(req);
    let approvalReq = {
        is_complete: true,
        is_approved: true
    }
    try {
        let userToUpdate = await Staging.update(approvalReq, {
            where: { id: req.body.id }
        });
        // console.log('===///////////=====>', userToUpdate);
        if (userToUpdate[0] === 1) {
            let userApproved = await Staging.findOne({
                where: {
                    id: req.body.id,
                    data_channel: 'tb_users'
                }
            });
            let createJsonRequest = JSON.parse(userApproved['data'])
            createJsonRequest['active'] = 1;
            // createJsonRequest['approve_remarks'] =req.body.remarks
            console.log("createJsonRequest ===>>>", createJsonRequest);
            let pushToUserTable = await User.create(createJsonRequest)
            if (pushToUserTable) {
                res.status(200).send({
                    resp_message: "Record Approved successfully",
                    resp_code: '00'
                });
            }
        } else {
            res.status(500).send({
                message: "Error occured while approving record"
            });
        }


    } catch (error) {
        res.status(500).send({
            message: error.message + ".",
            resp_code: '01'
        });
    }
}
exports.findAll = (req, res) => {
    // loggerService.info(`logged into on user get`);
    Staging.findAll({
        where: { data_channel: 'tb_users' },
    })
        .then(data => {
            // console.log(data);
            let resData = data.map(element => {
                let item = JSON.parse(element['data']);
                // delete item['password']
                // item['id'] = element.id
                return item;
            })
            // console.log(resData);
            res.send({
                data:resData,
                resp_code:'00',
                resp_message: 'data retreved!'
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Users."
            });
        });
};
exports.findApprovedUsers = (req, res) => {
    req;
    User.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Users."
            });
        });
};
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findOne({ where: { email: req.body.email } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with Email=" + id
            });
        });
};
exports.update = (req, res) => {
    const id = req.body.id;
    User.update(req.body, {
        where: {
            id: id
        }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "Record was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Record with id=${id}. Maybe User was not found or req.body is empty!`
            });
        }
    })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};
exports.delete = (req, res) => {
    const id = req.params.id;
    User.destroy({
        where: {
            id: id
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} Users were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Users."
            });
        });
};
exports.findAllPublished = (req, res) => {
    User.findAll({
        where: {
            published: true
        }
    }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Users."
        });
    });
};