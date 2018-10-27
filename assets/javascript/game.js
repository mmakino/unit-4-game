/*
---------------------------------------------------------------------------
Star Wars RPG Game
---------------------------------------------------------------------------
*/

//
// Listen to mouse click events
//
function run() {
  $(".char-box").click(game.setupFight);
  $("#attack").click(game.fight);
  $("#start").hide();
  $("#start").click(game.start);
}

//
// Game object
//
let game = {
  player: null,      // player's character name
  enemy: null,       // enemy's character name
  attacker: null,    // player in the fight section
  defender: null,    // enemy in the fight section
  numAttacks: 0,     // the number of attacks
  isOver: false,     // game status boolean
  charBoxes: [],     // save removed character boxes

  //
  // fight setup through a user character selections 
  //
  setupFight: function () {
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
        game.clearMsg();
      }
    }
    // user can move the enemy defender back to the Enemy section
    else if (section_name === 'defender-section') {
      console.log("Enemy " + $(this).attr("id") + " is removed from the defender-section");
      $(this).removeClass("char-box-defender");
      $(this).addClass("char-box-enemy");
      $(this).appendTo("#enemy-section");
      game.enemy = null;
      game.defender = null;
    }
  },

  //
  // fight as a user clicks on the Attack button 
  // Fighter class keeps track of character data. 
  //
  fight: function() {
    if (game.player && !game.attacker) {
      game.attacker = new Fighter(game.player, 10, 1.0);
    }
    if (game.enemy && !game.defender) {
      game.defender = new Fighter(game.enemy, 10, 1.8);
    }
    if (!game.attacker || !game.defender || game.isOver) {
      if (!game.attacker) {
        $("#msg1").text("Please select your character");
      }
      else if (!game.isOver && !game.defender) {
        $("#msg1").text("Please select an enemy to attack");
      }
      return;
    }

    game.numAttacks++;
    let damage = game.attack();
    game.displayMessage(damage);

    if (game.defender.outOfHealthPoint()) {
      game.charBoxes.push(game.defender.elem.detach());
      game.defender = null;
      game.enemy = null;
    }
  },

  //
  // A facilitator function for fight()
  //
  attack: function() {
    let damage = game.attacker.ap * game.numAttacks;
    game.defender.healthPoint -= damage;

    if (game.defender.healthPoint < 0) {
      game.defender.healthPoint = 0;
    }
    else {
      game.attacker.healthPoint -= game.defender.cAp;
    }

    if (game.attacker.healthPoint < 0) {
      game.attacker.healthPoint = 0;
    }

    return damage;
  },

  //
  // Display the game fighting status messages
  //
  displayMessage: function(damage) {
    game.clearMsg();

    // player defeated the enemy  
    if (game.defender.outOfHealthPoint()) {
      if (game.remainingEnemies() === 0) { // No enemies left
        $("#msg1").text("You Won!!! GAME OVER!!!");
        $("#start").show();
        game.isOver = true;
      } else {
        $("#msg1").text(`You have defeated ${game.defender.name}. You can choose to fight another enemy.`);
      }
    }
    // player is out of the Health Point; i.e. lost
    else if (game.attacker.outOfHealthPoint()) {
      $("#msg1").text("You've been defeated. GAME OVER!!!");
      $("#start").show();
      game.isOver = true;
    }
    // still in fight
    else {
      $("#msg1").text(`You attacked ${game.defender.name} for ${damage} damage`);
      $("#msg2").text(`${game.defender.name} attacked you back for ${game.defender.cAp} damage`);
    }
  },

  //
  // Clear the game status messages at the bottom
  //
  clearMsg: function() {
    $("#msg1").text("");
    $("#msg2").text("");
  },

  //
  // The remaining number of enemies
  //
  remainingEnemies: function () {
    return $("#enemy-section > .char-box").length;
  },

  //
  // (re-)start the game
  //
  start: function () {
    ['player', 'enemy', 'attacker', 'defender'].forEach(function(e) {
      game[e] = null;
    });
    game.numAttacks = 0;
    game.isOver = false;
    game.clearMsg();
    $("#start").hide();
    game.resetCharData();
  },

  //
  // facilitator function for start()
  //
  resetCharData: function() {
    for (i = 0; i < game.charBoxes.length; i++) {
      game.charBoxes[i].appendTo($("#initial-row"));
    }
    $(".char-box").appendTo("#initial-row");
    $(".char-box").removeClass("char-box-you");
    $(".char-box").removeClass("char-box-enemy");
    $(".char-box").removeClass("char-box-defender");
    $(".char-box").addClass("char-box");
    $(".char-hp").each(function() {
      this.innerText = Math.floor(Math.random() * 70) + 100;
    });
  }
}

//
// Character info as a fighter
// Keeps track of
// * Name
// * Health Point
// * Attack Power
// * Counter Attack Power 
//
class Fighter {
  constructor(id, apMax = 10, cApFactor = 1.0) {
    this.elem = $(`#${id}`);
    this.name = $(`#${id} h3.char-name`).text();
    this.hp = $(`#${id} h3.char-hp`); // Health Point
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
