const db = require("../models"); // models path depend on your structure
const Corporate = db.corporates;
const readXlsxFile = require("read-excel-file/node");
// const excel = require("exceljs");

exports.create = (req, res) => {
    // Validate request
    console.log(req);
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const corporate = {
        // staff_id: req.body.staff_id,
        name: req.body.name,
        reg_no: req.body.reg_no,
        phone: req.body.phone,
        email: req.body.email,
        account_no: req.body.account_no,
        kra_pin: req.body.kra_pin,
        branch: req.body.branch
        // published: req.body.published ? req.body.published : false
    };
    // Save Corporate in the database
    Corporate.create(corporate)
        .then(data => {
            res.send({
                data: data,
                resp_message: "Record created successfully",
                resp_code: '00'
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Corporate."
            });
        });
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? {
        title: {
            [Op.like]: `%${title}%`
        }
    } : null;
    Corporate.findAll({
        where: condition
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Corporate."
            });
        });
};

exports.findOne = (req, res) => {
 try {
    const id = req.body.id;

    Corporate.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Corporate with id=" + id
            });
        });
 } catch (error) {
     res.send({
         resp_message: error.message
     })
 }
};
exports.update = (req, res) => {
    const id = req.body.id;
    Corporate.update(req.body, {
        where: {
            id: id
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Corporate was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Corporate with id=${id}. Maybe Corporate was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Corporate with id=" + id
            });
        });
};
exports.delete = (req, res) => {
    const id = req.body.id;
    Corporate.destroy({
        where: {
            id: id
        }
    }).then(num => {
            if (num == 1) {
                res.send({
                    message: "Corporate was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Corporate with id=${id}. Maybe Corporate was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Corporate with id=" + id
            });
        });
};
exports.deleteAll = (req, res) => {
    Corporate.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} Corporate were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Corporate."
            });
        });
};
exports.findAllPublished = (req, res) => {
    Corporate.findAll({
        where: {
            published: true
        }
    }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Corporate."
        });
    });
};
exports.uploadEmployee = async(req, res) => {
    console.log(req.body);
    try {
        if (req.file == undefined) {
            return res.status(400).send("Please upload an excel file!");
        }
        let path = __basedir + "/resources/static/assets/uploads/" + req.file.filename;
        readXlsxFile(path).then((rows) => {
            // skip header
            rows.shift();
            let corporatesList = [];
            rows.forEach((row) => {
                console.log(row);
                let corporates = {
                    name: row[0],
                    reg_no: row[1],
                    phone: row[2],
                    email: row[3],
                    account_no: row[4],
                    kra_pin: row[5],
                    branch: row[6]
                };
                corporatesList.push(corporates);
            });
            // console.log(employeesList)
            Corporate.bulkCreate(corporatesList)
                .then(() => {
                    res.status(200).send({
                        message: "Uploaded the file successfully: " + req.file.originalname,
                    });
                })
                .catch((error) => {
                    res.status(500).send({
                        message: "Fail to import data into database!",
                        error: error.message,
                    });
                });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
}