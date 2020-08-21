const express = require("express");
const https = require("https");
const app = express();

app.get("/", function(req, res) {
  const url = "https://api.openweathermap.org/data/2.5/weather?appid=8a8957157216d804cdf7214e4674fd2a&q=London,uk&units=metric"
  https.get(url, function(response){
    console.log(response.statusCode);
    response.on("data", function(data){
      const weatherData = JSON.parse(data)
      const temp = weatherData.weather[0].description
      console.log(temp);
    })
  })
  res.send("Server is up and running")
})

app.listen(3000, function() {
  console.log("Server is running on port 3000.")
})
