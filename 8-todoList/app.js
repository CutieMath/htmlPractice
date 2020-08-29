const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");

const newItems = ["baby", "okie"];
const workItems = [];

app.set("view engine", "ejs");
// remember this step to use body parser
app.use(bodyParser.urlencoded({extended: true}));
// include local css to work
app.use(express.static("public"));

app.get("/", function(req, res) {
  const day = date.getDate();
  res.render("list", {
    listTitle: day,
    newListItems: newItems
  });
});

app.get("/work", function(req, res) {
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.post("/", function(req, res) {
  const item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    newItems.push(item);
    res.redirect("/");
  }
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000 x");
})
