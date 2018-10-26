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
  $("#start").click(start);
}

let game = {
  player: null, // player's character name
  enemy: null, // enemy's character name
  numAttacks: 0, // the number of attacks
}

//
// (re-)start the game
//
function start() {
  game.player = "";
  game.enemy = "";
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
  constructor(id, apMax = 10, cApFactor = 2) {
    this.elem = $(`#${id}`);
    this.name = $(`#${id} h3.char-name`).text();
    this.hp = $(`#${id} h3.char-hp`).text();
    this.ap = this.attackPower(apMax);
    this.cAp = this.counterAttackPower(cApFactor);
  }

  attackPower(base = 5, max = 15) {
    return Math.floor(Math.random() * max) + (max - base);
  }

  counterAttackPower(factor = 2.0) {
    return Math.floor(this.ap * factor);
  }

  outOfHealthPoint() {
    return (this.hp < 0);
  }
}


let inBattle = {
  attacker: null,
  defender: null
}

//
// fight as a user clicks on the Attack button 
//
function fight() {
  if (!inBattle.attacker) {
    inBattle.attacker = new Fighter(game.player);
  }
  if (!inBattle.defender) {
    inBattle.defender = new Fighter(game.enemy);
  }
  game.numAttacks++;

  console.log("Attack button is clicked " + game.numAttacks + " times");
  console.log("player " + inBattle.attacker.name + " " + inBattle.attacker.hp + " " + inBattle.attacker.ap + " " + inBattle.attacker.cAp);
  console.log("defender " + inBattle.defender.name + " " + inBattle.defender.hp + " " + inBattle.defender.ap + " " + inBattle.defender.cAp);

  if (inBattle.defender.outOfHealthPoint()) {
    game.enemy.detach();
    game.enemy = null;
    game.numAttacks = 0;
  }
}
