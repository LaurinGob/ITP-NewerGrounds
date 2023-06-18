// #################### SETUP
// constants
const SCREEN_WIDTH = 960;
const SCREEN_HEIGHT = 540;
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

// #################### UI setup
const uiRockCounter = document.getElementById("uiRockCounter");
const uiHealth = document.getElementById("uiHealth");
const uiChain = document.getElementById("uiChain");
const uiComboMultiplier = document.getElementById("uiComboMultiplier");

var updateUi = function() {
    uiRockCounter.innerText = rockCounter;
    uiChain.innerText = chain;
    uiHealth.innerText = health;
    uiComboMultiplier.innerText = comboMultiplier;
}

/* #################### scene setup (loading of all objects)
var x = document.getElementById("soundtrack");
x.loop = true;
x.play();
*/

let background = PIXI.Sprite.from("../../static/games/pixiexample/res/textures/BG_Holztisch.jpg");
background.anchor.set(0.5);
background.width = SCREEN_WIDTH;
background.height = SCREEN_HEIGHT;
background.position.x = SCREEN_WIDTH/2;
background.position.y = SCREEN_HEIGHT/2;
GAME.stage.addChild(background);

let player = PIXI.AnimatedSprite.fromImages(["../../static/games/pixiexample/res/textures/TheRock.png","../../static/games/pixiexample/res/textures/TheRockLaser.png"]);
player.anchor.set(0.5);
player.width = 67;
player.height = 76;
player.position.x = SCREEN_WIDTH/2;
player.position.y = SCREEN_HEIGHT - SCREEN_HEIGHT * 0.8;
GAME.stage.addChild(player);

let floor = PIXI.Sprite.from("../../static/games/pixiexample/res/textures/floor.jpg");
floor.height = 100;
floor.position.x = 0;
floor.position.y = SCREEN_HEIGHT - floor.height;
floor.width = SCREEN_WIDTH;
GAME.stage.addChild(floor);

const groundbreakSprites = [];
for (let i = 1; i <= 3; i++) {
    groundbreakSprites.push(PIXI.Texture.from("../../static/games/pixiexample/res/textures/groundbreak"+i+".png"));
}
let groundbreak = new PIXI.AnimatedSprite(groundbreakSprites);
GAME.stage.addChild(groundbreak);
groundbreak.anchor.set(0.5);
groundbreak.animationSpeed = 0.2;
groundbreak.visible = false;
groundbreak.loop = false;

//Game design variables
let enemyArray = [];
let numberOfStones = 10;
let speed = 15;
let playerFallingSpeed = 6;
let ramenFallingSpeed = 2;
let rockCounter = 0;
let health = 10;
let chain = 0;
let comboMultiplier = 0;

const enemyTexture1 = PIXI.Texture.from("../../static/games/pixiexample/res/textures/Ramen_blue.png"); 
const enemyTexture2 = PIXI.Texture.from("../../static/games/pixiexample/res/textures/Ramen_green.png");
const enemyTexture3 = PIXI.Texture.from("../../static/games/pixiexample/res/textures/Ramen_red.png");

for (let i = 0; i < numberOfStones; i++) {
    if(i % 3 == 0){
        enemyArray.push(PIXI.Sprite.from(enemyTexture1));
    }
    else if(i % 3 == 1){
        enemyArray.push(PIXI.Sprite.from(enemyTexture2));
    }
    else{
        enemyArray.push(PIXI.Sprite.from(enemyTexture3));
    }
    
    enemyArray[i].scale.set(0.1, 0.1);
    enemyArray[i].anchor.set(0.5);
    enemyArray[i].position.x = getRandomInt(SCREEN_WIDTH);
    enemyArray[i].position.y = Math.random() * 300;
    //tempnumber = 1 + Math.random();
    //enemyArray[i].scale.set(tempnumber,tempnumber);
    GAME.stage.addChild(enemyArray[i]);
}

// adds the gameloop function to ticker (pixi.js)
GAME.ticker.add(gameLoop);
GAME.ticker.maxFPS = MAX_FPS;

let y_velocity = 0;
let player_airborne = false;
let player_jumping = false;
let jump_release = true;
let prepare_impact = true;

//Game Over Condition
function checkGameOver(){
    if(health <= 0){
        GAME.ticker.stop();
    }
}

