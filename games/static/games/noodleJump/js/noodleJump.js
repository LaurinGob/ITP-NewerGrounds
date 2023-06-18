// #################### SETUP
// constants
const SCREEN_WIDTH = 540;
const SCREEN_HEIGHT = 960;
const BG_COLOR = 0xCCCCFF;
const MAX_FPS = 60;
const RES_URL = '../../static/games/noodleJump/res/';
const INITIAL_PLATFORMS = 2;
let SCORE = 0;

let TAN_INPUT = 0;

// creates new pixi object
const GAME = new PIXI.Application(
    {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: BG_COLOR
    }
);

// adds pixi canvas to selected dom
CANVASANCHOR = document.getElementById("canvasAnchor");
CANVASANCHOR.appendChild(GAME.view);




/* ~~~~~ Setup ~~~~~ */
let background_texture;
let background;
let platform_texture = PIXI.Texture.from(RES_URL + 'textures/penne_platform.png');
let player_texture = PIXI.Texture.from(RES_URL + 'textures/meatball_player.png');
let player_texture_squish = PIXI.Texture.from(RES_URL + 'textures/Player_Squish_horizontal.png');
let player_texture_flying = PIXI.Texture.from(RES_URL + 'textures/Player_Squish_vertical.png');


const PLAYER = new Player();
let PLATFORMS = [];
let PLATFORM_DELTA;
let PLATFORM_WIDTH = 200;
let PLATFORM_HEIGHT = 30;

let JUMP_HEIGHT = 180; //TODO: wert festlegen -> experimentell
let JUMP_VELOCITY = -7;


//non-random initial platform spawn
PLATFORMS[0] = new Platform(SCREEN_WIDTH/2, SCREEN_HEIGHT-100);
PLATFORMS[1] = new Platform(SCREEN_WIDTH/3, SCREEN_HEIGHT-200);    


/* ~~~~~ Death-Screen + UI and functional elements ~~~~~ */

const reloadPage = function(){
    window.location.reload();
}

// set up ui elements and add to uianchor
const UI_ANCHOR = document.createElement("div"); // the root element of UI
UI_ANCHOR.setAttribute("id", "uiAnchor");
UI_ANCHOR.setAttribute("class", "text-center");
UI_ANCHOR.style.fontWeight = 'bolder'; // defines font for ui
UI_ANCHOR.style.fontSize = '48px';
UI_ANCHOR.style.backgroundColor = '#ffffff80';
UI_ANCHOR.style.width = '540px';
UI_ANCHOR.style.position = 'absolute';

const UI_GAMEOVER = document.createElement("div"); // the root element of UI
UI_GAMEOVER.setAttribute("id", "uiGameover");
UI_GAMEOVER.style.display = 'none';
UI_GAMEOVER.style.width = '540px';
UI_GAMEOVER.style.height = '100%';
UI_GAMEOVER.style.position = 'absolute';
UI_GAMEOVER.style.backgroundColor = '#ddddff';

const UI_GAMEOVER_TEXT = document.createElement("div");
UI_GAMEOVER_TEXT.setAttribute("id", "gameover_div");
UI_GAMEOVER_TEXT.setAttribute("class", "text-center");
UI_GAMEOVER_TEXT.style.fontWeight = 'bolder'; // defines font for ui
UI_GAMEOVER_TEXT.style.fontSize = '48px';
UI_GAMEOVER_TEXT.style.width = '100%';
UI_GAMEOVER.appendChild(UI_GAMEOVER_TEXT);

const UI_RELOAD_BTN = document.createElement("button");
UI_RELOAD_BTN.setAttribute("id", "reload_btn");
UI_RELOAD_BTN.setAttribute("class", "btn btn-info");
UI_RELOAD_BTN.textContent = "RESTART";
UI_RELOAD_BTN.addEventListener("click", reloadPage);
UI_RELOAD_BTN.style.width = "300px";
UI_RELOAD_BTN.style.height = "100px";
UI_RELOAD_BTN.style.marginLeft = "120px";
UI_RELOAD_BTN.style.marginRight = "120px";
UI_RELOAD_BTN.style.marginTop = "120px";
UI_RELOAD_BTN.style.fontSize = "40px";
UI_GAMEOVER.appendChild(UI_RELOAD_BTN);

CANVASANCHOR.appendChild(UI_ANCHOR);
CANVASANCHOR.appendChild(UI_GAMEOVER);

/* ~~~~~ Game Content ~~~~~ */

loadRessources();

