import { Application, Graphics } from 'pixi.js';
import { Game, Input } from './game';

const app = new Application({
  width: 360,
  height: 640,
  backgroundColor: 0x444444,
});
document.body.appendChild(app.view as any);
document.body.style.margin = '0';

app.stage.setTransform(app.screen.width / 2, app.screen.height / 2);

const graphics = new Graphics();
app.stage.addChild(graphics);

const game = new Game();
game.initialize(graphics);

app.ticker.add(delta => {
  const deltaMS = 1 / 60 * delta;
  game.update(deltaMS);
  game.draw(graphics);
});

let input = 0;

document.addEventListener('keydown', event => {
  if (event.code == 'KeyW' || event.code == 'ArrowUp') {
    input |= Input.Up;
  }
  if (event.code == 'KeyS' || event.code == 'ArrowDown') {
    input |= Input.Down;
  }
  if (event.code == 'KeyA' || event.code == 'ArrowLeft') {
    input |= Input.Left;
  }
  if (event.code == 'KeyD' || event.code == 'ArrowRight') {
    input |= Input.Right;
  }
  if (event.code == 'Space') {
    input |= Input.Action;
  }

  game.handleInput(input);
});

document.addEventListener('keyup', event => {
  if ((event.code == 'KeyW' || event.code == 'ArrowUp')) {
    input ^= Input.Up;
  }
  if (event.code == 'KeyS' || event.code == 'ArrowDown') {
    input ^= Input.Down;
  }
  if (event.code == 'KeyA' || event.code == 'ArrowLeft') {
    input ^= Input.Left;
  }
  if (event.code == 'KeyD' || event.code == 'ArrowRight') {
    input ^= Input.Right;
  }
  if (event.code == 'Space') {
    input ^= Input.Action;
  }

  game.handleInput(input);
});

window.addEventListener('blur', _ => {
  input = 0;
  game.handleInput(input);
});