// #################### gameloop
function gameLoop(delta) {
    // main gameloop for the game logic
    if (player.position.y < SCREEN_HEIGHT - floor.height - (player.height/2) || y_velocity < 0) {
        y_velocity += playerFallingSpeed * delta;
        if (y_velocity > 0) {
            player_jumping = false;
            prepare_impact = true;
        }
    } else {
        y_velocity = 0;
        player.position.y = SCREEN_HEIGHT - floor.height - (player.height/2);
        player_airborne = false;
        // set groundbreak at impact
        if (prepare_impact) {
            groundbreak.position.x = player.position.x;
            groundbreak.position.y = SCREEN_HEIGHT - floor.height / 2;
            groundbreak.gotoAndStop(0);
            groundbreak.play();
            groundbreak.visible = true;
            setTimeout(function() {groundbreak.visible = false;}, 700);
            prepare_impact = false;
            setTimeout(function() {jump_release = true;player.gotoAndStop(1);}, 400);
        }
    }
    player.position.y += y_velocity * delta;
    if (keys['87'] && jump_release) {
        player.gotoAndStop(0);
        jump_release = false;
        // w key move up
        if (player_airborne === false) {
            player_jumping = true;
            player_airborne = true;
            y_velocity = -65;
        }
    }
    if (keys['65']) {
        // a key move left
        if (player.position.x > 0 + player.height/2) {
            player.position.x -= speed * delta;
        }
    }
    if (keys['68']) {
        // d key move right
        if (player.position.x < SCREEN_WIDTH - player.height/2) {
            player.position.x += speed * delta;
        }
    }

    for (let i = 0; i < numberOfStones; i++) {
        if (AABBintersection(enemyArray[i].getBounds(), player.getBounds())) {
            if (player_jumping || enemyArray[i].getBounds().bottom > player.getBounds().bottom - 30) {
                // eat
                const emitter = createRamenEmitter(enemyArray[i], i);
                enemyArray[i].position.x = getRandomInt(SCREEN_WIDTH);
                enemyArray[i].position.y = 0;
                //tempnumber = 1 + Math.random();
                //enemyArray[i].scale.set(tempnumber,tempnumber);
                chain++;
                comboMultiplier = Math.floor(chain/5);
                rockCounter += comboMultiplier;
                updateUi();
            } else {
                // get damage
                enemyArray[i].position.x = getRandomInt(SCREEN_WIDTH);
                enemyArray[i].position.y = 0;
                chain = 0;
                comboMultiplier = Math.floor(chain/5);
                rockCounter += comboMultiplier;
                health--;
                updateUi();
            }
        }
        enemyArray[i].position.y += ramenFallingSpeed + (0.1 * Math.random()) * delta;

        if (enemyArray[i].position.y > SCREEN_HEIGHT) {
            enemyArray[i].position.x = getRandomInt(SCREEN_WIDTH);
            enemyArray[i].position.y = 0;
        }
    }

    checkGameOver();
}



const createRamenEmitter = function(enemyRamen, ramenIndex){
    //Particle Library setup
    const { Container, ParticleContainer, Texture, Ticker } = PIXI;
    const cnt = new ParticleContainer();
    GAME.stage.addChild(cnt);           //add emitter to GAME.stage

    let enemyTexture = enemyTexture3;
    if(ramenIndex % 3 === 0){
        enemyTexture = enemyTexture1;
        console.log("2");
    }
    else if(ramenIndex % 3 === 1){
        console.log("3");
        enemyTexture = enemyTexture2;
    }


    //create emitter
    const emitter = new PIXI.particles.Emitter(cnt, {
        lifetime: { min: 0.1, max: 3 },
        frequency: 0.1,           //time in seconds between particles
        spawnChance: 1,         //0-1 chance of spawning a particle each spawn event
        particlesPerWave: 5,    //Optional
        emitterLifetime: 0.5,   //Seconds until emitter stops
        maxParticles: 30,       //Optional max simultaneous particles
        pos: { x: enemyRamen.position.x, y: enemyRamen.position.y },
        autoUpdate: true,       //ties the emitter to the PixiJS ticker
        behaviors: [
            {
                type: 'spawnShape',
                config: {
                    type: 'rect',
                    data: { x: -60, y: 0, w: 120, h: 70}
                },
            },
            {
                type: 'textureSingle', config: { texture: enemyTexture }
            },
            {
                type: 'scale',
                config: {
                    scale: {
                        list: [{value: 0.01, time: 0}, {value: 0.001, time: 1}]
                    }
                }
            },
            {
                type: 'moveAcceleration',
                config: {
                    accel: {
                        x:0,
                        y:200
                    },
                    minStart: 10,
                    maxStart: 20,
                    rotate: true
                }
            }
        ],
    });

    return emitter;
}

// Particles configuration End -------------------------------------------------------------------

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

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}