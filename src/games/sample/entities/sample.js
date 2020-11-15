import Phaser from 'phaser';

import img_entityName from '../assets/entity-name.png';

export const STATUS = {
  IDLE: 0,
}

const animationStatus = {
  [STATUS.IDLE]: 'entityName_idle'
}

class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, physicsGroup, spawnData) {
    super(scene, spawnData.x, spawnData.y, 'entityName');
    // this.isAlive = true;

    //- parent stuff
    scene.add.existing(this);
    if(!isNaN(spawnData.depth)) {
      this.setDepth(spawnData.depth);
    }
    if(physicsGroup){
      physicsGroup.add(this);
    }else{
      scene.physics.add.existing(this);
    }

    //- physics
    // this.setBounce(.4);
    // this.setCollideWorldBounds(true);
    // this.allowGravity = false;
    
    // this.body.setSize(36,15);
    // this.body.offset.y = -2;

    this.setStatus(STATUS.IDLE, true);
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
        console.log('playing ', animKey)
        this.anims.play(animKey);
      }
    }
  }
}

const initSprites = (sceneContext) => {
  sceneContext.anims.create({
    key: 'entityName_idle',
    frames: [ { key: 'entityName', frame: 0 } ],
    frameRate: 10
  });
}


const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('entityName', img_entityName, { frameWidth: 38, frameHeight: 22 });
}

export default {
  Entity,
  initSprites,
  initSpritesheet
}