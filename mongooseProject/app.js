// Get mongoose
const mongoose = require('mongoose');
// Connect to server
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost:27017/babyDB", { useUnifiedTopology
: true });

// Insert data
const fruitSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: [true, "no name specified"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  review: String
});
const Fruit = mongoose.model("Fruit", fruitSchema);
const fruit = new Fruit ({
  name: "Apple",
  rating: 9,
  review: "Cute."
});

//fruit.save();

// Fruit.insertMany([orange, blueberry, banana], function(err) {
//   if(err) {
//     console.log(err);
//   }else {
//     console.log("Fruits are inserted successfully!");
//   }
// });

// print all the JSON data
// Fruit.find(function(err, fruits){
//     if(err) {
//       console.log(err);
//     } else {
//       console.log(fruits);
//     }
// });

// print specified data
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

// delete records
Fruit.deleteOne({name: "blueberry"}, function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log("Successfully deleted.");
  };
});
