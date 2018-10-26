/*
---------------------------------------------------------------------------
Star Wars RPG Game
---------------------------------------------------------------------------
*/

//
// Start listening to events
//
function run() {
  $(".char-box").click(setupFight);
  $("#attack").click(fight);
  $("#start").hide();
  $("#start").click(start);
}

let game = {
  player: null, // player's character name
  enemy: null, // enemy's character name
  attacker: null,
  defender: null,
  numAttacks: 0, // the number of attacks
}

//
// (re-)start the game
//
function start() {
  game.player = null;
  game.enemy = null;
  game.attacker = null;
  game.defender = null;
  game.numAttacks = 0;

  location.reload();
}

//
// fight setup through a user character selections 
//
function setupFight(event) {
  let section_name = $(this).parent().attr("id");
  console.log($(this).attr("id") + " is clicked on");
  console.log("parent: " + $(this).parent().attr("id"));

  // All character boxes are at top initially  
  if (section_name === 'initial-row') {
    game.player = $(this).attr("id");
    console.log("You: " + $(this).attr("id") + " is selected");
    $(this).addClass("char-box-you");
    $(this).appendTo("#you");
    $("#initial-row > .char-box").addClass("char-box-enemy");
    $("#initial-row > .char-box").appendTo("#enemy-section");
  }
  // Character elements in the Enemy section
  else if (section_name === 'enemy-section') {
    if (!game.enemy) {
      game.enemy = $(this).attr("id");
      console.log("Enemy " + $(this).attr("id") + " is selected");
      $(this).addClass("char-box-defender");
      $(this).appendTo("#defender-section");
      clearMsg();
    }
  }
  // user can move the enemy defender back to the Enemy section
  else if (section_name === 'defender-section') {
    console.log("Enemy " + $(this).attr("id") + " is removed from the defender-section");
    $(this).removeClass("char-box-defender");
    $(this).addClass("char-box-enemy");
    $(this).appendTo("#enemy-section");
    game.enemy = "";
  }
}

//
// Character info as a fighter 
//
class Fighter {
  constructor(id, apMax = 10, cApFactor = 1.0) {
    this.elem = $(`#${id}`);
    this.name = $(`#${id} h3.char-name`).text();
    this.hp = $(`#${id} h3.char-hp`);
    this.ap = this.attackPower(apMax);
    this.cAp = this.counterAttackPower(cApFactor);
  }

  attackPower(max = 10, base = 3) {
    return Math.floor(Math.random() * max) + (max - base);
  }

  counterAttackPower(factor = 1.0) {
    return Math.floor(this.ap * factor);
  }

  outOfHealthPoint() {
    return (this.healthPoint <= 0);
  }

  set healthPoint(point) {
    this.hp.text(point);
  }

  get healthPoint() {
    return parseInt(this.hp.text());
  }
}


//
// fight as a user clicks on the Attack button 
//
function fight() {
  if (game.player && !game.attacker) {
    game.attacker = new Fighter(game.player, 10, 1.0);
  }
  if (game.enemy && !game.defender) {
    game.defender = new Fighter(game.enemy, 10, 1.2);
  }
  if (!game.attacker || !game.defender) {
    return;
  }

  game.numAttacks++;
  attack();
  displayMessage();

  if (game.defender.outOfHealthPoint()) {
    game.defender.elem.detach();
    game.defender = null;
    game.enemy = null;
  }
}

//
// A facilitator function for fight()
//
function attack() {
  ap = game.attacker.ap * game.numAttacks;
  game.attacker.healthPoint = game.attacker.healthPoint - game.defender.cAp;
  game.defender.healthPoint = game.defender.healthPoint - ap;

  if (game.attacker.healthPoint < 0) {
    game.attacker.healthPoint = 0;
  }
  if (game.defender.healthPoint < 0) {
    game.defender.healthPoint = 0;
  }
}

function displayMessage() {
  clearMsg();
  if (game.attacker.outOfHealthPoint()) {
    $("#msg1").text("You've been defeated. GAME OVER!!!");
    $("#start").show();
  } else if (game.defender.outOfHealthPoint()) {
    if (remainingEnemies() === 0) {
      $("#msg1").text("You Won!!! GAME OVER!!!");
      $("#start").show();
    } else {
      $("#msg1").text(`You have defeated ${game.defender.name}. You can choose to finght another enemy.`);
    }
  } else {
    $("#msg1").text(`You attacked ${game.defender.name} for ${ap} damage`);
    $("#msg2").text(`${game.defender.name} attacked you back for ${game.defender.cAp} damage`);
  }
}

function clearMsg() {
  $("#msg1").text("");
  $("#msg2").text("");
}
// You attacked ${defender} for # damage
// ${defender} attacked you back for # damage

function remainingEnemies() {
  return $("#enemy-section > .char-box").length;
}