/* ~~~~~ Loop ~~~~~ */
function gameLoop(delta) {
    UI_ANCHOR.innerHTML = 'Score: ' + Math.floor(SCORE/10);
    GameOver = PLAYER.applyGravity(delta);
    PLAYER.applyVelocity_x(delta);
    PLAYER.mapWrap();
    PLAYER.updateSprite();
    PLAYER.applyRotation();
    

    if (!PLAYER.isSquished && PLAYER.velocity_y > 3) {
        PLAYER.sprite.texture = player_texture_flying;
    } else if (!PLAYER.isSquished && PLAYER.velocity_y <= 3) {
        PLAYER.sprite.texture = player_texture;
        // PLAYER.sprite.height = 100; 
        // PLAYER.sprite.width = 100;
    } else {
        PLAYER.sprite.texture = player_texture_squish;
        // PLAYER.sprite.height = 80;
        // PLAYER.sprite.width = 120;
    }

    //Calculating Score
    if(PLAYER.sprite.position.y < SCREEN_HEIGHT/3 && PLAYER.velocity_y <0){
        SCORE -= PLAYER.velocity_y;
    }
    else{
        PLAYER.applyVelocity_y(delta);
    }

    //Platform handling
    for (let i=0; i<PLATFORMS.length; i++){
        //update platform sprites
        PLATFORMS[i].updateSprite(SCORE);
        //check for collision with player
        if(playerJump(PLAYER.sprite.getBounds(), PLATFORMS[i].sprite.getBounds()) && PLAYER.velocity_y >= 0){
            PLAYER.velocity_y = JUMP_VELOCITY;
            PLAYER.isSquished = true;
            PLAYER.rotationLocked = false;
            setTimeout(() => {
                PLAYER.isSquished = false;
            }, 150);
        }
    }

    //New platform spawn
    PLATFORM_DELTA = (Math.random() * (JUMP_HEIGHT - PLAYER.sprite.height) + PLAYER.sprite.height);
    //if the Delta above the top platform reaches a threshold
    if (PLATFORMS[PLATFORMS.length - 1].position_y - PLATFORM_DELTA > -SCORE-20) {
        // Create a new platform above the top platform at vertical distance PLATFORM_DELTA
        const newPlatform = new Platform(Math.random() * SCREEN_WIDTH-PLATFORM_WIDTH/4, PLATFORMS[PLATFORMS.length - 1].position_y - PLATFORM_DELTA);
        newPlatformSprite(newPlatform);
        PLATFORMS.push(newPlatform);
      
        // Calculate a new PLATFORM_DELTA for the next platform
        PLATFORM_DELTA = Math.random() * (JUMP_HEIGHT - PLAYER.sprite.height) + PLAYER.sprite.height;
    }

    //delete all Platforms that go out of bounds
    if(PLATFORMS[0].position_y+SCORE > Screen.height){
        delete PLATFORMS[0];
    }

    //debugging
    for(let i=0; i<PLATFORMS.length-1; i++){
        if(PLATFORMS[i].position_x == 0){
            console.log(PLATFORMS[i]);
        }
    } 

    //deathscreen condition
    if(GameOver){
        /*
        stop game loop?
        */
        UI_GAMEOVER.style.display = 'block';
        UI_GAMEOVER_TEXT.innerHTML = 'GAME OVER<br>Score: ' + Math.floor(SCORE/10);
    }

    //Gameplay
    controlPlayer();

}




//--------------------------- Setup Functions --------------------------------------------------

async function loadRessources() {
    background_texture = await PIXI.Assets.load('../../static/games/noodleJump/res/textures/background.jpg');

    /*
    platform_texture = await PIXI.Assets.load('../../static/games/noodleJump/res/textures/penne_platform.png');
    player_texture = await PIXI.Assets.load('../../static/games/noodleJump/res/textures/meatball_player.png');
    */

    createSprites();
}

function createSprites() {
    //Background Sprite setup
    background = new PIXI.TilingSprite(background_texture); //erstellt
    background.width = SCREEN_WIDTH;
    background.height = SCREEN_HEIGHT;
    background.position.set(0);


    //Player Sprite setup
    PLAYER.sprite = new PIXI.Sprite(player_texture);
    PLAYER.sprite.width = 100;
    PLAYER.sprite.height = 100;
    PLAYER.sprite.anchor.set(0.5);
    PLAYER.sprite.position.set(0);

    for (let i=0; i<INITIAL_PLATFORMS; i++){
        PLATFORMS[i].sprite = new PIXI.Sprite(platform_texture);
        PLATFORMS[i].sprite.width = PLATFORM_WIDTH;
        PLATFORMS[i].sprite.height = PLATFORM_HEIGHT;
    }
    
    setup();
}

function setup(){
    GAME.stage.addChild(background);
    GAME.stage.addChild(PLAYER.sprite);
    for (let i=0; i<INITIAL_PLATFORMS; i++){
        GAME.stage.addChild(PLATFORMS[i].sprite);
    }

    // adds the gameloop function to ticker (pixi.js)
    GAME.ticker.add(gameLoop);
    GAME.ticker.maxFPS = MAX_FPS;

}


//----------------------------- Gameplay functions ----------------------------------
const AABBintersection = function(boxA, boxB) {
    if (boxA.right < boxB.left) {
        return false;
    }
    if (boxA.left > boxB.right) {
        return false;
    }
    if (boxA.bottom < boxB.top) {
        return false;
    }
    if (boxA.top > boxB.bottom) {
        return false;
    }
    return true;
}

const playerJump = function(player, platform){
    if(AABBintersection(player, platform) && (player.y + player.height < platform.y + platform.height/2)){
        return true;
    }
    else{
        return false;
    }
}

const controlPlayer = function(){
    //key input
    if (keys['a'] && !keys['d']) {
        PLAYER.velocity_x = -VelocityCalculation_x();
    }
    if (keys['d'] && !keys['a']) {
        PLAYER.velocity_x = VelocityCalculation_x();
    }
    if (!(keys['a'] || keys['d'])) {
        TAN_INPUT = 0;
        PLAYER.velocity_x /= 2;
    }
    if(keys['a'] && keys['d']){
        TAN_INPUT = 0;
        PLAYER.velocity_x /= 2;
    }
}

const VelocityCalculation_x = function(){
    TAN_INPUT += 0.35;
    return 2*(Math.atan(TAN_INPUT-1)+1);
}

const newPlatformSprite = function(Platform){
    let platform_texture = PIXI.Texture.from(RES_URL + 'textures/penne_platform.png');
    Platform.sprite = new PIXI.Sprite(platform_texture);
    Platform.sprite.width = PLATFORM_WIDTH;
    Platform.sprite.height = PLATFORM_HEIGHT;

    GAME.stage.addChild(Platform.sprite);
}