const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const app = express();

const homeStartingContent = "This is Cutie Math's Gratitude Journal.";
const aboutContent = "I made this GRATITUDE JOURNAL to practice web development use Node.js and EJS.";
const contactContent = "Cutie.Math@protonmail.com";

app.set('view engine', 'ejs');
// use body parser
app.use(bodyParser.urlencoded({extended: true}));
// include local css
app.use(express.static("public"));

// create a new db in mongodb
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/blogDB', { useUnifiedTopology: true });

// Insert data
const postSchema = {
  title: String,
  content: String
};
const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res) {
  Post.find({}, function(err, foundPosts) {
    res.render("home", {
      homeContent: homeStartingContent,
      postContents: foundPosts
    });
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
  const postTitle = req.body.title;
  const journal = req.body.journal;

  // create a new post instance use user entered data
  const post = new Post({
    title: postTitle,
    content: journal
  });

  // save the post into database
  post.save(function(err) {
    if(!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {
  const postId = req.params.postId;


  Post.findOne({_id: postId}, function(err, foundPost){
    res.render("post", {
      title: foundPost.title,
      journal: foundPost.content
    })
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
