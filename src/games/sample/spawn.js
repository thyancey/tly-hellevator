import Phaser from 'phaser';
import Sample from './entities/sample.js';
import ElevatorDoor from './entities/elevator-door.js';
import ElevatorSign from './entities/elevator-sign.js';
import Elevator from './entities/elevator.js';
import { getDepthOfLayer } from './utils/values';
import elevatorSign from './entities/elevator-sign.js';

const groups = {};
const elevators = [];
let sceneContext;
let floorPositions = [];

export const setContext = (context) => {
  sceneContext = context;
}

export const preload = () => {
  Sample.initSpritesheet(sceneContext);
  ElevatorDoor.initSpritesheet(sceneContext);
  ElevatorSign.initSpritesheet(sceneContext);
  Elevator.initSpritesheet(sceneContext);
}

export const create = (platformPos, eData, pData) => {
  floorPositions = platformPos;

  groups.sample1 = sceneContext.physics.add.group();

  Sample.initSprites(sceneContext);
  ElevatorDoor.initSprites(sceneContext);
  ElevatorSign.initSprites(sceneContext);
  Elevator.initSprites(sceneContext);


  spawnDoors(floorPositions);
  spawnSigns(floorPositions);
  spawnElevators();
  return groups;
}

export const update = () => {
  groups.sample1.children.each(entity => {
    entity.update();
  });

  elevators.forEach(elevator => elevator.update());
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
    x: 350 + (doorIdx * 300),
    y: floorPositions[floorIdx].y - 35,
    depth: 1
  });

  return entity;
}

export const spawnDoor = (doorIdx, floorIdx) => {
  
  let entity = new ElevatorDoor.Entity(sceneContext, groups.sample1, {
    x: 350 + (doorIdx * 300),
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
    x: 351 + (doorIdx * 300),
    y: pos.y + 18,
    depth: 0,
    floorHeights: floorPositions.map(fp => fp.y + 15)
  });

  return entity;
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
  spawnThis
}