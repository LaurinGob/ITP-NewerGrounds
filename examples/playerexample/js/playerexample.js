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
GAME.ticker.add(gameLoop);
GAME.ticker.maxFPS = MAX_FPS;

// #################### scene setup (loading of all objects)
// loader.add("spritesheet", "res/adventurer_spritesheet.png");

const sheet = PIXI.Assets.load('res/adventurer_spritesheet.json');
const spritesheet = new PIXI.Spritesheet(PIXI.BaseTexture.from(sheet.meta.image), sheet)


// loader.load((loader, resources) => {
//     sprites.spritesheet = new PIXI.TilingSprite(resources.spritesheet.texture);
// });

let player = new PIXI.AnimatedSprite(spritesheet.animations.idle);
player.anchor.set(0.5);
player.position.x = SCREEN_WIDTH/2;
player.position.y = SCREEN_HEIGHT/2;
GAME.stage.addChild(player);

// #################### gameloop
function gameLoop(delta) {
    player.play();
}

// http://localhost/ITP-NewerGrounds/examples/playerexample/playerexample.html