const User = require('../models/user');
const {body, validationResult} = require('express-validator');

exports.sign_up_get = (req, res, next) => {
    res.render("sign_up_form");
};

exports.sign_up_post = [
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
        .isEmail(),
        body('password')
        .isLength({ min:5 }),
    body('password')
        .isLength({min:5}),
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
                errors: errors.array(),
            });
            return;
        }

        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password
        });
        user.save((err)=>{
            if(err){
                return next(err);
            }
            res.redirect("/")
        })
    }
];