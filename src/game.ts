import { Bounds, Graphics, Sprite, Text, TextStyle, Texture } from 'pixi.js';

const moveSpeed = 100;

export enum Input {
  Up = 1 << 0,
  Down = 1 << 1,
  Left = 1 << 2,
  Right = 1 << 3,
};

export class Game {
  private readonly text = new Text('', new TextStyle({ fill: 'white' }));
  private readonly playArea = new Bounds();
  private readonly hero = new Sprite(Texture.WHITE);
  private timer = 0;
  private input = 0;

  initialize(graphics: Graphics) {
    this.playArea.addPoint({ x: -120, y: -200 });
    this.playArea.addPoint({ x: 120, y: -200 });
    this.playArea.addPoint({ x: 120, y: 200 });
    this.playArea.addPoint({ x: -120, y: 200 });

    // graphics.addChild(this.text);
    this.hero.width = 32;
    this.hero.height = 32;
    this.hero.position.x = -16;
    this.hero.position.y = -16;
    this.hero.tint = 0x00ff00;

    graphics.addChild(this.hero);

    graphics.beginFill(0xFFFF00);
    graphics.drawRect(this.playArea.minX, this.playArea.minY, this.playArea.maxX - this.playArea.minX, this.playArea.maxY - this.playArea.minY);

    this.hero.getBounds();
  }

  update(delta: number) {
    this.timer += delta;
    this.hero.x += (-((this.input >> 2) & 1) + ((this.input >> 3) & 1)) * delta * moveSpeed;
    this.hero.y += (-((this.input >> 0) & 1) + ((this.input >> 1) & 1)) * delta * moveSpeed;

    if (this.hero.x < this.playArea.minX) this.hero.position.x = this.playArea.minX;
    if (this.hero.x + 32 > this.playArea.maxX) this.hero.position.x = this.playArea.maxX - 32;
    if (this.hero.y < this.playArea.minY) this.hero.position.y = this.playArea.minY;
    if (this.hero.y + 32 > this.playArea.maxY) this.hero.position.y = this.playArea.maxY - 32;
  }

  draw(graphics: Graphics) {
  }

  handleInput(input: Input) {
    this.input = input;
  }
}