import Phaser from 'phaser';
import gameData from './data.json';
import SpawnController from './spawn.js';
import LevelController from './level.js';

let game;
let sceneContext;
let platforms = {};

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
  switch(e.code){
    case 'Space': SpawnController.spawnSample();
      break;
  }
}