const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
// remember this step to use body parser
app.use(bodyParser.urlencoded({extended: true}));
// include local css to work
app.use(express.static("public"));

// Create a new db in mongodb
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost:27017/todoListDB", { useUnifiedTopology
: true });

// Insert data
const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);
const webDev = new Item ({
  name: "Web development Elite"
});
const appDev = new Item ({
  name: "App development Elite"
});
const cloudSecurity = new Item ({
  name: "Cloud Security Elite"
});
const defaultItems = [webDev, appDev, cloudSecurity];
Item.insertMany(defaultItems, function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log("Success!");
  }
});

// prepare data from the database
let aList = "";
let listArray = [];

Item.find({}, function(err, items) {
    if(err) {
      console.log(err);
    } else {
      items.forEach((item) => {
        aList = item.name;
        listArray.push(aList);
      });
    };
});

// render data from the database
app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {
    console.log(foundItems);
  });

  res.render("list", {
    listTitle: "Today",
    newListItems: listArray
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
