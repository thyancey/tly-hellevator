import Phaser from 'phaser';
import Sample from './entities/sample.js';
import { getDepthOfLayer } from './utils/values';

const groups = {};
let sceneContext;
let platformPositions = [];

export const setContext = (context) => {
  sceneContext = context;
}

export const preload = () => {
  Sample.initSpritesheet(sceneContext);
}

export const create = (platformPos, eData, pData) => {
  platformPositions = platformPos;

  groups.sample1 = sceneContext.physics.add.group();

  Sample.initSprites(sceneContext);

  return groups;
}

export const update = () => {
  groups.sample1.children.each(entity => {
    entity.update();
  });
}

export const spawnThis = (EntityRef, entityData, layerIdx) => {
  // const pos = { x: 0, y : 0 }
  const pos = platformPositions[layerIdx];
  
  let entity = new EntityRef(sceneContext, groups.sample1, {
    x: pos.x,
    y: pos.y,
    depth: getDepthOfLayer(layerIdx)
  });

  return entity;
}


export const spawnSample = () => {
  const entity = spawnThis(Sample.Entity, {}, 0);

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