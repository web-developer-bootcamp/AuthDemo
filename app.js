var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    localStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/user');

//db connection
mongoose.connect('mongodb://localhost:27017/auth_demo_app', { useNewUrlParser: true });
var app = express();

//passport session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

app.use(require('express-session')({
    secret: 'Rusty is the best and cutest dog in the world',
    resave: false,
    saveUninitialized: false
}));

//home rendering 
app.get('/', function (req, res) {
    res.render("home");
});

//secret page rendering
app.get('/secret', isLoggedIn, function (req, res) {
    res.render('secret');
});

//register page rendering
app.get('/register', function (req, res) {
    res.render('register');
});

//register post method
app.post('/register', function (req, res) {
    //var user = req.body.username;
    //var pwd = req.body.password;
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        }

        //passport init
        passport.authenticate('local')(req, res, function () {
            res.redirect('/secret');
        });
    });
});

//login routes
app.get('/login', function (req, res) {
    res.render('login');
});

//login logic
app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), function (req, res) {

});

//logout routes
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

//collemaneto server port
app.listen(3000, () => console.log('Express Server is running!'));