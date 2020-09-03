const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");
const app = express();

app.set("view engine", "ejs");
// remember this step to use body parser
app.use(bodyParser.urlencoded({extended: true}));
// include local css to work
app.use(express.static("public"));

// Create a new db in mongodb
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb+srv://Yuxin:yuxin@cluster0.bjnml.mongodb.net/todoListDB?retryWrites=true&w=majority", { useUnifiedTopology
: true });

// Insert data
const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);
const welcome = new Item ({
  name: "Welcome to your lists Cutie x"
});
const defaultItems = [welcome];

// Create new schema for the new list page
const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);


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

//dynamic routes
app.get("/:customName", function(req, res) {
  const customName = _.capitalize(req.params.customName);
  List.findOne({name: customName}, function(err, foundList) {
    if(!err) {
      if(!foundList){
        // create a new list
        const list = new List ({
          name: customName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customName);
      } else {
        // show existing list
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  });
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item ({
    name: itemName
  });

  if(listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today") {
    Item.deleteOne({_id: checkedItemId}, function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("Deleted x");
        res.redirect("/");
      };
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if(!err) {
        res.redirect("/" + listName);
      }
    });
  };
});

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000 x");
})
