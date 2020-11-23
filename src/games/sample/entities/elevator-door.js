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
  [STATUS.CLOSING]: 'elevatorDoor_opening',
  [STATUS.OPEN]: 'elevatorDoor_open'
}

class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, physicsGroup, spawnData) {
    super(scene, spawnData.x, spawnData.y, 'elevatorDoor');
    // this.isAlive = true;

    //- parent stuff
    scene.add.existing(this);
    if(!isNaN(spawnData.depth)) {
      this.setDepth(spawnData.depth);
    }
    // if(physicsGroup){
    //   physicsGroup.add(this);
    // }else{
    //   scene.physics.add.existing(this);
    // }

    //- physics
    // this.setBounce(.4);
    // this.setCollideWorldBounds(true);
    // this.allowGravity = false;
    
    // this.body.setSize(36,15);
    // this.body.offset.y = -2;
    this.alpha = .5;

    this.setStatus(STATUS.CLOSED, true);
  }

  update(){
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
    frameRate: 5,
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