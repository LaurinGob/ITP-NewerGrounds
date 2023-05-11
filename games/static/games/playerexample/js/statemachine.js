class StateMachine {
    constructor(allowed_states) {
        this.states = allowed_states;
        this.current_state = 'idle';
    }
    isStateValid(state) {
        return this.states[this.current_state].includes(state);
    }
    moveToState(state) {
        if (this.isStateValid(state)) {
            //console.log("moving from " + this.current_state + " to " + state);
            this.current_state = state;
        } else {
            //console.log("moving from " + this.current_state + " to " + state + " is not a valid move!");
        }
    }
    getState() {
        return this.current_state;
    }
}