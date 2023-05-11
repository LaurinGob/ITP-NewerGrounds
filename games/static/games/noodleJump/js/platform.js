class Platform{
    constructor(x, y) {
        //randomize positions on spawn
        this.position_x = x;
        this.position_y = y;
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xff1010);
        this.sprite.drawRect(0, 0, 100, 10);
    }

    updateSprite() {
        this.sprite.position.x = this.position_x;
        this.sprite.position.y = this.position_y;
    }

    movePlatform(MAX_HEIGHT){
        
    }
}