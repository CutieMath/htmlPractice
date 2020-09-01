// Get mongoose
const mongoose = require('mongoose');
// Connect to server
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost:27017/babyDB", { useUnifiedTopology
: true });

// Insert data
const fruitSchema = new mongoose.Schema ({
  name: String,
  rating: Number,
  review: String
});
const Fruit = mongoose.model("Fruit", fruitSchema);
const orange = new Fruit ({
  name: "Orange",
  rating: 10,
  review: "Cute."
});
const blueberry = new Fruit ({
  name: "blueberry",
  score: 10,
  review: "Vitamin C"
});
const banana = new Fruit ({
  name: "banana",
  score: 10,
  review: "Yummy!"
});

// Fruit.insertMany([orange, blueberry, banana], function(err) {
//   if(err) {
//     console.log(err);
//   }else {
//     console.log("Fruits are inserted successfully!");
//   }
// });

// print all the JSON data
Fruit.find(function(err, fruits){
    if(err) {
      console.log(err);
    } else {
      console.log(fruits);
    }
});

// print specifict data
Fruit.find(function(err, fruits) {
  if(err) {
    console.log(err);
  } else {
    // close the connection
    mongoose.connection.close();
    fruits.forEach((fruit) => {
      console.log(fruit.name);
    });
  };
});
