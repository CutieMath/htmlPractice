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


// render data from the database
app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {
    if(foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("Default data inserted success!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today", newListItems: foundItems
      });
    }
  });
});

app.get("/work", function(req, res) {
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const item = new Item ({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  Item.deleteOne({_id: checkedItemId}, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("Deleted x");
      res.redirect("/");
    };
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000 x");
})
