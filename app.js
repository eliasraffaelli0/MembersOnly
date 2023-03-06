const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user')
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const dotenv = require('dotenv');
dotenv.config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const signUpRouter = require('./routes/sign-up');
// const { default: mongoose } = require('mongoose');

const app = express();

//set up moongoose connection
const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clustermembersonly.kmqwfyu.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true});
const db = mongoose.connection;
db.on("error", console.error.bind('mongo connection error'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//import routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/sign-up', signUpRouter);

app.use(flash());
app.use(session({secret: 'members', resave: false, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passport login
passport.use(
  new LocalStrategy((username, password, done)=>{
    User.findOne( {email: username }, (err,user)=>{
      if(err){
        return next(err);
      };

      if(!user){
        return done(null, false, {message: 'incorrect username or password'});
      };

      bcrypt.compare(password, user.password,(err, result)=>{
        if(result){
          return done(null, user);
        } else {
          return done(null, false, {message: 'incorrect username or password'});
        }
      })
    })
  })
);

passport.serializeUser((user,done)=>{
  done(null, user.id);
});

passport.deserializeUser((id,done)=>{
  User.findById(id, (err, user)=>{
    done(err,user);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
