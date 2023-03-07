const Message = require('../models/message');
const { body, validationResult } = require('express-validator');

exports.message_get = (req, res, next) => {
    res.render('message_form', {
        title: 'create message'
    })
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
]