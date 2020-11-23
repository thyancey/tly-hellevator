import Phaser from 'phaser';

import img_elevator from '../assets/elevator.gif';
export const ELEVATOR_SPEED = .3;

export const STATUS = {
  IDLE: 0,
}
 
const animationStatus = {
  [STATUS.IDLE]: 'elevator_idle'
}

class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, physicsGroup, spawnData) {
    super(scene, spawnData.x, spawnData.y, 'elevator');
    // this.isAlive = true;
    this.floorHeights = spawnData.floorHeights;
    this.curFloor = 0;
    // this.targFloor = this.floorHeights.length - 1;
    this.targFloor = 1;

    //- parent stuff
    scene.add.existing(this);
    if(!isNaN(spawnData.depth)) {
      this.setDepth(spawnData.depth);
    }

    this.setStatus(STATUS.IDLE, true);
  }

  update(){
    if(this.curFloor !== this.targFloor){
      const diff = this.checkElevationChange();
      console.log('diff:', diff);
      this.setPosition(this.x, this.y + diff);
    }
    // this.y -= this.ySpeed;
    // console.log('moving to ', this.movingTo)
  }

  checkElevationChange(){
    const startY = this.floorHeights[this.curFloor];
    const targY = this.floorHeights[this.targFloor];

    const diffY = targY - this.y;
    if(Math.abs(diffY) < 1){
      this.curFloor = this.targFloor;
      return 0;
    }else{
      if(diffY < 0){
        return -ELEVATOR_SPEED;
      }else{
        return ELEVATOR_SPEED;
      }
    }
  }

  setStatus(status, force){
    if(force || this.status !== status){
      this.status = status;

      /*
      switch(this.status){
        default: true;
      }
      */

      const animKey = animationStatus[this.status];
      if(animKey){
        // console.log('playing ', animKey);
        this.anims.play(animKey);
      }
    }
  }
}

const initSprites = (sceneContext) => {
  sceneContext.anims.create({
    key: 'elevator_idle',
    frames: [ { key: 'elevator', frame: 0 } ],
    frameRate: 10
  });
}


const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('elevator', img_elevator, { frameWidth: 113, frameHeight: 70 });
}

export default {
  Entity,
  initSprites,
  initSpritesheet
}