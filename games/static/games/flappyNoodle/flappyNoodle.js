// #################### CONFIG
let fallingSpeed = 3;
var forkPng;
var score = 0;
var gameOver = false;
var backgroundTexture;
var backgroundSprite;

//Player vars
const player = PIXI.Sprite.from('/static/games/flappyNoodle/res/images/Player.png');
let jumpVelocity = 10;
let velocity = jumpVelocity;
let spaceHasBeenPressed = false;
let rotationIncrement = -0.05;

//include Sound
const jumpAudio = new Audio('/static/games/flappyNoodle/res/sounds/jumping_sound.mp3');
jumpAudio.loop = false;
jumpAudio.volume = 1;

const gameOverAudio = new Audio('/static/games/flappyNoodle/res/sounds/gameOver.mp3');
gameOverAudio.loop = false;
gameOverAudio.volume = 1;

gameOverAudio.addEventListener('loadeddata', () => {
    console.log('gameOver sound wurde geladen');
});

jumpAudio.addEventListener('loadeddata', () => {
    console.log('jumping sound wurde geladen');
});

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

const CANVASANCHOR = document.getElementById("canvasAnchor");

// ####################### UI Setup
//Background
backgroundTexture = PIXI.Texture.from('/static/games/flappyNoodle/res/images/BG_Holztisch.jpg');    
backgroundSprite = new PIXI.TilingSprite(backgroundTexture, GAME.renderer.width, GAME.renderer.height);
GAME.stage.addChild(backgroundSprite);

// set up ui elements and add to uianchor
const STARTSCREEN_ANCHOR = document.createElement("div"); // the root element of UI
STARTSCREEN_ANCHOR.setAttribute("id", "uiAnchor");
STARTSCREEN_ANCHOR.style.position = 'absolute';
STARTSCREEN_ANCHOR.style.fontWeight = 'bolder'; // defines font for ui
STARTSCREEN_ANCHOR.style.display = "flex";
STARTSCREEN_ANCHOR.style.alignItems = "center";
STARTSCREEN_ANCHOR.style.justifyContent = "center";
STARTSCREEN_ANCHOR.style.flexDirection ="column";
STARTSCREEN_ANCHOR.style.textAlign = "center";
STARTSCREEN_ANCHOR.style.width = "960px";
STARTSCREEN_ANCHOR.style.height = "540px";





//Start Screen
const STARTSCREEN_ELEMENT = document.createElement("div");
STARTSCREEN_ELEMENT.position = 'relative';

const TITLE_ELEMENT = document.createElement("div");
TITLE_ELEMENT.setAttribute("id", "title");
TITLE_ELEMENT.style.color = 'rgb(233, 200, 20)';
const TITLE_H1 = document.createElement("h1");
TITLE_H1.innerText = 'Flappy Noodles';
TITLE_H1.setAttribute("style", "font-size: 100px");
TITLE_ELEMENT.appendChild(TITLE_H1);

const STARTBUTTON_ELEMENT =  document.createElement("div");
STARTBUTTON_ELEMENT.setAttribute("id", "startButton");
STARTBUTTON_ELEMENT.style.color = 'rgb(233, 167, 25)';
STARTBUTTON_ELEMENT.style.minWidth = 'auto';

STARTBUTTON_ELEMENT.addEventListener("click", startGame);
STARTBUTTON_ELEMENT.addEventListener("mouseover", function() {
    STARTBUTTON_ELEMENT.style.textShadow = "0 0 10px black";
});
STARTBUTTON_ELEMENT.addEventListener("mouseout", function() {
    STARTBUTTON_ELEMENT.style.textShadow = "none";
});
const STARTBUTTON_H1 = document.createElement("h1");
STARTBUTTON_H1.innerText = 'Start';
STARTBUTTON_H1.setAttribute("style", "font-size: 80px");
STARTBUTTON_ELEMENT.appendChild(STARTBUTTON_H1);


STARTSCREEN_ELEMENT.appendChild(TITLE_ELEMENT);
STARTSCREEN_ELEMENT.appendChild(STARTBUTTON_ELEMENT);
STARTSCREEN_ANCHOR.appendChild(STARTSCREEN_ELEMENT);
CANVASANCHOR.style.position = 'relative'; // VERY IMPORTANT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
CANVASANCHOR.appendChild(STARTSCREEN_ANCHOR);

//Game Over tag
const GAMEOVER_DIV = document.createElement("div");
GAMEOVER_DIV.setAttribute("id", "gameOver");
GAMEOVER_DIV.style.color = 'red';
const GAMEOVER_H1 = document.createElement("h1"); 
GAMEOVER_H1.setAttribute("style", "font-size: 120px")
GAMEOVER_H1.innerText = 'GAME OVER';
GAMEOVER_DIV.appendChild(GAMEOVER_H1);
GAMEOVER_DIV.style.textShadow = "0 0 10px black";

//Restart tag
const RESTART_DIV = document.createElement("div");
RESTART_DIV.setAttribute("id", "restart");
RESTART_DIV.style.color = 'white';
const RESTART_H1 = document.createElement("h1"); 
RESTART_H1.innerText = 'Press "r" to restart the game';
RESTART_DIV.appendChild(RESTART_H1);
RESTART_DIV.style.textShadow = "0 0 10px black";


