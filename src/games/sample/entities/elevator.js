import Phaser from 'phaser';

import img_elevator from '../assets/elevator.png';
import { removeFromQueue } from '../utils/elevator-boss';
export const ELEVATOR_SPEED = .6;
export const FLOOR_SIT_TIME = 1000;
export const FLOOR_CHECK_OFFSET = 50; //- offset for how early an elevator updates which floor its on (vs the exact bottom0)

export const STATUS = {
  IDLE: 0,
  PAUSING: 1,
  MOVING: 2,
  PREP_MOVING: 3
}
 
const animationStatus = {
  [STATUS.IDLE]: 'elevator_idle',
  // [STATUS.PAUSING]: 'elevator_idle',
  // [STATUS.MOVING_UP]: 'elevator_up',
  // [STATUS.MOVING_DOWN]: 'elevator_down',
  // [STATUS.MOVING]: 'elevator_idle',
  // [STATUS.PREP_MOVING]: 'elevator_idle'
}

class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, physicsGroup, spawnData, onElevator) {
    super(scene, spawnData.x, spawnData.y, 'elevator');
    // this.isAlive = true;
    this.id = spawnData.id;
    this.floorHeights = spawnData.floorHeights;
    this.stops = [];

    this.direction = null;


    // this.targFloor = this.floorHeights.length - 1;
    this.settledFloor = 0;
    this.targFloor = 0;
    this.curFloor = 0;
    this.onElevator = onElevator;

    //- parent stuff
    scene.add.existing(this);
    if(!isNaN(spawnData.depth)) {
      this.setDepth(spawnData.depth);
    }

    this.setStatus(STATUS.IDLE, true);
  }

  update(){}

  checkNewUpdate(){
    //- check for stops
    const curFloor = this.getCurFloor();
    if(curFloor !== this.curFloor){
      this.curFloor = curFloor;
      this.onElevator('updateFloor', { elevatorIdx: this.id, floorIdx: this.curFloor, direction: this.direction });
    }

    const nextStop = this.getNextStop(curFloor);
    if(nextStop !== null && nextStop !== undefined){
      const stepDiff = nextStop - curFloor;
      if(!this.direction && stepDiff !== 0){
        this.setDirection(stepDiff > 0 ? 'up' : 'down');
      }

      this.goToFloor(nextStop);
    }

    if(this.status === STATUS.MOVING) this.updateWithPosition();
  }

  
  goToFloor(nextStop){
    if(this.status === STATUS.IDLE){
      this.onElevator('leaving', { elevatorIdx: this.id, floorIdx: this.settledFloor });
      this.onElevator('updateFloor', { elevatorIdx: this.id, floorIdx: this.settledFloor, direction: this.direction });
      this.targFloor = nextStop;
      this.startPauseTimer(STATUS.PREP_MOVING, STATUS.MOVING);
    }
  }



  checkElevationChange(){
    const startY = this.floorHeights[this.settledFloor];
    const targY = this.floorHeights[this.targFloor];

    const diffY = targY - this.y;
    if(Math.abs(diffY) < 1){
      this.settledFloor = this.targFloor;
      return 0;
    }else{
      if(diffY < 0){
        return -ELEVATOR_SPEED;
      }else{
        return ELEVATOR_SPEED;
      }
    }
  }

  setDirection(direction){
    this.direction = direction;
    if(direction){
      this.anims.play(`elevator_${direction}`);
    }else{
      this.anims.play(`elevator_idle`);
    }
  }

  getCurFloor(){
    for(let i = 0; i < this.floorHeights.length; i++){
      if(this.y > this.floorHeights[i] - FLOOR_CHECK_OFFSET){
        return i;
      }
    }

    console.error(`could not get floor for elevator ${this.id}`);
    return null;
  }

  getNextStop(curFloor){
    const sortedStops = this.stops.sort((a,b) => (a > b) ? 1 : -1);
    let nextStops = [];

    // console.log('checking with direction', this.direction)
    if(this.direction === 'up'){
      nextStops = sortedStops.filter(s => s > this.settledFloor);
  
    }else if(this.direction === 'down'){
      nextStops = sortedStops.filter(s => s < this.settledFloor);

    }else{
      //- no direction, get the closest one
      nextStops = sortedStops.sort((a,b) => (Math.abs(a - curFloor) > Math.abs(b - curFloor)) ? 1 : -1);
       
      // nextStops = sortedStops
      //   .map(floorIdx => ({ idx: floorIdx, floorDiff: Math.abs(floorIdx - curFloor) }))
      //   .sort((a,b) => (a.floorDiff > b.floorDiff) ? 1 : -1)
    }

    // console.log(`next stops for ${this.id} is`, nextStops)
    if(nextStops[0] || nextStops[0] === 0){
      return nextStops[0];
    }else{
      return null;
    }
  }

  addStop(floorIndex){
    if(this.stops.indexOf(floorIndex) === -1){
      this.stops.push(floorIndex);
    }
  }

  resetElevator(){
    this.stops = [];
    this.setDirection(null);
  }

  removeStop(floorIndex){
    const foundIdx = this.stops.indexOf(floorIndex);
    if(foundIdx > -1){
      this.stops.splice(foundIdx, 1);
    }
  }

  updateWithPosition(){
    if(this.settledFloor !== this.targFloor){
      const diff = this.checkElevationChange();
      // this.direction = diff < 0 ? 'up' : 'down';
      // console.log('direction:', this.direction);
      this.setPosition(this.x, this.y + diff);
      return false;
    }else{
      //- floors match, you were moving, so you should stop
      // console.log('elevator reached floor:', this.id, this.settledFloor);
      // console.log('direction is', this.direction);
      this.startPauseTimer(STATUS.PAUSING, STATUS.IDLE);
      // this.onIdle(this.id, this.settledFloor);
      this.onElevator('arrived', { elevatorIdx: this.id, floorIdx: this.settledFloor });
      this.removeStop(this.settledFloor);

      const nextStop = this.getNextStop(this.settledFloor);
      if(nextStop || nextStop === 0){
        //- elevator will continue to move in the same direction
      }else{
        this.setDirection(null);
      }

      return true;
    }
  }

  startPauseTimer(pauseStatus, endStatus){
    this.killPauseTimer();
    this.setStatus(pauseStatus);
    // console.log(`${this.id} now ${pauseStatus}`);
    this.pauseTimer = global.setTimeout(() => {
      // console.log(`${this.id} now ${endStatus}`);
      this.setStatus(endStatus);
    }, FLOOR_SIT_TIME)
  }

  killPauseTimer(){
    if(this.pauseTimer){
      global.clearTimeout(this.pauseTimer);
      this.pauseTimer = null;
    }
  }

  checkElevationChange(){
    const startY = this.floorHeights[this.settledFloor];
    const targY = this.floorHeights[this.targFloor];

    const diffY = targY - this.y;
    if(Math.abs(diffY) < 1){
      this.settledFloor = this.targFloor;
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
        // this.anims.play(animKey);
      }
    }
  }
}

const initSprites = (sceneContext) => {
  sceneContext.anims.create({
    key: 'elevator_idle',
    frames: [ { key: 'elevator', frame: 0 } ]
  });
  sceneContext.anims.create({
    key: 'elevator_up',
    frames: [ { key: 'elevator', frame: 1 } ]
  });
  sceneContext.anims.create({
    key: 'elevator_down',
    frames: [ { key: 'elevator', frame: 2 } ]
  });
}


const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('elevator', img_elevator, { frameWidth: 113, frameHeight: 69 });
}

export default {
  Entity,
  initSprites,
  initSpritesheet
}