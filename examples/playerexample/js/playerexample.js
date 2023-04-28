// #################### SETUP
// constants
const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 400;
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

// #################### scene setup (loading of all objects)
var SHEET;
var player;
var gameLoaded;
loadRessources()

GAME.ticker.add(gameLoop);
GAME.ticker.maxFPS = MAX_FPS;

player_running = false

// #################### gameloop
function gameLoop(delta) {
    if (gameLoaded) {
        if (keys['d']) {
            if (!player_running) {
                player.textures = SHEET.animations['adventurer-run'];
                player_running = true;
                player.play();
            }
        } else if (!keys['d']) { // TODO: WARUMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
            player.textures = SHEET.animations['adventurer-idle'];
            player.play();
            player_running = false;
        }
    }
}

async function loadRessources() {
    SHEET = await PIXI.Assets.load('res/player/player.json');
    loadstuff();
}
async function loadstuff() {
    player = new PIXI.AnimatedSprite(SHEET.animations['adventurer-idle']);
    player.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    player.anchor.set(0.5);
    player.position.x = SCREEN_WIDTH/2;
    player.position.y = SCREEN_HEIGHT/2;
    player.animationSpeed = 0.1;
    player.scale.set(5);
    player.play()
    GAME.stage.addChild(player);
    gameLoaded = true;
}

// http://localhost/ITP-NewerGrounds/examples/playerexample/playerexample.html