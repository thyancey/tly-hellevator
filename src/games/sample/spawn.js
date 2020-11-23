import Phaser from 'phaser';
import Sample from './entities/sample.js';
import ElevatorDoor from './entities/elevator-door.js';
import ElevatorSign from './entities/elevator-sign.js';
import ElevatorPlate from './entities/elevator-plate.js';
import Elevator from './entities/elevator.js';
import { getDepthOfLayer } from './utils/values';
import elevatorSign from './entities/elevator-sign.js';

const groups = {};
const elevators = [];
let commandQueue = [];
let sceneContext;
let floorPositions = [];
const DOOR_OFFSET = 295;
const DOOR_SPACING = 357;

export const setContext = (context) => {
  sceneContext = context;
}

export const preload = () => {
  Sample.initSpritesheet(sceneContext);
  ElevatorDoor.initSpritesheet(sceneContext);
  ElevatorSign.initSpritesheet(sceneContext);
  ElevatorPlate.initSpritesheet(sceneContext);
  Elevator.initSpritesheet(sceneContext);
}

export const create = (platformPos, eData, pData) => {
  floorPositions = platformPos;

  groups.sample1 = sceneContext.physics.add.group();

  Sample.initSprites(sceneContext);
  ElevatorDoor.initSprites(sceneContext);
  ElevatorSign.initSprites(sceneContext);
  ElevatorPlate.initSprites(sceneContext);
  Elevator.initSprites(sceneContext);


  spawnDoors(floorPositions);
  spawnPlates(floorPositions);
  spawnSigns(floorPositions);
  spawnElevators();

  return groups;
}

export const update = () => {
  groups.sample1.children.each(entity => {
    entity.update();
  });

  //- check elevator1
  //- at floor...
  ///- for each command...
  ////- does ele other have it?
  ////- 

  //- check elevator2


  /*
    first elevator: is it going that way already? if so

  */

  global.commandQueue = commandQueue;

  let freeElevators = [];
  elevators.forEach(elevator => {
    const atFloor = elevator.updateWithPosition();
    if(atFloor){
      clearFloorCommands(elevator.curFloor);
      freeElevators.push(elevator);
    }
  });

  const nextCommand = getNextFreeCommand();
  if(nextCommand){
    let closestElevator = null;
    
    console.log('freeElevators is ', freeElevators.length)
    freeElevators.forEach(elevator => {
      if(!closestElevator) {
        closestElevator = elevator;
      }else if(Math.abs(nextCommand.floorIdx - elevator.curFloor) < Math.abs(nextCommand.floorIdx - closestElevator.curFloor)){
        console.log('closest assigned to ', elevator.id)
        closestElevator = elevator;
      }
    });
  
    if(closestElevator){
      console.log('closestElevator is ', closestElevator.id)
      nextCommand.status = 'busy';
      closestElevator.goToFloor(nextCommand);
    }
  
    //- each elevator finds next available entry in queue

  }
}

const clearFloorCommands = (floorIdx) => {
  commandQueue = commandQueue.filter(c => c.floorIdx !== floorIdx);
}


const getNextFreeCommand = () => {
  const command = commandQueue.find(c => c.status === 'free');
  if(command){
    return command;
  }else{
    return null;
  }
}

const getNextCommand = (floorIdx) => {
  const command = commandQueue.find(c => (c.status === 'free' && c.floorIdx !== floorIdx));
  if(command){
    return command;
  }else{
    return null;
  }
}

export const spawnThis = (EntityRef, layerIdx) => {
  // const pos = { x: 0, y : 0 }
  const pos = floorPositions[layerIdx];
  
  let entity = new EntityRef(sceneContext, groups.sample1, {
    x: pos.x,
    y: pos.y,
    depth: getDepthOfLayer(layerIdx)
  });

  return entity;
}


const spawnPlates = fPs => {
  fPs.forEach((fp, idx) => {
    spawnPlate(idx);
  });
}

const spawnSigns = fPs => {
  fPs.forEach((fp, idx) => {
    spawnSign(0, idx);
    spawnSign(1, idx);
  });
}

const spawnDoors = fPs => {
  fPs.forEach((fp, idx) => {
    spawnDoor(0, idx);
    spawnDoor(1, idx);
  });
}

export const spawnSign = (doorIdx, floorIdx) => {
  
  let entity = new ElevatorSign.Entity(sceneContext, groups.sample1, {
    x: DOOR_OFFSET + (doorIdx * DOOR_SPACING),
    y: floorPositions[floorIdx].y - 35,
    depth: 1
  });

  return entity;
}

export const spawnPlate = (floorIdx) => {
  
  let entity = new ElevatorPlate.Entity(sceneContext, groups.sample1, {
    x: DOOR_OFFSET + 173,
    y: floorPositions[floorIdx].y + 10,
    depth: 1
  });

  return entity;
}

export const spawnDoor = (doorIdx, floorIdx) => {
  
  let entity = new ElevatorDoor.Entity(sceneContext, groups.sample1, {
    x: DOOR_OFFSET + (doorIdx * DOOR_SPACING),
    y: floorPositions[floorIdx].y + 15,
    depth: 1
  });

  return entity;
}

const spawnElevators = () => {
  const eleData = [ {floor:0}, {floor:0} ];
  eleData.forEach((ele, idx) => {
    elevators.push(spawnElevator(idx, ele.floor));
  });
}

export const spawnElevator = (doorIdx, floorIdx) => {
  const pos = floorPositions[floorIdx];
  
  let entity = new Elevator.Entity(sceneContext, groups.sample1, {
    id: `elevator_${doorIdx}`,
    x: DOOR_OFFSET + (doorIdx * DOOR_SPACING),
    y: pos.y + 18,
    depth: 0,
    floorHeights: floorPositions.map(fp => fp.y + 15)
  }, onIdle);

  return entity;
}

const onIdle = elevatorId => {
 console.log('onIdle', elevatorId) 
}

const queueElevator = (floorIdx, direction) => {
  const found = commandQueue.find(cQ => (cQ.floorIdx === floorIdx && cQ.direction === direction));
  if(!found){
    console.log('not found, pushin')
    commandQueue.push({
      floorIdx: floorIdx,
      direction: direction,
      status: 'free'
    });
  }else{
    console.log('will not push redundant command', floorIdx, direction)
  }
}

export const spawnSample = () => {
  const entity = spawnThis(Sample.Entity, 0);

  entity.setVelocity(0, 0);
}

export default {
  setContext,
  preload,
  create,
  update,
  spawnSample,
  spawnThis,
  queueElevator
}