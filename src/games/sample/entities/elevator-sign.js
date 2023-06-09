import Phaser from 'phaser';

import img_elevatorSign from '../assets/elevator-sign.png';

export const STATUS = {
  IDLE: 0,
}

export const DIRECTION = {
  UP: 'up',
  DOWN: 'down'
}
export const ORIENTATION = {
  TOWARDS: 'red',
  AWAY: 'green'
}

class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, physicsGroup, spawnData) {
    super(scene, spawnData.x, spawnData.y, 'elevatorSign');
    // this.isAlive = true;

    this.sFloorIdx = 0;
    this.sDirection = DIRECTION.UP;
    this.sOrientation = ORIENTATION.TOWARDS;

    //- parent stuff
    scene.add.existing(this);
    if(!isNaN(spawnData.depth)) {
      this.setDepth(spawnData.depth);
    }

    this.setStatus(STATUS.IDLE, true);
  }

  update(){
  }

  notifyElevatorState(payload){
    // console.log('sign: setFloor', payload.floorIdx);
    this.sFloorIdx = payload.floorIdx;
    this.sDirection = payload.direction || this.sDirection;
    this.sOrientation = payload.orientation || this.sOrientation;

    this.renderSign();
  }

  renderSign(){
    const anim = `eSign_p${this.sFloorIdx}_${this.sDirection}_${this.sOrientation}`
    this.anims.play(anim);
  }

  setStatus(status, force){
    if(force || this.status !== status){
      this.status = status;

      /*
      switch(this.status){
        default: true;
      }
      */

      this.renderSign();

      // const animKey = `eSign_p${this.sFloorIdx}_${this.sDirection}_${this.sOrientation}`;
      // if(animKey){
      //   // console.log('playing ', animKey);
      //   this.anims.play(animKey);
      // }
    }
  }
}

const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('elevatorSign', img_elevatorSign, { frameWidth: 58, frameHeight: 20 });
}

const initSprites = (sceneContext) => {
  initSignSprites(sceneContext);
}

const initSignSprites = (sceneContext, numFloors) => {
  //- ups

  let dirMarker;
  let colorMarker;
  let rowIdx = 0;

  initSignSpriteScheme(sceneContext, 5, 0, 'up', 'red');
  initSignSpriteScheme(sceneContext, 5, 1, 'down', 'red');
  initSignSpriteScheme(sceneContext, 5, 2, 'up', 'green');
  initSignSpriteScheme(sceneContext, 5, 3, 'down', 'green');
}

const initSignSpriteScheme = (sceneContext, numFloors, rowIdx, dirMarker, colorMarker) => {
  for(let i = 0; i < numFloors; i++){
    let frameIdx = i + (rowIdx * numFloors);
    sceneContext.anims.create({
      key: `eSign_p${i}_${dirMarker}_${colorMarker}`,
      frames: [ { key: 'elevatorSign', frame: frameIdx } ],
      frameRate: 0
    });
  }
}



export default {
  Entity,
  initSprites,
  initSpritesheet
}