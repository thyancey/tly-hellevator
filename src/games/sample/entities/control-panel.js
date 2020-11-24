import Phaser from 'phaser';

import img_elevatorControl from '../assets/elevator-control.png';
import img_elevatorButton from '../assets/elevator-button.png';

const BUTTON_SPACING = 24;

export const STATUS = {
  IDLE: 0
}

const animationStatus = {
  [STATUS.IDLE]: 'elevatorControl_idle'
}

class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, physicsGroup, spawnData, onElevatorButton) {
    super(scene, spawnData.x, spawnData.y, 'elevatorControl');

    this.elevatorIdx = spawnData.elevatorIdx;
    this.buttons = [];

    //- parent stuff
    scene.add.existing(this);
    if(!isNaN(spawnData.depth)) {
      this.setDepth(spawnData.depth);
    }

    this.setStatus(STATUS.IDLE, true);

    this.createButtons(scene, [0,1,2,3,4], onElevatorButton);
  }

  update(){}

  createButtons(sceneContext, buttonList, onElevatorButton){
    const origin = [this.x + 15, this.y + 47];
    buttonList.forEach(buttonIdx => {
      let button = sceneContext.add.sprite(origin[0], origin[1] - (buttonIdx * BUTTON_SPACING), 'button').setInteractive();
      button.setDepth(1000);
      this.buttons.push(button);

      button.on('pointerdown', () => this.onButtonClick(button, buttonIdx, onElevatorButton), this);
    });
  }

  clearButton(buttonIdx){
    // console.log('clear button', this.elevatorIdx, buttonIdx)
    this.buttons[buttonIdx] && this.buttons[buttonIdx].play('button_off');
  }

  onButtonClick(button, buttonIdx, onElevatorButton){
    button.play('button_on');
    onElevatorButton(this.elevatorIdx, buttonIdx);
  }

  setStatus(status, force){
    if(force || this.status !== status){
      this.status = status;

      const animKey = animationStatus[this.status];
      if(animKey){
        // console.log('playing ', animKey);
        this.anims.play(animKey);
      }
    }
  }
}

const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('elevatorControl', img_elevatorControl, { frameWidth: 79, frameHeight: 136 });
  sceneContext.load.spritesheet('button', img_elevatorButton, { frameWidth: 24, frameHeight: 24 });
}

const initSprites = (sceneContext) => {
  sceneContext.anims.create({
    key: 'elevatorControl_idle',
    frames: [ { key: 'elevatorControl', frame: 0 } ]
  });

  sceneContext.anims.create({
    key: 'button_off',
    frames: [ { key: 'button', frame: 0 } ]
  });
  sceneContext.anims.create({
    key: 'button_on',
    frames: [ { key: 'button', frame: 1 } ]
  });
}


export default {
  Entity,
  initSprites,
  initSpritesheet
}