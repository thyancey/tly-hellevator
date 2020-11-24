import Phaser from 'phaser';

import img_elevatorPlate from '../assets/elevator-plate.png';
import { spawnDoor } from '../spawn';

export const STATUS = {
  NEITHER: 0,
  UP: 1,
  DOWN: 2,
  BOTH: 3,
}

const animationStatus = {
  [STATUS.NEITHER]: 'elevatorPlate_neither',
  [STATUS.UP]: 'elevatorPlate_up',
  [STATUS.DOWN]: 'elevatorPlate_down',
  [STATUS.BOTH]: 'elevatorPlate_both'
}

class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, physicsGroup, spawnData) {
    super(scene, spawnData.x, spawnData.y, 'elevatorPlate');
    // this.isAlive = true;
    this.floorIdx = spawnData.floorIdx;

    //- parent stuff
    scene.add.existing(this);
    if(!isNaN(spawnData.depth)) {
      this.setDepth(spawnData.depth);
    }

    this.alpha = 1;

    this.setStatus(STATUS.NEITHER, true);
  }

  update(){
  }

  setEStatus(queue){
    if(queue.length === 0){
      this.setStatus(STATUS.NEITHER);
    }else if(queue.length === 1){
      if(queue[0].direction === 'up'){
        this.setStatus(STATUS.UP);
      }else{
        this.setStatus(STATUS.DOWN);
      }
    }else{
      this.setStatus(STATUS.BOTH);
    }
  }

  setStatus(status, force){
    if(force || this.status !== status){
      console.log(`setting plate ${this.floorIdx} to ${status}`);
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

const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('elevatorPlate', img_elevatorPlate, { frameWidth: 13, frameHeight: 22 });
}

const initSprites = (sceneContext) => {
  sceneContext.anims.create({
    key: 'elevatorPlate_neither',
    frames: [ { key: 'elevatorPlate', frame: 0 } ],
    frameRate: 0
  });
  sceneContext.anims.create({
    key: 'elevatorPlate_up',
    frames: [ { key: 'elevatorPlate', frame: 1 } ],
    frameRate: 0
  });
  sceneContext.anims.create({
    key: 'elevatorPlate_down',
    frames: [ { key: 'elevatorPlate', frame: 2 } ],
    frameRate: 0
  });
  sceneContext.anims.create({
    key: 'elevatorPlate_both',
    frames: [ { key: 'elevatorPlate', frame: 3 } ],
    frameRate: 0
  });
}

export default {
  Entity,
  initSprites,
  initSpritesheet
}