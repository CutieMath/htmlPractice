const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

// setup ejs
app.set('view engine', 'ejs');
// setup body parser
app.use(bodyParser.urlencoded({extended: true}));
// allow local css
app.use(express.static("public"));

// connect mongodb
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/wikiDB', { useUnifiedTopology: true });

// setup db collections
const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);


// Requests targeting all articles
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles){
      if(!err){
          res.send(foundArticles);
      } else {
          res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err) {
      if(!err){
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err){
        if(!err){
          res.send("Successfully deleted everything.");
        } else {
          res.send(err);
        }
     });
   });


// Requests targeting a specific article
app.route("/articles/:articleTitle")
  // receive an article
  .get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if(foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching the title was found.");
      }
    });
  })
  // change an entry
  .put(function(req, res) {
    Article.update({title: req.params.articleTitle}, {title: req.body.title, content: req.body.content}, {overwrite: true},
                   function(err, results) {
                      if(!err) {
                        res.send("Successfully updated article.");
                      }
                   });
  })
  // change a specific value within an entry
  // this step can also be dynamic (use req.body)
  .patch(function(req, res) {
    Article.update({title: req.params.articleTitle}, {$set: req.body}, function(err){
      if(!err) {
        res.send("Successfully updated record.")
      } else {
        res.send(err);
      }
    });
  })
  // delete a specific article
  .delete(function(req, res) {
    Article.deleteOne({title: req.params.articleTitle}, function(err) {
      if(!err) {
        res.send("Successfully deleted the article.");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function() {
  console.log("Server started on port 3000 x");
});
