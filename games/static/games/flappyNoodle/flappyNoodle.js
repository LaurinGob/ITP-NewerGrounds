// #################### CONFIG
let fallingSpeed = 3;


// #################### PIXI SETUP
// constants
const SCREEN_WIDTH = 960;
const SCREEN_HEIGHT = 540;
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

// ############### GAME SETUP

// Player
const player = new PIXI.Graphics();
player.beginFill(0xFF66FF);
player.drawRect(200, 200, 50, 50);
GAME.stage.addChild(player);

// Vars
let jumpVelocity = 15;
let velocity = jumpVelocity;
let spaceHasBeenPressed = false;

// Game loop
function gameLoop(delta) {
    player.position.y -= delta * velocity;

    velocity -= 0.88;

    if(keys[' '] && !spaceHasBeenPressed){
        velocity = jumpVelocity;

        spaceHasBeenPressed = true;
    }

    if(!keys[' '] && spaceHasBeenPressed){
        spaceHasBeenPressed = false;
    }
}