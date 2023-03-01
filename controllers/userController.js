const User = require('../models/user');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');


exports.sign_up_get = (req, res, next) => {
    res.render("sign_up_form");
};

exports.sign_up_post = [
    // inputs sanitization
    body('first_name')
        .trim()
        .isLength({ min:2})
        .escape()
        .withMessage('First name is required')
        .isAlphanumeric()
        .withMessage('First name has non-alphanumeric characters'),
    body('last_name')
        .trim()
        .isLength({ min:2})
        .escape()
        .withMessage('Last name is required')
        .isAlphanumeric()
        .withMessage('Last name has non-alphanumeric characters'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Insert a valid email')
        //check if the email is already in the database
        .custom((value)=>{
            return User.findOne({email:value}).then(user => {
                if (user) {
                    return Promise.reject('Email already registered');
                }
            });
            // User.findOne({email:value}, (err,user)=>{
            //     if(user){
            //         console.log('kaka')
            //         return false;
            //         // throw new Error('Password confirmation does not match password');
            //     }
            // })
            // return true;
        }),
    body('password')
        .isLength({min:5})
        .withMessage('Password must be a least 5 characters long'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    (req, res, next)=>{
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            res.render("sign_up_form", {
                title: "Create author",
                user: req.body,
                errors: errors.mapped(),
            });
            return;
        }
        //if there is no errors then i hash the password and then stored it
        bcrypt.hash(req.body.password,10, (err, hash)=>{
            const user = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email.toLowerCase(),
                password: hash
            });
            user.save((err)=>{
                if(err){
                    return next(err);
                }
                res.redirect("/")
            })
        })


    }
];