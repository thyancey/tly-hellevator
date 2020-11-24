import Phaser from 'phaser';

import img_elevatorDoor from '../assets/elevator-door.png';

export const STATUS = {
  CLOSED: 0,
  CLOSING: 1,
  OPENING: 2,
  OPEN: 3,
}

const animationStatus = {
  [STATUS.CLOSED]: 'elevatorDoor_closed',
  [STATUS.OPENING]: 'elevatorDoor_opening',
  [STATUS.CLOSING]: 'elevatorDoor_closing',
  [STATUS.OPEN]: 'elevatorDoor_open'
}

class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, physicsGroup, spawnData) {
    super(scene, spawnData.x, spawnData.y, 'elevatorDoor');
    // this.isAlive = true;

    this.id = spawnData.id;

    //- parent stuff
    scene.add.existing(this);
    if(!isNaN(spawnData.depth)) {
      this.setDepth(spawnData.depth);
    }

    this.alpha = 1;

    this.setStatus(STATUS.CLOSED, true);
  }

  update(){
  }

  open(){
    // console.log(`door ${this.id} is opening`);
    this.setStatus(STATUS.OPENING);
  }
  close(){
    // console.log(`door ${this.id} is closing`);
    this.setStatus(STATUS.CLOSING);
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

const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('elevatorDoor', img_elevatorDoor, { frameWidth: 205, frameHeight: 70 });
}

const initSprites = (sceneContext) => {
  sceneContext.anims.create({
    key: 'elevatorDoor_closed',
    frames: [ { key: 'elevatorDoor', frame: 0 } ],
    frameRate: 10
  });
  sceneContext.anims.create({
    key: 'elevatorDoor_opening',
    frames: sceneContext.anims.generateFrameNumbers('elevatorDoor', { start: 0, end: 2 }),
    frameRate: 3,
    repeat: 0
  });
  sceneContext.anims.create({
    key: 'elevatorDoor_closing',
    frames: sceneContext.anims.generateFrameNumbers('elevatorDoor', { start: 0, end: 2 }).reverse(),
    frameRate: 3,
    repeat: 0
  });
  sceneContext.anims.create({
    key: 'elevatorDoor_open',
    frames: [ { key: 'elevatorDoor', frame: 2 } ],
    frameRate: 10
  });
}

export default {
  Entity,
  initSprites,
  initSpritesheet
}