CANVASANCHOR.appendChild(GAME.view);



function startGame(){
    TITLE_ELEMENT.style.display='none';
    STARTBUTTON_ELEMENT.style.display='none';
    
    STARTSCREEN_ANCHOR.appendChild(GAMEOVER_DIV);
    STARTSCREEN_ANCHOR.appendChild(RESTART_DIV);
    
    
    GAMEOVER_DIV.style.display = 'none';
    RESTART_DIV.style.display ='none';
    // adds the gameloop function to ticker (pixi.js)
    GAME.ticker.add(gameLoop);
    GAME.ticker.maxFPS = MAX_FPS;

    //Load forks
    loadResources();

    //set up Player
    player.anchor.set(0.5);
    player.position.x = 200;
    player.position.y = SCREEN_HEIGHT/2;
    player.scale.set(0.2);
    GAME.stage.addChild(player);

    // ####################### ui elements

    const SCORE_ELEMENT = document.createElement("h1"); // generate a dom to write to
    SCORE_ELEMENT.setAttribute("style", "color: white;");
    SCORE_ELEMENT.innerText = 'Score: '; // static text for the element
    const SCORE_SPAN = document.createElement("span"); // the elements containing the dynamic text
    SCORE_SPAN.setAttribute("id", "score"); // to later call the span
    SCORE_ELEMENT.appendChild(SCORE_SPAN); // add span to element
    SCORE_ELEMENT.style.textShadow = "0 0 10px black";
    STARTSCREEN_ELEMENT.appendChild(SCORE_ELEMENT); // add to UIPosition
    
}


//Update UI / Background
var updateUi = function() {
    //update Score
    let SCORE = document.getElementById("score");
    SCORE.innerText = score;
}

function updateBackground(){
    backgroundSprite.tilePosition.x -= 4;
}

// ############### GAME SETUP




// Forks
var forks = Array()
async function loadResources(){
    forkPng = await PIXI.Assets.load('/static/games/flappyNoodle/res/images/Fork.png');
    
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
function playJumpingAudio() { 
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
    if (boxA.bottom < (boxB.top + 15)) {
        return false;
    }
    if (boxA.top + 25 > (boxB.bottom - 15)) {
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
    if(player.position.y > (SCREEN_HEIGHT - player.height/2) && !gameOver){
        velocity = 0;
        player.rotation = 0
        player.position.y = SCREEN_HEIGHT - player.height/2;
    }
}

//Game Over
function gameOverSettings(){
    gameOverAudio.play();
    let GAMEOVER = document.getElementById("gameOver");
    GAMEOVER.style.display = "block";
    let RESTART = document.getElementById("restart");
    RESTART.style.display = "block";

    setTimeout(() => {
        // Stops the loop
        GAME.ticker.stop();
        //------------ Achievments -----------------
        if(score <= 0){
            unlock_achievement(6);
        }
        if(score >= 50){
            unlock_achievement(7);
        }
        if(score >= 100){
            unlock_achievement(8);
        }
        if(score >= 1000){
            unlock_achievement(9);
        }

        //----------------------------------

      }, 1500);
}

//If the game is gameOver you are able to press "r" to restart the game
document.addEventListener('keydown', function(event) {
    if (event.key === 'r' && gameOver == true) {
      // Rufe die Funktion zum Neustarten des Spiels auf
      window.location.reload(); //eventuell startGame();
    }
  });


//Create the wind particles on flapping
const createJumpParticles = function (player){

//Particle Library setup
const { Container, ParticleContainer, Texture, Ticker } = PIXI;
const cnt = new ParticleContainer();
GAME.stage.addChild(cnt);           //add emitter to GAME.stage

//create emitter
const emitter = new PIXI.particles.Emitter(cnt, {
    lifetime: { min: 0.1, max: 0.5 },
    frequency: 1,           //time in seconds between particles
    spawnChance: 1,         //0-1 chance of spawning a particle each spawn event
    particlesPerWave: 5,    //Optional
    emitterLifetime: 1.1,   //Seconds until emitter stops
    maxParticles: 10,       //Optional max simultaneous particles
    pos: { x: player.position.x, y: player.position.y},
    autoUpdate: true,       //ties the emitter to the PixiJS ticker
    behaviors: [
        {
            type: 'spawnShape',
            config: {
                type: 'rect',
                data: { x: -60, y: 0, w: 120, h: 70}
            },
        },
        {
            type: 'textureSingle', config: { texture: PIXI.Texture.from("../../static/games/flappyNoodle/res/images/cloud.png") }
        },
        {
            type: 'scale',
            config: {
                scale: {
                    list: [{value: 0.1, time: 0}, {value: 0.05, time: 1}]
                }
            }
        },
        {
            type: 'moveAcceleration',
            config: {
                accel: {
                    x:-500,
                    y:300
                },
                minStart: -20,
                maxStart: -100,
                rotate: false
            }
        },
    ]
});

return emitter;

}

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
            playJumpingAudio();
            const emitter = createJumpParticles(player);
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

        //Update Score / Background
        updateUi();
        updateBackground();
    }
    else{
        gameOverSettings();
    }
}