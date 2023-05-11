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
GAME.ticker.add(gameLoop);
GAME.ticker.maxFPS = MAX_FPS;

const CANVASANCHOR = document.getElementById("canvasAnchor");
// adds pixi canvas to selected dom
CANVASANCHOR.appendChild(GAME.view);
CANVASANCHOR.style.position = 'relative'; // VERY IMPORTANT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// ####################### UI Setup

// set up ui elements and add to uianchor
const UIANCHOR = document.createElement("div"); // the root element of UI
UIANCHOR.setAttribute("id", "uiAnchor");
UIANCHOR.style.fontFamily = 'Calibri'; // defines font for ui
UIANCHOR.style.fontWeight = 'bolder'; // defines font for ui


// positioning
const UIPOSITION = document.createElement("div"); // sub element of UI, used to position elements
UIPOSITION.style.position = 'absolute';
UIPOSITION.style.top = '10px';
UIPOSITION.style.left = '10px';

UIANCHOR.appendChild(UIPOSITION);

// ####################### ui elements
const ANIMATIONFRAME_ELEMENT = document.createElement("h1"); // generate a dom to write to
ANIMATIONFRAME_ELEMENT.innerText = 'Current Frame animation:'; // static text for the element

const ANIMATIONFRAME_SPAN = document.createElement("span"); // the elements containing the dynamic text
ANIMATIONFRAME_SPAN.setAttribute("id", "animation_frame"); // to later call the span
ANIMATIONFRAME_ELEMENT.appendChild(ANIMATIONFRAME_SPAN); // add span to element
UIPOSITION.appendChild(ANIMATIONFRAME_ELEMENT); // add to UIPosition

const ANIMATIONSPEED_ELEMENT = document.createElement("h1"); // generate a dom to write to
ANIMATIONSPEED_ELEMENT.innerText = 'Current animation speed:'; // static text for the element

const ANIMATIONSPEED_SPAN = document.createElement("span"); // the elements containing the dynamic text
ANIMATIONSPEED_SPAN.setAttribute("id", "animation_speed"); // to later call the span
ANIMATIONSPEED_ELEMENT.appendChild(ANIMATIONSPEED_SPAN); // add span to element
UIPOSITION.appendChild(ANIMATIONSPEED_ELEMENT); // add to UIPosition

// hang UI into canvas
CANVASANCHOR.appendChild(UIANCHOR);

// TODO: JQUERY Version
//$("#mapimg").append("<div class='"+index+"'><img  class='poi marker' src='img/marker.png' style='top: " +response[index].coordy+ "px; left: "+response[index].coordx+"px;'></div>");


// #################### GAME SETUP (not important for this demonstration)
// #################### Loading texture into animation sprite
const textureArray = [];
for (let i = 1; i <= 8; i++) {
    textureArray.push(PIXI.Texture.from("res/textures/running"+i+".png"));
}

let runningGuy = new PIXI.AnimatedSprite(textureArray);

// #################### setting up sprite runningGuy
runningGuy.anchor.set(0.5);
runningGuy.position.x = SCREEN_WIDTH/2;
runningGuy.position.y = SCREEN_HEIGHT/2;
runningGuy.animationSpeed = 0.2;
GAME.stage.addChild(runningGuy);

let frameCount = 0;
// #################### GAMELOOP
function gameLoop(delta) {
    runningGuy.play();
    frameCount++;
    if (frameCount % 150 == 0) {
        runningGuy.animationSpeed = Math.floor(Math.random() * 10) / 10;
    }

    // #################### UPDATE THE UI (in this case with current frame of animation)
    ANIMATIONFRAME_SPAN.innerText = runningGuy.currentFrame;
    ANIMATIONSPEED_SPAN.innerText = runningGuy.animationSpeed;

    UIPOSITION.style.top = (frameCount % 200) + 'px'; // moves ui elements dynamic
}

// http://localhost/ITP-NewerGrounds/examples/uiexample/uiexample.html