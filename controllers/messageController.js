const Message = require('../models/message');
const { body, validationResult } = require('express-validator');

exports.message_create_get = (req, res, next) => {
    if(req.user){
        res.render('message_form', {
            title: 'create message'
        });
    } else {
        res.redirect('login');
    }
}

exports.message_post = [
    //inputs sanitization
    body('title')
        .trim()
        .isLength({min:2})
        .withMessage('Title is required'),
    body('text')
        .trim()
        .isLength({min:2})
        .withMessage('Text is required'),
    (req,res,next)=>{
        const errors = validationResult(req);
        
        const message = new Message({
            title: req.body.title,
            text: req.body.text,
            author: req.user._id
        })

        if(!errors.isEmpty()){
            res.render('message_form',{
                title: 'create message',
                message: message,
                errors: errors.mapped()
            });
            return;
        }

        message.save((err)=>{
            if(err){
                return next(err);
            }
            res.redirect('/');
        })

    }
];

exports.messages_get = (req, res, next) => {
    Message.find({})
        .sort({date:1})
        .populate("author")
        .exec((err, list_messages)=>{
            if(err){
                return next(err);
            }

            res.render("index", {
                title: 'express',
                messages: list_messages,
            });
        });
}