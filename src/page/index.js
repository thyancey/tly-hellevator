import { renderHtml } from '../utils';

export const createHeader = () => {

  const logoHtml = `
    <h2>Phaser 3 test</h2>
    <div class="description">
      <p>Just some stuff</p>
      <p>Space: Throw sample</p>
    </div>
  `;

  renderHtml('#header', `
    <div class="header-left">
      ${logoHtml}
    </div>
    <div class="header-right">
    </div>
  `);
}