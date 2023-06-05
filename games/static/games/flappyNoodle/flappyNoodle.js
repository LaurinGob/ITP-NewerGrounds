// #################### CONFIG
let fallingSpeed = 3;
var forkPng;

loadResources();

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

// Forks
let forks = Array()
async function loadResources(){
    forkPng = await PIXI.Assets.load('/static/games/flappyNoodle/res/Gabel.png');
    
    setInterval(() => {
        // Bottom fork
        let forkBottom = new PIXI.Sprite(forkPng);
        forkBottom.scale.set(0.4);

        forkBottom.position.x = SCREEN_WIDTH;
        forkBottom.position.y = Number(SCREEN_HEIGHT) - 200;
        
        GAME.stage.addChild(forkBottom);
        forks.push(forkBottom);

        // Top fork
        let forkTop = new PIXI.Sprite(forkPng);
        forkTop.scale.set(0.4);

        forkTop.pivot.set(forkTop.width/2, forkTop.height/2);
        forkTop.rotation = Math.PI;

        forkTop.position.x = SCREEN_WIDTH;
        forkTop.position.y = Number(SCREEN_HEIGHT) - 200;
        
        GAME.stage.addChild(forkTop);
        forks.push(forkTop);
    }, 400)
}


// Vars
let jumpVelocity = 15;
let velocity = jumpVelocity;
let spaceHasBeenPressed = false;

// Game loop
function gameLoop(delta) {
    // Player gravity
    player.position.y -= delta * velocity;
    velocity -= 0.5;

    // Player controls
    if(keys[' '] && !spaceHasBeenPressed){
        velocity = jumpVelocity;

        spaceHasBeenPressed = true;
    }

    if(!keys[' '] && spaceHasBeenPressed){
        spaceHasBeenPressed = false;
    }

    // Fork movement
    forks.forEach((fork) => {
        fork.position.x -= 4;
    })
}