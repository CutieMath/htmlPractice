const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");

})

app.post("/", function(req, res) {
  const query = req.body.cityInputName
  const url = "https://api.openweathermap.org/data/2.5/weather?appid=8a8957157216d804cdf7214e4674fd2a&q=" + query + ",uk&units=metric"
  https.get(url, function(response){
    console.log(response.statusCode);
    response.on("data", function(data){
      const weatherData = JSON.parse(data)
      const temp = weatherData.main.temp
      const weather = weatherData.weather[0].description
      const icon = weatherData.weather[0].icon
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
      res.write("<h1>The weather in " + query + " is " + weather + "!<br>");
      res.write("The temperature is fucking " + temp + " degrees Celcius.</h1>");
      res.write("<img src=" + imageURL + ">");
      res.send()
    })
  })
})



app.listen(3000, function() {
  console.log("Server is running on port 3000.")
})
