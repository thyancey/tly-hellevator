const elevatorQueue = [];
global.eQueue = elevatorQueue;

const numElevators = 2;

export const queueElevator = (floorIdx, direction) => {
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
}

export const getElevatorQueue = () => {
  return elevatorQueue;
}

export const removeFromQueue = (floorIdx, direction) => {
  const foundIdx = elevatorQueue.findIndex(cQ => (cQ.floorIdx === floorIdx && cQ.direction === direction));
  if(foundIdx > -1){
    console.log(`removing from queue: "${floorIdx}:${direction}"`);
    elevatorQueue.splice(foundIdx, 1);
  }else{
    console.error(`could not find in queue: ${floorIdx}:${direction}"`);
  }
}

export const getClosestQueues = (floorIdx) => {
  return elevatorQueue
    .map(eQ => ({ ...eQ, floorDiff: Math.abs(eQ.floorIdx - floorIdx) }))
    .sort((a,b) => (a.floorDiff > b.floorDiff) ? 1 : -1)
}

//- ultimately, get a command for each elevator
export const getSortedElevatorQueues = elevators => {
  //- for each elevator, compare next command
  //- if conflict, resolve with score
  let allEQueues = [];

  elevators.forEach((eObj, eIdx) => {
    const eQueue = getAvailableQueues(eObj.floorIdx, eObj.direction);
    allEQueues = allEQueues.concat(eQueue.map(e => ({...e, elevatorId: eIdx})));
  });

  // console.log('allEQueues:', allEQueues)
  const sorted = allEQueues
    .sort((a,b) => (a.elevatorId < b.elevatorId) ? 1 : -1) // prefer elevators left to right
    .sort((a,b) => (a.score < b.score) ? 1 : -1)

  return getCleanList(sorted);
}

export const getQueueScore = (direction, queueObj) => {
  let score;
  if(direction){
    score = queueObj.direction === direction ? 1000 : 0;
  }else{
    score = 500;
  }

  score -= queueObj.floorDiff;
  return score;
}


export const getAvailableQueues = (floorIdx, direction) => {
  const closestQueues = getClosestQueues(floorIdx);

  if(direction === 'up'){
    const valid = closestQueues.filter(cQ => cQ.floorIdx > floorIdx);

    return valid
      .map(cQ => ({...cQ, score: getQueueScore(direction, cQ) }))
      .sort((a,b) => (a.score < b.score) ? 1 : -1);

    // return valid
    //   .filter(cQ => cQ.direction === 'up').map(cQ => ({...cQ, priority: true}))
    //   .concat(valid.filter(cQ => cQ.direction === 'down'));
  }else if(direction === 'down'){
    const valid = closestQueues.filter(cQ => cQ.floorIdx < floorIdx);
    return valid
      .map(cQ => ({...cQ, score: getQueueScore(direction, cQ) }))
      .sort((a,b) => (a.score < b.score) ? 1 : -1)

    // return valid
    //   .filter(cQ => cQ.direction === 'down').map(cQ => ({...cQ, priority: true}))
    //   .concat(valid.filter(cQ => cQ.direction === 'up'));
  }else{ // idle elevator perhaps
    // return closestQueues.map(cQ => ({...cQ, priority: true}));
    return closestQueues
      .map(cQ => ({...cQ, score: getQueueScore(null, cQ) }))
      .sort((a,b) => (a.score < b.score) ? 1 : -1);
  }
}


global.gcq = getClosestQueues;
global.gaq = getAvailableQueues;
