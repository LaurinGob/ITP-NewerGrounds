// keys array
let keys = {};

// adds eventlistener for keydown and keyup and calls the function
window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);

// specified functions for event listener
function keysDown(e) {
    keys[e.key] = true;
    keysDiv.textContent = JSON.stringify(keys);
}
function keysUp(e) {
    keys[e.key] = false;
    keysDiv.textContent = JSON.stringify(keys);
}

// ############### example code
// displays pressed key on this element
let keysDiv;
keysDiv = document.querySelector("#keys");

// example usage (usually inside the gameloop) - the keycode map is found in utils.js
if (keys["w"]) {
    // do something
    console.log("up");
}