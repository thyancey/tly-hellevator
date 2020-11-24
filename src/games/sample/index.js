import Phaser from 'phaser';
import gameData from './data.json';
import SpawnController from './spawn.js';
import LevelController from './level.js';
import { queueElevator } from './utils/elevator-boss';

let game;
let sceneContext;
let platforms = {};
global.elevatorQueue = [];

export const createGame = () =>{
  const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 980,
    height: 720,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 800 },
        debug: true
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  game = new Phaser.Game(config);
}

window.stopGame = () => {[]
  sceneContext.scene.stop();
}

window.startGame = () => {
  sceneContext.scene.start();
}

function setSceneContext(context){
  sceneContext = context;
  global.scene = sceneContext;
  SpawnController.setContext(context);
  LevelController.setContext(context);
}

function preload() {
  setSceneContext(this);
  SpawnController.preload();
  LevelController.preload();
}

function create() {
  //- make the level
  this.input.keyboard.on('keydown', onKeyDown);
  console.log('LevelController.create()')
  platforms = LevelController.create(gameData.level);
  //- make the enemies
  const platformPositions = gameData.level.platforms.map(pO => ({
    x: parseInt(pO.x),
    y: parseInt(pO.y) - 50
  }));
  
  let spawnGroups = SpawnController.create(platformPositions, gameData.entities, gameData.level.platforms);
}

function update (){
  SpawnController.update();
}

const onKeyDown = (e) => {
  console.log(e.code);
  switch(e.code){
    case 'Space': SpawnController.spawnSample();
      break;
    case 'Digit0': queueElevator(0, 'down');
      break;
    case 'Digit1': queueElevator(1, 'down');
      break;
    case 'Digit2': queueElevator(2, 'down');
      break;
    case 'Digit3': queueElevator(3, 'down');
      break;
    case 'Digit4': queueElevator(4, 'down');
      break;
    case 'Numpad0': queueElevator(0, 'up');
      break;
    case 'Numpad1': queueElevator(1, 'up');
      break;
    case 'Numpad2': queueElevator(2, 'up');
      break;
    case 'Numpad3': queueElevator(3, 'up');
      break;
    case 'Numpad4': queueElevator(4, 'up');
      break;
  }
}

/*

const queueElevator = (floorIdx, direction) => {
  const found = elevatorQueue.find(cQ => (cQ.floorIdx === floorIdx && cQ.direction === direction));
  if(!found){
    console.log('not found, pushin')
    elevatorQueue.push({
      id: new Date().getTime(),
      floorIdx: floorIdx,
      direction: direction
    });
  }else{
    console.log('will not push redundant command', floorIdx, direction)
  }
}*/