import Phaser from 'phaser';
import Sample from './entities/sample.js';
import ElevatorDoor from './entities/elevator-door.js';
import ElevatorSign from './entities/elevator-sign.js';
import ElevatorPlate from './entities/elevator-plate.js';
import ControlPanel from './entities/control-panel.js';
import Elevator from './entities/elevator.js';
import { getDepthOfLayer } from './utils/values';
import { getElevatorQueue, resolveCommands } from './utils/elevator-boss.js';

const groups = {};
const elevators = [];
const plates = [];
const signs = [];
const doors = [];
const controlPanels = [];
let commandQueue = [];
let sceneContext;
let floorPositions = [];
const DOOR_OFFSET = 295;
const DOOR_SPACING = 357;

global.elevators = elevators;

export const setContext = (context) => {
  sceneContext = context;
}

export const preload = () => {
  Sample.initSpritesheet(sceneContext);
  ElevatorDoor.initSpritesheet(sceneContext);
  ElevatorSign.initSpritesheet(sceneContext);
  ElevatorPlate.initSpritesheet(sceneContext);
  ControlPanel.initSpritesheet(sceneContext);
  Elevator.initSpritesheet(sceneContext);
}

export const create = (platformPos, eData, pData) => {
  floorPositions = platformPos;

  groups.sample1 = sceneContext.physics.add.group();

  Sample.initSprites(sceneContext);
  ElevatorDoor.initSprites(sceneContext);
  ElevatorSign.initSprites(sceneContext);
  ElevatorPlate.initSprites(sceneContext);
  ControlPanel.initSprites(sceneContext);
  Elevator.initSprites(sceneContext);

  spawnDoors(floorPositions);
  spawnPlates(floorPositions);
  spawnControlPanels();
  spawnSigns(floorPositions);
  spawnElevators();

  return groups;
}

export const elevatorStateUpdate = () => {
  // console.log('----------------------')
  const eQueue = getElevatorQueue();

  //- update elevator commands
  elevators.forEach(elevator => {
    elevator.checkNewUpdate();
  });

  //- light up plates
  plates.forEach(p => {
    p.setEStatus(eQueue.filter(eQ => eQ.floorIdx === p.floorIdx));
  });
}

export const update = () => {
  elevatorStateUpdate();

  groups.sample1.children.each(entity => {
    entity.update();
  });

  global.commandQueue = commandQueue;
}


export const spawnThis = (EntityRef, layerIdx) => {
  const pos = floorPositions[layerIdx];
  
  let entity = new EntityRef(sceneContext, groups.sample1, {
    x: pos.x,
    y: pos.y,
    depth: getDepthOfLayer(layerIdx)
  });

  return entity;
}

const onElevatorButton = (elevatorIdx, floorIdx) => {
  elevators[elevatorIdx].addStop(floorIdx);
}

const spawnControlPanels = () => {
  controlPanels.push(spawnControlPanel(0, 165, 75));
  controlPanels.push(spawnControlPanel(1, 785, 75));
}


const spawnPlates = fPs => {
  fPs.forEach((fp, idx) => {
    plates.push(spawnPlate(idx));
  });
}

const spawnSigns = fPs => {
  fPs.forEach((fp, idx) => {
    signs.push([ spawnSign(0, idx), spawnSign(1, idx) ]);
  });
}

const spawnDoors = fPs => {
  fPs.forEach((fp, idx) => {
    doors.push([
      spawnDoor(0, idx),
      spawnDoor(1, idx)
    ]);
  });
}

export const spawnControlPanel = (elevatorIdx, x, y) => {
  
  let entity = new ControlPanel.Entity(sceneContext, null, {
    x: x,
    y: y,
    depth: 100,
    elevatorIdx: elevatorIdx
  }, onElevatorButton);

  return entity;
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
    depth: 1,
    floorIdx: floorIdx
  });

  return entity;
}

export const spawnDoor = (doorIdx, floorIdx) => {
  
  let entity = new ElevatorDoor.Entity(sceneContext, groups.sample1, {
    x: DOOR_OFFSET + (doorIdx * DOOR_SPACING),
    y: floorPositions[floorIdx].y + 15,
    depth: 1,
    id: (floorIdx * 2) + doorIdx //- just a way to id them in order
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
    id: doorIdx,
    x: DOOR_OFFSET + (doorIdx * DOOR_SPACING),
    y: pos.y + 18,
    depth: 0,
    floorHeights: floorPositions.map(fp => fp.y + 15)
  }, onElevator);

  return entity;
}

const onElevator = (command, payload) => {
  // console.log('onElevator', command, payload);

  if(command === 'arrived'){
    controlPanels[payload.elevatorIdx].clearButton(payload.floorIdx);
    doors[payload.floorIdx][payload.elevatorIdx].open();
  }else if (command === 'leaving'){
    doors[payload.floorIdx][payload.elevatorIdx].close();
  }else if (command === 'updateFloor'){
    updateSigns(payload);
  }
}

const updateSigns = (payload) => {
  signs.forEach(floorSet => {
    floorSet[payload.elevatorIdx].notifyElevatorState(payload);
  })
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