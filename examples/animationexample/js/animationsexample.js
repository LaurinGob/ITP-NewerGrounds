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

// #################### Loading texture into animation sprite
const textureArray = [];
for (let i = 1; i <= 8; i++) {
    textureArray.push(PIXI.Texture.from("res/textures/running"+i+".png"));
}

let runningGuy = new PIXI.AnimatedSprite(textureArray);

// #################### setting up sprite
runningGuy.anchor.set(0.5);
runningGuy.position.x = SCREEN_WIDTH/2;
runningGuy.position.y = SCREEN_HEIGHT/2;
runningGuy.animationSpeed = 0.2;
GAME.stage.addChild(runningGuy);

function gameLoop(delta) {
    runningGuy.play();
}

// http://localhost/ITP-NewerGrounds/examples/animationexample/animationsexample.html