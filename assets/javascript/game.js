/*
---------------------------------------------------------------------------
Star Wars RPG Game
---------------------------------------------------------------------------
*/

let numAttacks = 0;
let player = null;
let enemy = null;

$(document).ready(function () {
  $(".char-box").on("click", function () {
    console.log($(this).attr("id") + " is clicked on");
    console.log("parent: " + $(this).parent().attr("id"));

    if ($(this).parent().attr("id") === 'initial-row') {
      player = $(this);
      $(this).addClass("char-box-you");
      $(this).appendTo("#you");
      $("#initial-row > .char-box").addClass("char-box-enemy");
      $("#initial-row > .char-box").appendTo("#enemy-section");
    } else if ($(this).parent().attr("id") === 'enemy-section') {
      if (!enemy) {
        console.log("Enemy " + $(this).attr("id") + " is selected");
        enemy = $(this);
        $(this).addClass("char-box-defender");
        $(this).appendTo("#defender-section");
      }
    } else if ($(this).parent().attr("id") === 'defender-section') {
      console.log("Enemy " + $(this).attr("id") + " is selected in the defender-section");
      $(this).removeClass("char-box-defender");
      $(this).addClass("char-box-enemy");
      $(this).appendTo("#enemy-section");
    }
  });

  $("#attack").click(function () {
    numAttacks++;
    if (numAttacks > 3) {
      console.log("clicked " + numAttacks + " times");
      console.log("player " + player.attr("id"));
      console.log("enemy " + enemy.attr("id"));
      $("#msg1").text("player " + player.attr("id") + "   clicked " + numAttacks + " times");
      $("#msg2").text("enemy " + enemy.attr("id"));

      if (numAttacks === 4) {
        enemy.detach();
        enemy = null;
        numAttacks = 0;
      }
    }
  });

  $("#start").click(function () {
    start();
  });
});

function start() {
  numAttacks = 0;
  player = null;
  enemy = null;

  $("#initial-row").children().map(function () {
    console.log("Children " + this.attr("id"));
  });
  location.reload();
} 