import './theme/style.scss';
import jsonData from './data/data.json';
import { createGame } from './games/sample';
import { createHeader } from './page';

const start = () => {
  createHeader();
  createGame(jsonData)
};

start();