const express = require("express");
const bodyParser = require("body-parser");
const app = express();

let newItems = [];

app.set("view engine", "ejs");
// remember this step to use body parser
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  let today = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  let day = today.toLocaleDateString('ja-JP', options);
  res.render("list", {
    kindOfDay: day,
    newListItems: newItems
  });
});

app.post("/", function(req, res) {
  let newItem = req.body.newItem;
  newItems.push(newItem);
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000 x");
})
