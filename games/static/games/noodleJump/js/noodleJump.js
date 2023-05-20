// #################### SETUP
// constants
const SCREEN_WIDTH = 960;
const SCREEN_HEIGHT = 540;
const BG_COLOR = 0xCCCCFF;
const MAX_FPS = 60;
const RES_URL = '../../static/games/noodleJump/res/';
const MAX_PLATFORMS = 6;

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


/* ~~~~~ Setup ~~~~~ */
let background_texture;
let background;
let platform_texture = PIXI.Texture.from('../../static/games/noodleJump/res/textures/penne_platform.png');
let player_texture = PIXI.Texture.from('../../static/games/noodleJump/res/textures/meatball_player.png');;

const PLAYER = new Player();
let PLATFORMS = [];
for (let i=0; i<MAX_PLATFORMS; i++){
    PLATFORMS[i] = new Platform(Math.random()*SCREEN_WIDTH, Math.random()*SCREEN_HEIGHT);
}

//sprites
PLAYER.sprite = new PIXI.Sprite(player_texture);
PLAYER.sprite.width = 100;
PLAYER.sprite.height = 100;
PLAYER.sprite.position.set(0);

for (let i=0; i<MAX_PLATFORMS; i++){
    PLATFORMS[i].sprite = new PIXI.Sprite(platform_texture);
    PLATFORMS[i].sprite.width = 200;
    PLATFORMS[i].sprite.height = 30;
}


async function loadRessources() {
    background_texture = await PIXI.Assets.load('../../static/games/noodleJump/res/textures/background.avif');

    /*
    platform_texture = await PIXI.Assets.load('../../static/games/noodleJump/res/textures/penne_platform.png');
    player_texture = await PIXI.Assets.load('../../static/games/noodleJump/res/textures/meatball_player.png');
    */

    createSprites();
}

function createSprites() {
    background = new PIXI.TilingSprite(background_texture);
    background.width = SCREEN_WIDTH;
    background.height = SCREEN_HEIGHT;
    background.position.set(0);
    
    setup();
}

loadRessources();

/* ~~~~~ Loop ~~~~~ */
function gameLoop(delta) {
    PLAYER.applyGravity(delta);
    PLAYER.applyVelocity(delta);
    PLAYER.mapWrap();
    PLAYER.updateSprite();
    for (let i=0; i<MAX_PLATFORMS; i++){
        //update platform sprites
        PLATFORMS[i].updateSprite();

        //check for collision with player
        if(playerJump(PLAYER.sprite.getBounds(), PLATFORMS[i].sprite.getBounds()) && PLAYER.velocity_y >= 0){
            PLAYER.velocity_y = -7;
        }
    }

    //key input

    if (keys['a']) {
        PLAYER.velocity_x += -0.05;
    }
    if (keys['d']) {
        PLAYER.velocity_x += 0.05;
    }
    if (!(keys['a'] || keys['d'])) {
        PLAYER.velocity_x /= 2;
    }
}

function setup(){
    GAME.stage.addChild(background);
    GAME.stage.addChild(PLAYER.sprite);
    for (let i=0; i<MAX_PLATFORMS; i++){
        GAME.stage.addChild(PLATFORMS[i].sprite);
    }
}


// #################### helper functions
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