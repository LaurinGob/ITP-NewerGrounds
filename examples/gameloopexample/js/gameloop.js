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

// adds the gameloop function to ticker (pixi.js)
GAME.ticker.add(gameLoop); // IMPORTANT !!!!! - the gameloop function is added to the game
GAME.ticker.maxFPS = MAX_FPS; // sets maximum fps for render (standard: 60)

const CANVASANCHOR = document.getElementById("canvasAnchor");
// adds pixi canvas to selected dom
CANVASANCHOR.appendChild(GAME.view);
CANVASANCHOR.style.position = 'relative';

// #################### SETUP of a text / sprite object to render (not important to this example)
const textField = new PIXI.Text('Gameloop Example', {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0x1c1cff,
    align: 'center',
});
GAME.stage.addChild(textField);

var movingSprite = new PIXI.Graphics();
movingSprite.beginFill(0xFFFF00);
movingSprite.drawRect(0, 100, 50, 50);
GAME.stage.addChild(movingSprite);

// #################### GAMELOOP FUNCTION IS DECLARED
let framecount = 0;
let speed = 5;
function gameLoop(delta) {
    // everything in here is done every frame
    // delta is elapsed time since previous frame -> used to make gamestate framerate independent (very important!)
    textField.text = 'test ' + framecount;
    movingSprite.position.x += delta * speed;
    if (movingSprite.position.x + movingSprite.width > SCREEN_WIDTH) {
        movingSprite.position.x = 0;
    }
    framecount++;
}

// http://localhost/ITP-NewerGrounds/examples/uiexample/uiexample.html