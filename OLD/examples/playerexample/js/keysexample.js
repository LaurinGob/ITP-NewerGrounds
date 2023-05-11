// keys array
let keys = {};

// adds eventlistener for keydown and keyup and calls the function
window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);

let keysDiv = window.document.getElementById('keys');

// specified functions for event listener
function keysDown(e) {
    keys[e.key] = true;
    keysDiv.textContent = "keys pressed: " + JSON.stringify(keys);
}
function keysUp(e) {
    keys[e.key] = false;
    keysDiv.textContent = "keys pressed: " + JSON.stringify(keys);
}