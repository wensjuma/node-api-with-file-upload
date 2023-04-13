
const db = require("../models"); // models path depend on your structure
const loanProduct = db.loanProduct;
const constructResponse = require('../helpers/_responseHelper')

exports.create = async (req, res) => {
    // Validate request
    console.log(req);
    if (!req.body.product_name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const newLoanProduct = {
        product_name: req.body.product_name,
        interest_rate: req.body.interest_rate,
        processing_fee: req.body.processing_fee,
        product_code: req.body.product_code,
        min_period: req.body.min_period,
        max_period: req.body.max_period,
        penalty_rate: req.body.penalty_rate
    };
    loanProduct.create(newLoanProduct)
        .then(data => {
            res.send(constructResponse.constructSuccessResponse(data))
        })
        .catch(err => {
            res.send(constructResponse.constructException(err));
        });
};

exports.findAll = async (req, res) => {
    try {
        const title = req.query.title;
        let condition = title ? {
            title: {
                [Op.like]: `%${title}%`
            }
        } : null;
        let loanProducts = await loanProduct.findAll({
            // where: condition
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Product."
            });
        });
        if (loanProducts) {
            res.send(await constructResponse.constructSuccessResponse(loanProducts));
        }
    } catch (error) {
        res.send(await constructResponse.constructException(error));
    }

};

exports.findOne = (req, res) => {
    const id = req.params.id;

    loanProduct.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Product with id=" + id
            });
        });
};
exports.update = (req, res) => {
    try {
        const id = req.body.id;
        loanProduct.update(req.body, {
            where: {
                id: id
            }
        }).then(num => {
            if (num == 1) {
                res.status(200).send(constructResponse.constructFailedResponse());
            } else {
                res.send({
                    message: `Cannot update loanProduct with id=${id}. Maybe loanProduct was not found or req.body is empty!`
                });
            }
        })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating loanProduct with id=" + id
                });
            });
    } catch (error) {
        res.status(500).send({
            message: "Processing failed while creating Loan Product",
            resp_code: "02"
        });
    }
};
exports.delete = (req, res) => {
    const id = req.params.id;
    loanProduct.destroy({
        where: {
            id: id
        }
    })
        .then(num => {
            if (num == 1) {
                let message = "loanProduct was deleted successfully!"
                res.send(constructResponse.constructFailedResponse(message));
            } else {
                res.send({
                    message: `Cannot delete loanProduct with id=${id}. Maybe loanProduct was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete loanProduct with id=" + id
            });
        });
};
exports.deleteAll = (req, res) => {
    loanProduct.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} loanProduct were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all loanProduct."
            });
        });
};