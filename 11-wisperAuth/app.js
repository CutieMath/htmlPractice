const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

// setup ejs
app.set("view engine", "ejs");
// set up body parser
app.use(bodyParser.urlencoded({extended: true}));
// allow local css
app.use(express.static("public"));


app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});


app.listen(3000, function() {
  console.log("Server started on port 3000 x")
});
