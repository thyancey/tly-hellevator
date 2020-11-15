import img_sample_bg from './assets/sample-bg.png';
import img_bar_white from './assets/bar-white.png';

import Values from './utils/values';

const DEBUG_ALPHA = 0;

let sceneContext;

export const setContext = (context) => {
  sceneContext = context;
}

export const preload = () => {
  sceneContext.load.image('sample-bg', img_sample_bg);
  sceneContext.load.image('bar-white', img_bar_white);
}

export const create = (levelData) => {
  console.log('creating with ', levelData)
  const platforms = sceneContext.physics.add.staticGroup();
  
  sceneContext.add.image(0, 0, 'sample-bg').setOrigin(0).setScale(1).setDepth(Values.zindex.BACKGROUND);

  levelData.platforms.forEach(pO => {
    const x = parseInt(pO.x);
    const y = parseInt(pO.y);
    const w = parseInt(pO.width) / 100;
    const h = parseInt(pO.height) / 100;

    platforms.create(x, y, 'bar-white').setScale(w, h).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();
  });

  return {
    platforms
  }
}

export default {
  setContext,
  preload,
  create
}