var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var start = false;
var level = 0;

// When a keyboard key has been pressed, invoke nextSequence
$(document).keypress(function(){
  if(!start) {
    $("#level-title").text("Level  " + level);
    nextSequence();
    started = true;
  }
});


// Check which button is pressed
$(".btn").click(function() {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  // play the sounds
  playSound(userChosenColour);
  // add color to pressed button
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length-1);
});

function checkAnswer(currentLevel) {
  if(gamePattern[currentLevel] === userClickedPattern[currentLevel]) {

    console.log("success");

    if(userClickedPattern.length === gamePattern.length) {
      setTimeout(function() {
        nextSequence();
      }, 1000);
    }

  } else {
    console.log("wrong");
    playSound("wrong");
    // change background
    $("body").addClass("game-over");
    setTimeout(function() {
      $("body").removeClass("game-over");
    }, 200);
    // change title
    $("#level-title").html("Game Over<br><br>Press Any Key To Restart");
    startOver();
  }
}

function nextSequence() {
  userClickedPattern = [];
  level ++;
  $("#level-title").text("Level  " + level);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // animate flash
  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

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

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}
