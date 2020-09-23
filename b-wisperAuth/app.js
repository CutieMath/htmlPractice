require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');


const app = express();

// setup ejs
app.set("view engine", "ejs");
// set up body parser
app.use(bodyParser.urlencoded({extended: true}));
// allow local css
app.use(express.static("public"));

app.use(session({
  secret: "a long sentence",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true });

// set up userDB
// add mongoose schema for encryption
const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
  secret: String
});
// This can encrypt and salt user data
userSchema.plugin(passportLocalMongoose);
// add the findOrCreate plugin
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);

// add cookies and destroy them
passport.use(User.createStrategy());
// add new configuration for local serialize
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Google oauth20
passport.use(new GoogleStrategy ({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  // retrive user info not from google+ but from docs
  // because google+ is deprecated!
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id }, function(err, user) {
    return cb(err, user);
  });
}
));


// Facebook
// passport.use(new FacebookStrategy ({
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: "http://localhost:3000/auth/facebook/secrets"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     User.findOrCreate({ facebookId: profile.id }, function(err, user) {
//       if (err) { return done(err); }
//       done(null, user);
//     });
//   }
// ));


app.get("/", function(req, res) {
  res.render("home");
});

// auth routes for google
app.get("/auth/google", passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
        passport.authenticate('google', { failureRedirect: "/login" }),
        function(req, res) {
          res.redirect('/secrets');
        });

// auth routes for facebook
// app.get('/auth/facebook', passport.authenticate('facebook')
// );
//
// app.get('/auth/facebook/secrets',
//   passport.authenticate('facebook', { successRedirect: '/',
//                                       failureRedirect: '/login' })
//                                     );


app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  User.register({username:req.body.username}, req.body.password, function(err, user){
    if(err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect('/secrets');
      });
    }
  });
});

// if people have already logged in, they can go to secret page directly
// Also add other secrets
app.get("/secrets", function(req, res){
  // find where the secrets are not null
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if(err) {
      console.log(err);
    } else {
      if(foundUsers) {
        res.render("secrets", {usersWithSecrets: foundUsers});
      }else {
        console.log("Didn't find users");
      }
    }
  });
});

// implement submit secrets
app.get("/submit", function(req, res){
  if(req.isAuthenticated()){
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", function(req, res){
  // get the request by its name
  const submitted = req.body.secret;
  User.findById(req.user.id, function(err, foundUser){
      if(err){
        console.log(err);
      } else {
        if(foundUser) {
          foundUser.secret = submitted;
          foundUser.save(function(){
            res.redirect("/secrets");
          });
        }
      }
  });
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err){
    if(err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000 x")
});
