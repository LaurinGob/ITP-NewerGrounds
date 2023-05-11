// #################### SETUP
// constants
const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 300;
const BG_COLOR = 0xCCCCFF;
const MAX_FPS = 60;

// creates new pixi object
const GAME = new PIXI.Application(
    {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: BG_COLOR,
        sharedTicker: true
    }
);

// adds pixi canvas to selected dom
document.getElementById("canvasAnchor").appendChild(GAME.view);
// adds the gameloop function to ticker (pixi.js)

// #################### scene setup (loading of all objects)
var SHEET; // Spritesheet for player
var bg1; // background for parallax effect
var bg2; // background for parallax effect
var bg3; // background for parallax effect
var backgroundBack; // background for parallax effect
var backgroundMiddle; // background for parallax effect
var backgroundFront; // background for parallax effect
var player; // player sprite
var gameLoaded;
var state;
loadRessources()

GAME.ticker.add(gameLoop); // must be called after loadRessources!
GAME.ticker.maxFPS = MAX_FPS;

const ALLOWED_STATES =  {
    "idle" : ["running", "jumping", "attack", "running_right", "running_left", "crouch", "cast"],
    "running_right" : ["idle", "jumping", "attack", "running_left", "slide_right"],
    "running_left" : ["idle", "jumping", "attack", "running_right", "slide_left"],
    "slide_right" : ["idle"],
    "slide_left" : ["idle"],
    "crouch" : ["idle"],
    "attack" : ["idle"],
    "air_attack":["idle"],
    "jumping" : ["idle", "air_attack"],
    "animation_finished" : ["idle"],
    "flying" : ["idle"],
    "running" : ["jump", "idle"],
    "cast" : ["idle", "cast-loop"],
    "cast-loop" : ["idle"]
}

const GAMESTATE = new StateMachine(ALLOWED_STATES);
let currentAnimation = GAMESTATE.getState();
const GAMESTATE_DOM = document.querySelector("#gameState");

// #################### gameloop
function gameLoop(delta) {
    if (gameLoaded) {
        state = GAMESTATE.getState()
        GAMESTATE_DOM.textContent = "current gamestate: " + JSON.stringify(state);
        getKeyInput(state);
        updateBackground(state);
        updateAnimations(state);
    }
}
function getKeyInput(state) {
    if (keys[' ']) {
        // attack
        GAMESTATE.moveToState('attack');
    }
    if(state === 'jumping' && keys[' ']){
        GAMESTATE.moveToState('air_attack');
    }
    if (keys['w']) {
        // jump
        GAMESTATE.moveToState('jumping');
    }
    if (keys['d']) {
        // run right
        GAMESTATE.moveToState('running_right');
        if (keys['s']) {
            GAMESTATE.moveToState('slide_right');
        }
    }
    if (keys['a']) {
        // run right
        GAMESTATE.moveToState('running_left');
        if (keys['s']) {
            GAMESTATE.moveToState('slide_left');
        }
    }

    if (keys['e']) {
        if (state === 'cast') {
            GAMESTATE.moveToState('cast-loop')
        } else {
            GAMESTATE.moveToState('cast');
        }
    }

    if (state === 'cast-loop' && !keys['e']) {
        GAMESTATE.moveToState('idle');
    }

    if ((state === 'running_left' || state === 'running_right')
        && !(keys['a'] || keys['d'])) {
        // BREAKING CONDITION running: if in running animation and not pressing a run button
        GAMESTATE.moveToState('idle');
    }

    if ((state === 'slide_left' || state === 'slide_right')
        && !(keys['a'] || keys['d'])) {
        // BREAKING CONDITION running: if in running animation and not pressing a run button
        GAMESTATE.moveToState('idle');
    }

    if (state === 'crouch' && !keys['s']) {
        // BREAKING CONDITION crouching: if in crouching animation and not crouching
        GAMESTATE.moveToState('idle');
    }

    if ((state === 'slide_left' || state === 'slide_right') && !keys['s']) {
        GAMESTATE.moveToState('idle');
    }

    if (keys['s']) {
        GAMESTATE.moveToState('crouch');
    }
}

