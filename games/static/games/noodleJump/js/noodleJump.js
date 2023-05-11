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
const PLAYER = new Player();
let PLATFORMS = [];
for (let i=0; i<MAX_PLATFORMS; i++){
    PLATFORMS[i] = new Platform(Math.random()*SCREEN_WIDTH, Math.random()*SCREEN_HEIGHT);
}

async function loadRessources() {
    background_texture = await PIXI.Assets.load('../../static/games/noodleJump/res/textures/background.avif');
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
    PLAYER.updateSprite();
    for (let i=0; i<MAX_PLATFORMS; i++){
        PLATFORMS[i].updateSprite;
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

    //constantly jumping on collision
    

}

function setup(){
    GAME.stage.addChild(background);
    GAME.stage.addChild(PLAYER.sprite);
    for (let i=0; i<MAX_PLATFORMS; i++){
        GAME.stage.addChild(PLATFORMS[i]);
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
    return 1;
}