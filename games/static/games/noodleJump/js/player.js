class Player {
    constructor() {
        this.position_x = SCREEN_WIDTH/2;
        this.position_y = SCREEN_HEIGHT/2;
        this.velocity_x = 0;
        this.velocity_y = 0;

        this.sprite;

        /*this.sprite.beginFill(0xff9999);
        this.sprite.drawRect(0, 0, 50, 50);*/

        //this.sprite.anchor.set(0.5);
        // GAME.stage.addChild(movingSprite);
    }

    updateSprite() {
        this.sprite.position.x = this.position_x;
        this.sprite.position.y = this.position_y;
    }
    
    applyVelocity_x(delta) {
        this.position_x += this.velocity_x * delta;
    }

    applyVelocity_y(delta) {
        this.position_y += this.velocity_y * delta;
    }
    
    applyGravity(delta) {
        if (this.position_y < SCREEN_HEIGHT - this.sprite.height) {
            this.velocity_y += 0.1;
            return false;
        } else {
            // game end
            this.velocity_y = 0;
            return true;
        }
    }

    mapWrap(){
        if(this.position_x < -this.sprite.width/2){
            this.position_x = SCREEN_WIDTH - this.sprite.width/2;
        }
        if(this.position_x > SCREEN_WIDTH - this.sprite.width/2){
            this.position_x = - this.sprite.width/2;
        }
    }

}