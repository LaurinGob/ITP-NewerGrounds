// #################### CONFIG
let fallingSpeed = 3;
var forkPng;
var score = 0;
var gameOver = false;

//include Sound
const jumpAudio = new Audio('/static/games/flappyNoodle/res/jumping_sound.mp3');
jumpAudio.loop = false;
jumpAudio.volume = 1;

jumpAudio.addEventListener('loadeddata', () => {
    console.log('Sound wurde geladen');
});


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

// #################### UI setup
const Score = document.getElementById("score");
const GameOver = document.getElementById("gameOver");
const Restart = document.getElementById("restart");

var updateUi = function() {
    //update Score
    Score.innerText = score;
}

// adds the gameloop function to ticker (pixi.js)
GAME.ticker.add(gameLoop);
GAME.ticker.maxFPS = MAX_FPS;


// ############### GAME SETUP

//create Player
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
    
    //sets 2 sec Intervall -> spawns 1 pair of forks every 2 seconds
    setInterval(() => {
        //Random Number btw -100 und 100
        let randomNumber = Math.floor(Math.random() * 201) - 100;

        //generate Bottom fork
        let forkBottom = new PIXI.Sprite(forkPng);
        forkBottom.scale.set(0.4);

        forkBottom.position.x = SCREEN_WIDTH;
        //add random number to ensure height of obtacle is random
        forkBottom.position.y = Number(SCREEN_HEIGHT)/2 + 100 + randomNumber;
        
        GAME.stage.addChild(forkBottom);
        forks.push(forkBottom);

        //generate Top fork
        let forkTop = new PIXI.Sprite(forkPng);
        forkTop.scale.set(0.4);
        //flip fork
        forkTop.scale.y = -0.4;

        forkTop.position.x = SCREEN_WIDTH;
        //like bottom fork
        forkTop.position.y = Number(SCREEN_HEIGHT)/2 - 100 + randomNumber;
        
        GAME.stage.addChild(forkTop);
        forks.push(forkTop);
    }, 2000)

    //Makes sure forks get deleted
    setTimeout(() => {
        setInterval(() =>  {
            forks.splice(0, 2);
            //console.log(forks);
        }, 2000)     
    }, 5000)

    //increase score every 3,5 seconds / every time noodle flys succesfully through forks
    setTimeout(() => {
        setInterval(() =>  {
            ++score;
        }, 2000)     
    }, 3500)
}

//Sound

      
//play audio
function playAudio() { 
    const newSound = jumpAudio.cloneNode();
    newSound.play(); 
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

//AABB intersection
const AABBintersection = function(boxA, boxB) {
    if (boxA.right < (boxB.left + 15)) {
        return false;
    }
    if (boxA.left > (boxB.right - 15)) {
        return false;
    }
    if (boxA.bottom < (boxB.top + 5)) {
        return false;
    }
    if (boxA.top > (boxB.bottom - 5)) {
        return false;
    }
    return true;
}

//handle "out of Bounds"
function checkBounds(player){
    //check upper bounds
    if(player.position.y < 0){
        velocity = -1
        player.position.y = 0;
    }

    //check lower bounds
    if(player.position.y > (SCREEN_HEIGHT - player.height/2) && gameOver == false){
        velocity = 0;
        player.rotation = 0
        player.position.y = SCREEN_HEIGHT - player.height/2;
    }
}

//Game Over
function gameOverSettings(){
    //show Death Screen
    GameOver.style["display"] = "block";
    Restart.style["display"] = "block";

    //enable restart
    if(keys['r']){
        window.location.reload();
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

    checkBounds(player);

    if(gameOver == false){
        // Player controls
        if(keys[' '] && !spaceHasBeenPressed){
            velocity = jumpVelocity;
            playAudio();

            spaceHasBeenPressed = true;
        }

        if(!keys[' '] && spaceHasBeenPressed){
            spaceHasBeenPressed = false;
        }

        player.rotation = getRotation(velocity);


        // Fork movement
        forks.forEach((fork) => {
            fork.position.x -= 4;
            if(AABBintersection(player.getBounds(), fork.getBounds())){
                gameOver = true;
            }
        })

        //Update Score
        updateUi();
    }
    else{
        gameOverSettings();
    }
}