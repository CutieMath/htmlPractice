const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const homeStartingContent = "This is Cutie Math's Gratitude Journal.";
const aboutContent = "I started this GRATITUDE JOURNAL to practice web development use Node.js and EJS.";
const contactContent = "Cutie.Math@protonmail.com";
let posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res) {
  res.render("home", {
    homeContent: homeStartingContent,
    postContents: posts
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    about: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contact: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const title = req.body.title;
  const journal = req.body.journal;
  const post = {
    title: title,
    journal: journal
  };
  posts.push(post);
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
