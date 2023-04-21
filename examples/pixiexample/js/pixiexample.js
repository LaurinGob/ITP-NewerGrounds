// #################### SETUP
// constants
const SCREEN_WIDTH = 1600;
const SCREEN_HEIGHT = 900;
const BG_COLOR = 0xCCCCFF;
const MAX_FPS = 60;

// creates new pixi object
const GAME = new PIXI.Application(
    {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: BG_COLOR
    }
);

// adds pixi canvas to selected dom
document.getElementById("canvasAnchor").appendChild(GAME.view);

// adds the gameloop function to ticker (pixi.js)
GAME.ticker.add(gameLoop);
GAME.ticker.maxFPS = MAX_FPS;

// #################### scene setup (loading of all objects)
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

var hitTest = function(enemy, player)
{
    var player_left_edge = player.position.x - (player.width/2),
        player_right_edge = player.position.x + (player.width/2),
        player_upper_edge = player.position.y - (player.height/2),
        player_bottom_edge = player.position.y + (player.height/2),

        enemy_left_edge = enemy.position.x - (enemy.width/2),
        enemy_right_edge = enemy.position.x + (enemy.width/2),
        enemy_upper_edge = enemy.position.y - (enemy.height/2),
        enemy_bottom_edge = enemy.position.y + (enemy.height/2);

    if ((player_left_edge < enemy_right_edge && player_left_edge > enemy_left_edge) ||
        (player_right_edge > enemy_left_edge && player_right_edge < enemy_right_edge)) {
        if (player_bottom_edge > enemy_upper_edge && player_bottom_edge < enemy_bottom_edge) {
            // essen
            return 1;
        }
        if (player_upper_edge < enemy_bottom_edge -5 && player_upper_edge > enemy_upper_edge) {
            // schaden
            return 2;
        }
        if (player_upper_edge < enemy_bottom_edge && player_upper_edge > enemy_bottom_edge - 5) {
            return -1
        }
    }

    return false;
};

var updateUi = function() {
    uiRockCounter.innerText = rockCounter;
    uiChain.innerText = chain;
    uiHealth.innerText = health;
    uiComboMultiplier.innerText = comboMultiplier;
}

let player = PIXI.AnimatedSprite.fromImages(["res/textures/player.png","res/textures/player-lazereyes.jpeg"]);
player.anchor.set(0.5);
player.position.x = SCREEN_WIDTH/2;
player.position.y = SCREEN_HEIGHT - SCREEN_HEIGHT * 0.8;
GAME.stage.addChild(player);

let floor = PIXI.Sprite.from("res/textures/floor.jpg");
floor.position.x = 0;
floor.position.y = SCREEN_HEIGHT - 80;
floor.height = 80;
floor.width = SCREEN_WIDTH;
GAME.stage.addChild(floor);

let enemyArray = [];
let numberOfStones = 20;
let speed = 7;
let fallingspeed = 6;
let rockCounter = 0;
let health = 10;
let chain = 0;
let comboMultiplier = 0;
let uiRockCounter = document.getElementById("uiRockCounter");
let uiHealth = document.getElementById("uiHealth");
let uiChain = document.getElementById("uiChain");
let uiComboMultiplier = document.getElementById("uiComboMultiplier");
let temp = 0;

for (let i = 0; i < numberOfStones; i++) {
    enemyArray.push(PIXI.Sprite.from("res/textures/enemy.png"));
    enemyArray[i].anchor.set(0.5);
    enemyArray[i].position.x = getRandomInt(SCREEN_WIDTH);
    enemyArray[i].position.y = SCREEN_HEIGHT / 2 + getRandomInt(SCREEN_HEIGHT * 0.5);
    tempnumber = 1 + Math.random();
    enemyArray[i].scale.set(tempnumber,tempnumber);
    GAME.stage.addChild(enemyArray[i]);
}

let y_velocity = 0;
let player_airborne = false;
let player_jumping = false;
let jump_release = true;

// #################### gameloop
function gameLoop(delta) {
    // main gameloop for the game logic
    if (player.position.y < SCREEN_HEIGHT - floor.height - (player.height/2) || y_velocity < 0) {
        y_velocity += fallingspeed * delta;
        if (y_velocity > 0) {
            player_jumping = false;
        }
    } else {
        y_velocity = 0;
        player.position.y = SCREEN_HEIGHT - floor.height - (player.height/2);
        player_airborne = false;
    }
    player.position.y += y_velocity * delta;
    if (keys['87'] && jump_release) {
        player.gotoAndStop(0);
        jump_release = false;
        setTimeout(function() {jump_release = true;player.gotoAndStop(1);}, 1000);
        // w key move up
        if (player_airborne === false) {
            player_jumping = true;
            player_airborne = true;
            y_velocity = -65;
        }
    }
    if (keys['65']) {
        // a key move left
        if (player.position.x > 0 + player.height/2) {
            player.position.x -= speed*delta;
        }
    }
    if (keys['68']) {
        // d key move right
        if (player.position.x < SCREEN_WIDTH - player.height/2) {
            player.position.x += speed*delta;
        }
    }
    for (let i = 0; i < numberOfStones; i++) {
        temp = hitTest(enemyArray[i], player)
        if (temp > 0) {
            enemyArray[i].position.x = getRandomInt(SCREEN_WIDTH);
            enemyArray[i].position.y = 0;
            tempnumber = 1 + Math.random();
            enemyArray[i].scale.set(tempnumber,tempnumber);
            chain++;
            comboMultiplier = Math.floor(chain/5);
            rockCounter += comboMultiplier;
            updateUi();
        } else if (temp === -1) {
            enemyArray[i].position.x = getRandomInt(SCREEN_WIDTH);
            enemyArray[i].position.y = 0;
            chain = 0;
            comboMultiplier = Math.floor(chain/5);
            rockCounter += comboMultiplier;
            health--;
            updateUi();
        }
        enemyArray[i].position.y += fallingspeed / enemyArray[i].scale.x * delta;

        if (enemyArray[i].position.y > SCREEN_HEIGHT) {
            enemyArray[i].position.x = getRandomInt(SCREEN_WIDTH);
            enemyArray[i].position.y = 0;
        }
    }
}

// http://localhost/ITP-NewerGrounds/examples/pixiexample/pixiexample.html