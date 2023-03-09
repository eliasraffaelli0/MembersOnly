const User = require('../models/user');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');

//sign up controllers
exports.sign_up_get = (req, res, next) => {
    if(req.user){
        res.redirect("/")
    } else {
        res.render("sign_up_form");
    }
};

exports.sign_up_post = [
    // inputs sanitization
    body('first_name')
        .trim()
        .isLength({ min:2})
        .escape()
        .withMessage('El nombre es obligatorio')
        .isAlphanumeric()
        .withMessage('El nombre tiene caracteres no alphanumericos'),
    body('last_name')
        .trim()
        .isLength({ min:2})
        .escape()
        .withMessage('El apellido es obligatorio')
        .isAlphanumeric()
        .withMessage('El apellido tien caracteres no alphanumericos'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Ingrese un mail valido')
        //check if the email is already in the database
        .custom((value)=>{
            return User.findOne({email:value}).then(user => {
                if (user) {
                    return Promise.reject('El mail ya se encuentra registrado');
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
        .withMessage('La contraseña debe tener al menos 5 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no coinciden');
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

//login controllers
exports.login_get = (req, res, next) => {
    if(req.user){
        res.redirect("/")
    } else {
        res.render("login_form", {messages: req.session.messages});
    }
};

exports.login_post = passport.authenticate('local',  {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true
});

exports.logout_get = (req, res, next) => {
    req.logout();
    res.redirect("/");
};