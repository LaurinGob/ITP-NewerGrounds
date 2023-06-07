// #################### SETUP
// constants
const SCREEN_WIDTH = 230;
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
document.getElementById("canvasAnchor").appendChild(GAME.view);




/* ~~~~~ Setup ~~~~~ */
let background_texture;
let background;
let platform_texture = PIXI.Texture.from(RES_URL + 'textures/penne_platform.png');
let player_texture = PIXI.Texture.from(RES_URL + 'textures/meatball_player.png');

const PLAYER = new Player();
let PLATFORMS = [];
let PLATFORM_DELTA;
let JUMP_HEIGHT = 180; //TODO: wert festlegen -> experimentell
let JUMP_VELOCITY = -7;


//non-random initial platform spawn
PLATFORMS[0] = new Platform(SCREEN_WIDTH/2, SCREEN_HEIGHT-100);
PLATFORMS[1] = new Platform(SCREEN_WIDTH/3, SCREEN_HEIGHT-200);    





loadRessources();

/* ~~~~~ Loop ~~~~~ */
function gameLoop(delta) {

    PLAYER.applyGravity(delta);
    PLAYER.applyVelocity_x(delta);
    PLAYER.mapWrap();
    PLAYER.updateSprite();

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
        }
    }

    //New platform spawn
    PLATFORM_DELTA = (Math.random() * (JUMP_HEIGHT - PLAYER.sprite.height) + PLAYER.sprite.height);
    //if the Delta above the top platform reaches a threshold
    if (PLATFORMS[PLATFORMS.length - 1].position_y - PLATFORM_DELTA > -Number.MAX_SAFE_INTEGER) {
        // Create a new platform above the top platform at vertical distance PLATFORM_DELTA
        const newPlatform = new Platform(Math.random() * SCREEN_WIDTH, PLATFORMS[PLATFORMS.length - 1].position_y - PLATFORM_DELTA);
        newPlatformSprite(newPlatform);
        PLATFORMS.push(newPlatform);
      
        // Calculate a new PLATFORM_DELTA for the next platform
        PLATFORM_DELTA = Math.random() * (JUMP_HEIGHT - PLAYER.sprite.height) + PLAYER.sprite.height;
    }

    //delete all Platforms that go out of bounds
    for(let i=0; i<PLATFORMS.length; i++){
        if(PLATFORMS[i].position_y > Screen.height){
            delete PLATFORMS[i];
        }
    }

    //debugging
    for(let i=0; i<PLATFORMS.length-1; i++){
        if(PLATFORMS[i].position_x == 0){
            console.log(PLATFORMS[i]);
        }
    } 

    //Gameplay
    controlPlayer();

}




//--------------------------- Setup Functions --------------------------------------------------

async function loadRessources() {
    background_texture = await PIXI.Assets.load('../../static/games/noodleJump/res/textures/background.avif');

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
    PLAYER.sprite.position.set(0);

    for (let i=0; i<INITIAL_PLATFORMS; i++){
        PLATFORMS[i].sprite = new PIXI.Sprite(platform_texture);
        PLATFORMS[i].sprite.width = 200;
        PLATFORMS[i].sprite.height = 30;
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
    Platform.sprite.width = 200;
    Platform.sprite.height = 30;

    GAME.stage.addChild(Platform.sprite);
}