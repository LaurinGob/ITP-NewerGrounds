// #################### CONFIG
let fallingSpeed = 3;
var forkPng;
let score = 0;

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

//new Player
const player = PIXI.Sprite.from('/static/games/flappyNoodle/res/Noodle.png');
player.anchor.set(0.5);
player.position.x = 200;
player.position.y = SCREEN_HEIGHT/2;
player.scale.set(0.06);

GAME.stage.addChild(player);

// Forks
let forks = Array()
async function loadResources(){
    forkPng = await PIXI.Assets.load('/static/games/flappyNoodle/res/Gabel.png');
    
    setInterval(() => {
        //Random Number btw -100 und 100
        let randomNumber = Math.floor(Math.random() * 201) - 100;

        // Bottom fork
        let forkBottom = new PIXI.Sprite(forkPng);
        forkBottom.scale.set(0.4);

        forkBottom.position.x = SCREEN_WIDTH;
        forkBottom.position.y = Number(SCREEN_HEIGHT)/2 + 100 + randomNumber;
        
        GAME.stage.addChild(forkBottom);
        forks.push(forkBottom);

        // Top fork
        let forkTop = new PIXI.Sprite(forkPng);
        forkTop.scale.set(0.4);
        forkTop.scale.y = -0.4;

        forkTop.position.x = SCREEN_WIDTH;
        forkTop.position.y = Number(SCREEN_HEIGHT)/2 - 100 + randomNumber;
        
        GAME.stage.addChild(forkTop);
        forks.push(forkTop);
    }, 2000)

    setTimeout(() => {
        setInterval(() =>  {
            forks.splice(0, 2);
            //console.log(forks);
        }, 2000)     
    }, 5000)

    setTimeout(() => {
        setInterval(() =>  {
            ++score;
        }, 2000)     
    }, 3500)
}

//Rotation
function getRotation(velocity){
    if(velocity >= 10){
        return Math.PI*3/2 + 0.5;
    } else if(velocity <= -10){
        return -(Math.PI*3/2 + 0.5);
    } else {
        return -velocity/10;
    }
    
}

// Vars
let jumpVelocity = 10;
let velocity = jumpVelocity;
let spaceHasBeenPressed = false;
let rotationIncrement = -0.05;

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

    player.rotation = getRotation(velocity);


    // Fork movement
    forks.forEach((fork) => {
        fork.position.x -= 4;
    })
}