
"use strict";
const db = require("../../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const jwt_decode = require('jwt-decode');

// const loanApplication = require('../../models/loans.model');
dotenv.config();
const User = db.users;
const Staff = db.staff;
const LoanLimits = db.loansLimits;

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        console.log(req.body);
        if (user) {
            const password_valid = await bcrypt.compare(req.body.password, user.password);
            // let user_type = req.body.user_type;
            // && user_type === user.user_type
          if(user.active == '1'){
            if (password_valid ) {
                let token = jwt.sign({
                    "id": user.sys_user_id,
                    "email": user.email,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "user_type": user.user_type
                }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({
                    "token": token,
                    "resp_message": "Login successful",
                    "resp_code": "00"
                });
            } else {
                res.send({ 
                    resp_message: "Password Incorrect!" ,
                    resp_code:'05'
                });
            }
          }else{
            res.send({ 
                resp_message: "User account inactive!" ,
                resp_code:'03'
            });
          }

        } else {
            res.send(
                { resp_message: "User does not exist" ,
                resp_code:'01'
            });
        }

    } catch (error) {
        res.send({
            resp_code: '02',
            resp_message: error.message
        });
    }
}
exports.staffLogin = async (req, res) => {
    //    console.log(req.body);
    try {
        const staff = await Staff.findOne({
            include: [{ model: LoanLimits, as: 'limits' }],
            where: { email_address: req.body.email }
        });
        // console.log(staff);
        if (staff) {
            global.staffToken = staff;
            // const password_valid = await bcrypt.compare(req.body.password, staff.password);
            if (req.body.password === staff.password) {
                token = jwt.sign({
                    "id": staff['id'],
                    "staff_id": staff['staff_id'],
                    "first_name": staff['first_name'],
                    "last_name": staff['last_name'],
                    "middle_name": staff['middle_name'],
                    "email_address": staff['email_address'],
                    "mobile_number": staff['mobile_number'],
                    "loan_limit": staff['limits'],
                    "status": staff['status']
                }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({
                    "token": token,
                    "resp_message": "Client Login successful",
                    "resp_code": "00"
                });
            } else {
                res.status(400).json({ error: "Incorrect Email or Password" });
            }

        } else {
            res.status(404).json({ error: "Incorrect Email or Password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.authorizeRequest = (req, res, next) => {
    // console.log(req?.headers['authorization'].split(' ')[1]);
    console.log('AUTH TOKEN ....0000',req.headers['authorization'] );
    try {
        if(!req.headers['authorization']){
            res.status(400).json({ resp_message: "No authentication token provided!" });
        }
        else{
            let token = req.headers['authorization'].split(' ')[1];
            jwt.decode()
            global.token = jwt_decode(token);
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    res.status(401).json({ resp_message:'Unauthorized access, '+ err.message });
                } else {
                    req.user = user;
                    global.user = user;
                    next();
                }
            })
        }
    } catch (error) {
        res.send({
            resp_message: "Could not process request, " + error.message,
            resp_code: '01'
        })
    }
}
exports.resetPasswordRequest = async (req, res) => {
   
    try {
        let email = req.body.email
        let currentPassword = req.body.current_password
        let user = await User.findOne({ where: { email: email } });
        const password_valid = await bcrypt.compare(currentPassword, user.password);
        if (password_valid) {
            let password = {
                password: await bcrypt.hash(req.body.new_password, salt)
            }
            User.update(password, { where: { email: email } })
                .then(resp => {
                    res.status(200).send({
                        resp_code: '00',
                        message: "password reset successful"
                    })
                })
        } else {
            res.status(401).send({
                resp_code: '01',
                message: "Your current password is incorrect!"
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}
exports.checkValidApplicant = (req, res, next) => {
    console.log(user);
}