function updateAnimations(state) {
    if (currentAnimation !== state) {
        // state change detected
        currentAnimation = state;
        // IMPORTANT! - every looping animation (i.e. running, jumping.. needs a break condition)
        switch (state) {
            case 'idle':
                player.textures = SHEET.animations['adventurer-idle']
                player.loop = true;
                break;
            case 'attack':
                player.textures = SHEET.animations['adventurer-attack2']
                player.loop = false;
                break;
            case 'air_attack':
                player.textures = SHEET.animations['adventurer-air-attack1']
                player.loop = false;
                break;
            case 'jumping':
                player.textures = SHEET.animations['adventurer-jump'];
                player.loop = false;
                break;
            case 'running_right':
                if (player.scale.x < 0) {
                    player.scale.x *= -1;
                }
                player.textures = SHEET.animations['adventurer-run']
                player.loop = true;
                break;
            case 'running_left':
                if (player.scale.x > 0) {
                    player.scale.x *= -1;
                }
                player.textures = SHEET.animations['adventurer-run']
                player.loop = true;
                break;
            case 'slide_right':
                if (player.scale.x < 0) {
                    player.scale.x *= -1;
                }
                player.textures = SHEET.animations['adventurer-slide']
                player.loop = true;
                break;
            case 'slide_left':
                if (player.scale.x > 0) {
                    player.scale.x *= -1;
                }
                player.textures = SHEET.animations['adventurer-slide']
                player.loop = true;
                break;
            case 'crouch':
                player.textures = SHEET.animations['adventurer-crouch']
                player.loop = true;
                break;
            case 'cast':
                player.textures = SHEET.animations['adventurer-cast']
                player.loop = false;
                break;
            case 'cast-loop':
                player.textures = SHEET.animations['adventurer-cast-loop']
                player.loop = true;
                break;
        }
    } else {
        // if no state change this frame

        // gets exectuted if a locked animation (i.e. jump, attack, ...) is finished
        player.onComplete = () => {
            GAMESTATE.moveToState('idle');
        }
    }
    // always needs to be called after texture swap
    player.play();
}

// ################# SETUP FUNCTIONS
async function loadRessources() {
    SHEET = await PIXI.Assets.load('res/player/player.json');
    bg1 = await PIXI.Assets.load("res/background/background1.png");
    bg2 = await PIXI.Assets.load("res/background/background2.png");
    bg3 = await PIXI.Assets.load("res/background/background3.png");
    createSprites();
}
async function createSprites() {
    // just some creating
    backgroundBack = new PIXI.TilingSprite(bg3);
    backgroundBack.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    backgroundBack.width = SCREEN_WIDTH;
    backgroundBack.height = SCREEN_HEIGHT;
    backgroundBack.position.set(0);
    GAME.stage.addChild(backgroundBack);
    backgroundMiddle = new PIXI.TilingSprite(bg2);
    backgroundMiddle.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    backgroundMiddle.width = SCREEN_WIDTH;
    backgroundMiddle.height = SCREEN_HEIGHT;
    backgroundMiddle.position.set(0);
    GAME.stage.addChild(backgroundMiddle);
    backgroundFront = new PIXI.TilingSprite(bg1);
    backgroundFront.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    backgroundFront.width = SCREEN_WIDTH;
    backgroundFront.height = SCREEN_HEIGHT;
    backgroundFront.position.set(0);
    GAME.stage.addChild(backgroundFront);

    player = new PIXI.AnimatedSprite(SHEET.animations['adventurer-idle']);
    player.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    player.anchor.set(0.5);
    player.position.x = SCREEN_WIDTH/2;
    player.position.y = SCREEN_HEIGHT/2;
    player.animationSpeed = 0.13;
    player.loop = true;
    player.scale.set(5);
    player.autoUpdate = true;
    GAME.stage.addChild(player);

    gameLoaded = true;
}

function updateBackground(state) {
    // moving background by different speeds to create parallax effect
    switch (state) {
        case 'running_right':
            backgroundBack.tilePosition.x -= 2;
            backgroundMiddle.tilePosition.x -= 4;
            backgroundFront.tilePosition.x -= 6;
            break;
        case 'running_left':
            backgroundBack.tilePosition.x += 2;
            backgroundMiddle.tilePosition.x += 4;
            backgroundFront.tilePosition.x += 6;
            break;
        case 'slide_right':
            backgroundBack.tilePosition.x -= 4;
            backgroundMiddle.tilePosition.x -= 8;
            backgroundFront.tilePosition.x -= 12;
            break;
        case 'slide_left':
            backgroundBack.tilePosition.x += 4;
            backgroundMiddle.tilePosition.x += 8;
            backgroundFront.tilePosition.x += 12;
            break;
    }
}

// http://localhost/ITP-NewerGrounds/examples/playerexample/playerexample.html