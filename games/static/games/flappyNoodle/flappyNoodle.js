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
STARTSCREEN_ANCHOR.style.fontWeight = 'bolder'; // defines font for ui

//Start Screen
const STARTSCREEN_ELEMENT = document.createElement("div");
STARTSCREEN_ELEMENT.position = 'absolute';

const TITLE_ELEMENT = document.createElement("div");
TITLE_ELEMENT.setAttribute("id", "title");
TITLE_ELEMENT.setAttribute("style", "position: absolute; top: 100px; left: 13px; font-weight: bolder; color: rgb(233, 200, 20)");
const TITLE_H1 = document.createElement("h1");
TITLE_H1.innerText = 'Flappy Noodles';
TITLE_H1.setAttribute("style", "font-size: 120px");
TITLE_ELEMENT.appendChild(TITLE_H1);

const STARTBUTTON_ELEMENT =  document.createElement("div");
STARTBUTTON_ELEMENT.setAttribute("id", "startButton");
STARTBUTTON_ELEMENT.setAttribute("style", "position: absolute; top: 270px; left: 360px; font-weight: bolder; color: rgb(233, 167, 25)");
STARTBUTTON_ELEMENT.addEventListener("click", startGame);
STARTBUTTON_ELEMENT.addEventListener("mouseover", function() {
    STARTBUTTON_ELEMENT.style.textShadow = "0 0 10px black";
});
STARTBUTTON_ELEMENT.addEventListener("mouseout", function() {
    STARTBUTTON_ELEMENT.style.textShadow = "none";
});
const STARTBUTTON_H1 = document.createElement("h1");
STARTBUTTON_H1.innerText = 'Start';
STARTBUTTON_H1.setAttribute("style", "font-size: 100px");
STARTBUTTON_ELEMENT.appendChild(STARTBUTTON_H1);

STARTSCREEN_ELEMENT.appendChild(STARTBUTTON_ELEMENT);
STARTSCREEN_ELEMENT.appendChild(TITLE_ELEMENT);
STARTSCREEN_ANCHOR.appendChild(STARTSCREEN_ELEMENT);
CANVASANCHOR.style.position = 'relative'; // VERY IMPORTANT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
CANVASANCHOR.appendChild(STARTSCREEN_ANCHOR);
CANVASANCHOR.appendChild(GAME.view);



function startGame(){
    //Remove Startscreen
    STARTSCREEN_ANCHOR.replaceChildren();
    STARTSCREEN_ANCHOR.remove();
    
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

    // set up ui elements and add to uianchor
    const UIANCHOR = document.createElement("div"); // the root element of UI
    UIANCHOR.setAttribute("id", "uiAnchor");
    UIANCHOR.style.fontWeight = 'bolder'; // defines font for ui

    // positioning
    const UIPOSITION = document.createElement("div"); // sub element of UI, used to position elements
    UIPOSITION.style.position = 'absolute';
    UIPOSITION.style.top = '10px';
    UIPOSITION.style.left = '10px';
    UIANCHOR.appendChild(UIPOSITION);

    const SCORE_ELEMENT = document.createElement("h1"); // generate a dom to write to
    SCORE_ELEMENT.setAttribute("style", "color: white;");
    SCORE_ELEMENT.innerText = 'Score: '; // static text for the element
    const SCORE_SPAN = document.createElement("span"); // the elements containing the dynamic text
    SCORE_SPAN.setAttribute("id", "score"); // to later call the span
    SCORE_ELEMENT.appendChild(SCORE_SPAN); // add span to element
    UIPOSITION.appendChild(SCORE_ELEMENT); // add to UIPosition

    //Game Over tag
    const GAMEOVER_DIV = document.createElement("div");
    GAMEOVER_DIV.setAttribute("id", "gameOver");
    GAMEOVER_DIV.setAttribute("style", "position: absolute; top: 100px; left: 30px; font-weight: bolder; color: red; display: none;");
    const GAMEOVER_H1 = document.createElement("h1"); 
    GAMEOVER_H1.setAttribute("style", "font-size: 180px")
    GAMEOVER_H1.innerText = 'GAME OVER';
    GAMEOVER_DIV.appendChild(GAMEOVER_H1);
    UIANCHOR.appendChild(GAMEOVER_DIV);

    //Restart tag
    const RESTART_DIV = document.createElement("div");
    RESTART_DIV.setAttribute("id", "restart");
    RESTART_DIV.setAttribute("style", "position: absolute; top: 300px; left: 240px; font-weight: bolder; color: white; display: none;");
    const RESTART_H1 = document.createElement("h1"); 
    RESTART_H1.innerText = 'Press "r" to restart the game';
    RESTART_DIV.appendChild(RESTART_H1);
    UIANCHOR.appendChild(RESTART_DIV);

    // adds pixi canvas to selected dom
    CANVASANCHOR.appendChild(UIANCHOR);


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
      }, 1500);
}

//If the game is gameOver you are able to press "r" to restart the game
document.addEventListener('keydown', function(event) {
    if (event.key === 'r' && gameOver == true) {
      // Rufe die Funktion zum Neustarten des Spiels auf
      window.location.reload(); //eventuell startGame();
    }
  });

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