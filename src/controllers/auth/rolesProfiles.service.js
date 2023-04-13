
const db = require('../../models')
const Role = db.roles;
const Profile = db.profiles;
const RolesInProfile = db.rolesInProfiles;
const userProfile = db.userProfile;
const constructResponse = require('../../helpers/_responseHelper');
const { rolesInProfiles, sequelize } = require('../../models');


exports.addProfiles = async (req, res) => {
    try {
        let item = req.body;
        let model = {
            profile_name: item.profile_name,
            created_by: "admin", //user['username']
            status: item.status,
            description: item.description
        }
        let createResults = await Profile.create(model);
        if (createResults) {
            res.send(await constructResponse.constructSuccessResponse(createResults));
        }
    } catch (error) {
        res.send(await constructResponse.constructException(error));
    }
}
exports.getAllProfiles = async (req, res) => {
    try {
        const title = req.query.title;
        let condition = title ? {
            title: {
                [Op.like]: `%${title}%`
            }
        } : null;
        let profiles = await Profile.findAll({
            // where: condition
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Product."
            });
        });
        if (profiles) {
            res.send(await constructResponse.constructSuccessResponse(profiles));
        }
    } catch (error) {
        res.send(await constructResponse.constructException(error));
    }

};

exports.getProfile = (req, res) => {
    const id = req.params.id;

    Profile.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Product with id=" + id
            });
        });
};
exports.updateProfile = (req, res) => {
    try {
        const id = req.body.id;
        Profile.update(req.body, {
            where: {
                id: id
            }
        }).then(num => {
            if (num == 1) {
                res.status(200).send(constructResponse.constructFailedResponse());
            } else {
                res.send({
                    message: `Cannot update Profile with id=${id}. Maybe Profile was not found or request is empty!`
                });
            }
        })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating Profile with id=" + id
                });
            });
    } catch (error) {
        res.status(500).send({
            message: "Processing failed while creating Profile",
            resp_code: "02"
        });
    }
};
exports.deleteProfile = (req, res) => {
    const id = req.body.id;
    Profile.destroy({
        where: {
            id: id
        }
    })
        .then(num => {
            if (num == 1) {
                let message = "Profile was deleted successfully!"
                res.send(constructResponse.constructFailedResponse(message));
            } else {
                res.send({
                    message: `Cannot delete Profile with id=${id}. Maybe Profile was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Profile with id=" + id
            });
        });
};
exports.deleteAll = async (req, res) => {
    Profile.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} Profile were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Profile."
            });
        });
};
exports.assignRoles = async (req, res) => {
    let item = req.body
    try {
        let modelInsert = item.roles.map(element => {
            return {
                profile_id: item.profile_id,
                role_id: element.role_id,
                created_by: "admin",
                status: 1
            }
        })

        let assignedRoles = await rolesInProfiles.bulkCreate(modelInsert)
            .catch((err) => {
                res.send({
                    resp_code: "01",
                    message: err.message
                })
            })
        if (assignedRoles) {
            console.log("assignedRoles.............", assignedRoles);
            res.send(await constructResponse.constructSuccessResponse())
        }
    } catch (error) {
        res.send(await constructResponse.constructException(error))
    }
}
exports.addRoles = async (req, res) => {
    try {
        let item = req.body;
        let model = {
            role_name: item.role_name,
            created_by: "admin", //user['username']
            status: item.status,
            description: item.description
        }
        let createResults = await Role.create(model);
        if (createResults) {
            res.send(await constructResponse.constructSuccessResponse(createResults));
        }
    } catch (error) {
        res.send(await constructResponse.constructException(error));
    }
}

/**UNTESTED */
exports.assignUserProfile = async (req, res) => {
    try {
        let itemRequest = req.body;
        let model = {
            is_active: itemRequest.status,
            created_by: "admin",
            user_email: itemRequest.user_email,
            profile_id: itemRequest.profile_id
        }
        let assignedProfile = await userProfile.create(model).catch(error => {
            req.send({
                resp_code: '01',
                resp_message: error.message
            })
        })
        if (assignedProfile) {
            res.send(await await constructResponse.constructSuccessResponse());
        }
    } catch (error) {
        res.send(await constructResponse.constructException(error))
    }
}
/**tests filed  */
exports.getRolesInProfile = async (req, res) => {
    RolesInProfile.findAll(
        {
            include: [
                {
                    model: Role,
                    as: 'roles'
                }
            ]
        }
    ).then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Staffs."
            });
        });
}
exports.getUsersInProfile = async (req, res) => {
   try {
    const profileId = req.body.profile_id;
    const result = await sequelize.query(`SELECT U.email,U.username, U.other_names, U.national_id, U.phone_number, U.account_status, PR.profile_name from sys_users U JOIN tb_user_profiles UP ON U.email = UP.user_email JOIN tb_profiles PR  WHERE PR.id=1`) //inner join tb_profiles PR ON UP.profile_id= ${profileId}`);
    if (result) {
        res.send({
            data: result,
            resp_code: '00'
        })
    }
   } catch (error) {
    res.send({
        data: error,
        resp_code: '01'
    })
   }
}