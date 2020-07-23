var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];

// Check which button is pressed
$(".btn").click(function() {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  // play the sounds
  playSound(userChosenColour);
  // add color to pressed button
  animatePress(userChosenColour);

});

function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // animate flash
  $("#" + randomChosenColour).fadeOut(100).fadeIn(100);

  // play sound
  playSound(randomChosenColour);
}

function playSound(name) {
  // play sound on click
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");
    setTimeout(function() {
      $("#" + currentColour).removeClass("pressed");
    }, 150);
    console.log(currentColour);

}
