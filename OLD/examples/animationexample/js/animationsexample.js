// #################### SETUP
// constants
const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 800;
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

let runningGuy1 = new PIXI.AnimatedSprite(textureArray);

// #################### setting up sprite runningGuy1
runningGuy1.anchor.set(0.5);
runningGuy1.position.x = SCREEN_WIDTH/2;
runningGuy1.position.y = SCREEN_HEIGHT/2 - 200;
runningGuy1.animationSpeed = 0.2;
GAME.stage.addChild(runningGuy1);

let runningGuy2 = new PIXI.AnimatedSprite(textureArray);

// #################### setting up sprite runningGuy2
runningGuy2.anchor.set(0.5);
runningGuy2.position.x = SCREEN_WIDTH/2;
runningGuy2.position.y = SCREEN_HEIGHT/2 + 200;
runningGuy2.animationSpeed = 0.1;
GAME.stage.addChild(runningGuy2);

function gameLoop(delta) {
    runningGuy1.play(); // plays animation in a loop
    runningGuy2.play(); // plays half speed > change with animation speed (animation speed 1 == every frame is changing animation)
    //runningGuy2.gotoAndStop(3) // goes to frame number 4 > use to animate
    //runningGuy2.gotoAndPlay(3) // plays from frame 4 > use to animate from a certain point onward e.i. go into attack and play attack
}

// http://localhost/ITP-NewerGrounds/examples/animationexample/animationsexample.html