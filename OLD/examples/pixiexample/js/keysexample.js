// keys array
let keys = {};

// adds eventlistener for keydown and keyup and calls the function
window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);

// specified functions for event listener
function keysDown(e) {
    keys[e.key] = true;
}
function keysUp(e) {
    keys[e.key] = false;
}