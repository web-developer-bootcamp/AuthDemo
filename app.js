var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    localStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/user');

//db connection
mongoose.connect('mongodb://localhost/auth_demo_app', {useNewUrlParser: true});
var app = express();

//passport session
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');

app.use(require('express-session')({
    secret: 'Rusty is the best and cutest dog in the world',
    resave: false,
    saveUninitialized: false
}));

//home rendering 
app.get('', function (req, res) {
    res.render("home");
});

//secret page rendering
app.get('/secret', function (req, res) {
    res.render('secret');
});

//collemaneto server port
app.listen(3000, () => console.log('Express Server is running!'));