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

// adding relationships
const peopleSchema = new mongoose.Schema ({
    name: String,
    age: Number,
    favouriteFruit: fruitSchema
});
const People = mongoose.model("People", peopleSchema);
const mango = new Fruit({
  name: "Mango",
  rating: 9,
  review: "Yuuuuum x"
})
mango.save();
// const people = new People({
//   name: "Yuxin",
//   age: 30,
//   favouriteFruit: apple
// });
// people.save();

// add relationships to one record
People.updateOne({name: "Baby"}, {favouriteFruit: mango}, function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log("Success!");
  }
});


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
// Fruit.deleteOne({name: "blueberry"}, function(err) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log("Successfully deleted.");
//   };
// });
