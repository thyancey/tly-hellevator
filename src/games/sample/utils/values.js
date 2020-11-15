
export const Values = {
  zindex:{
    BACKGROUND: 0,
    LAYER_1: 10,
    LAYER_2: 20,
    LAYER_3: 30,
    LAYER_4: 40,
    FOREGROUND: 50
  }
}


export const getDepthOfLayer = (layerIdx, offset = 0) => {
  try{
    const idx = Values.zindex[`LAYER_${layerIdx + 1}`] + offset;
    if(!isNaN(idx)) return idx;
  }catch(e){
  }

  return 0;
}

export default Values;