const db = require("../models");
const moment = require('moment');
const { token } = require("morgan");
const Loan = db.loans;
const request = require('../helpers/global.requests');
const constructResponse = require('../helpers/_responseHelper')
const { default: axios } = require("axios");
var shortid = require('shortid');

daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
}

exports.applyLoan = async (req, res) => {
    console.log("CurrentUSER ==>", user);
    /**Count days in the month to determine duration */
    let today = new Date();
    let month = today.getMonth();
    let daysInCurrentMonth = daysInMonth(month + 1, today.getFullYear());
    try {
        let limitApplied = user.loan_limit.filter(item => item.limit_status === 1);
        if (!req.body.applicant_id) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        } else if (Number(req.body.loan_amount) <= Number(limitApplied[0]['limit_amount']) && req.body.created_by === user.email_address) {
            let loanExisting = await Loan.findAll({ where: { applied_by: req.body.created_by } })

            if (loanExisting.filter(item => item.loan_balance > 0).length <= 0) {
                let duration = '1';
                const loan_application = {
                    transaction_type: req.body.loan_product,
                    loan_fee: req.body.loan_fee,
                    amount: req.body.loan_amount,
                    loan_balance: req.body.loan_amount,
                    penalties: req.body.upfront_amount,
                    duration_days: duration,
                    "applicant_id": req.body.applicant_id,
                    "applied_by": req.body.created_by,
                    "interest_rate": 0,
                    "disbursement_status": '0',
                    "loan_repayment_status": 0,
                    "phone_number": user.mobile_number,
                    "disbursement_account": user.mobile_number,
                    due_on: moment(new Date(), '').add(Number(duration) * daysInCurrentMonth, 'days').format('YYYY-MM-DD,HH:mm'),
                    loan_purpose: req.body.loan_purpose
                };
                // console.log(loan_application);
                let appliedLoan = await Loan.create(loan_application)
                    .catch(err => {
                        res.send({
                            message: err.message || "Some error occurred while applying loan."
                        });
                    });
                // console.log("APPLIEDLOAN", appliedLoan);
                if (appliedLoan) {
                    let forwardedLoanRequest = {
                        "sendernames": null,
                        "currencycode": "KES",
                        "timestamp": appliedLoan.createdAt,
                        "transactionid": 'TXN' + shortid.generate(5).toUpperCase(), //"E1CUXKNZB", 
                        "accountno": appliedLoan.phone_number,
                        "amount": appliedLoan.amount,
                        "msisdn": "0716735875",
                        "serviceid": "6125",
                        "payload": {
                            "shortcode": "511382"
                        }
                    }
                    let updateTxns = {
                        transaction_code: forwardedLoanRequest.transactionid
                    }
                    await Loan.update(updateTxns, { where: { id: appliedLoan.id } });
                    let loanAppliedResponse = await request.externalRequest('request/postRequest', forwardedLoanRequest);
                    if (loanAppliedResponse.data.status === '00') {
                        //SEND SMS
                        let smsRequestBody = {
                            to: '254705319216',
                            message: "Dear Employee, Your application has been disbursed! You will receive an MPESA confirmation"
                        }
                        let smsResp = await request.sendSMSRequest('pgsms/send', smsRequestBody);
                        console.log(smsResp);
                        if (smsResp) {
                            res.status(200).send({
                                message: "Loan application was sucessful, Please wait for a MPESA confirmation message"
                            })
                        }
                    } else {
                        res.send({
                            resp_message: loanAppliedResponse.data.statusDescription,
                            resp_code: loanAppliedResponse.data.status
                        })
                    }
                }
            } else {
                let  message = "You have a running loan balance, Please clear loan to make a new application";
                res.send(await constructResponse.constructFailedResponse(message));
            }
        } else {
            let message =  "Your account can't access this loan now, contact your admin"
            res.send(await constructResponse.constructFailedResponse(message));
        }
    } catch (error) {
        res.send(await constructResponse.constructException(appliedLoans));

    }
};
exports.repayLoan = async (req, res) => {
    console.log(req.body);
    //  const repayLoanRequest = await Loan.
}

exports.findAll = async (req, res) => {

    try {
        let appliedLoans = await Loan.findAll();
        console.log('APPLIED LOAN', appliedLoans);
        if (appliedLoans) {
            res.status(200).send(await constructResponse.constructSuccessResponse(appliedLoans));
        }
    } catch (error) {
       res.send(await constructResponse.constructException(error))
    }

}
exports.findIndividualLoans = async (req, res) => {
    try {
        let appliedLoans = await Loan.findAll({
            where: {
                applied_by: req.body.applied_by
            }
        });
        if (appliedLoans) {
            res.status(200).send(await constructResponse.constructSuccessResponse(appliedLoans));
        }
    } catch (error) {
        res.send(await constructResponse.constructException(error))
    }
}
