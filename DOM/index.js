// settings for the first dice
var randomNumberOne = Math.floor(Math.random() * 6) + 1;
// set the dice image name
var randomDiceImg = "dice" + randomNumberOne + ".png";
var imgSrc = "images/" + randomDiceImg;
// get the image we want to change
var imageOne = document.querySelectorAll("img")[0];
imageOne.setAttribute("src", imgSrc);

// settings for the second dice
var randomNumTwo = Math.floor(Math.random() * 6) + 1;
// choose the dice img name
var randomImgTwo = "images/dice" + randomNumTwo + ".png";
// choose the elements to change it
var imageTwo = document.querySelectorAll("img")[1];
imageTwo.setAttribute("src", randomImgTwo);

// Change the title based on random number
if(randomNumberOne === randomNumTwo) {
  document.querySelector("h1").innerHTML = "🧚‍♀️ Refresh again!";
}
else if (randomNumberOne > randomNumTwo) {
  document.querySelector("h1").innerHTML = "😈 Player 1 wins!";
}
else {
  document.querySelector("h1").innerHTML = "Player 2 wins! 🥵";
}
