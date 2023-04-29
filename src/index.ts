import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
  width: 360,
  height: 640,
  backgroundColor: 0x444444,
});
document.body.appendChild(app.view as any);
document.body.style.margin = '0';

const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

const style = new PIXI.TextStyle({ fill: 'white' });
const text = new PIXI.Text('it works!', style);

graphics.addChild(text);