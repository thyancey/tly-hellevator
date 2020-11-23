import Phaser from 'phaser';

import img_elevator from '../assets/elevator.gif';
export const ELEVATOR_SPEED = .6;
export const FLOOR_SIT_TIME = 1000;

export const STATUS = {
  IDLE: 0,
  PAUSING: 1,
  MOVING: 2
}
 
const animationStatus = {
  [STATUS.IDLE]: 'elevator_idle',
  [STATUS.PAUSING]: 'elevator_idle',
  [STATUS.MOVING]: 'elevator_idle'
}

class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, physicsGroup, spawnData, onIdle) {
    super(scene, spawnData.x, spawnData.y, 'elevator');
    // this.isAlive = true;
    this.id = spawnData.id;
    this.floorHeights = spawnData.floorHeights;
    this.curFloor = 0;
    // this.targFloor = this.floorHeights.length - 1;
    this.targFloor = 0;
    this.onIdle = onIdle;

    //- parent stuff
    scene.add.existing(this);
    if(!isNaN(spawnData.depth)) {
      this.setDepth(spawnData.depth);
    }

    this.setStatus(STATUS.IDLE, true);
  }

  update(){}

  goToCommand(command){
    this.targFloor = command.floorIdx;
    return this.targFloor > this.curFloor;
  }

  goToFloor(command){
    this.targFloor = command.floorIdx;
    console.log(`elevator ${this.id} going to ${this.targFloor}`)
  }

  updateWithPosition(){
    if(this.curFloor !== this.targFloor){
      const diff = this.checkElevationChange();
      // console.log('diff:', diff);
      this.setStatus(STATUS.MOVING);
      this.setPosition(this.x, this.y + diff);
      return false;
    }else{
      if(this.status === STATUS.MOVING){
        this.startPauseTimer();
        this.onIdle(this.id);
        return true;
      }

      return true;
    }
    // this.y -= this.ySpeed;
    // console.log('moving to ', this.movingTo)
  }

  startPauseTimer(){
    this.killPauseTimer();
    this.setStatus(STATUS.PAUSING);
    console.log(`${this.id} now PAUSING`);
    this.pauseTimer = global.setTimeout(() => {
      console.log(`${this.id} now IDLE`);
      this.setStatus(STATUS.IDLE);
    }, FLOOR_SIT_TIME)
  }

  killPauseTimer(){
    if(this.pauseTimer){
      global.clearTimeout(this.pauseTimer);
      this.pauseTimer = null;
    }
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