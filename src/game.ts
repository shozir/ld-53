import { AnimatedSprite, Bounds, Container, Graphics, Point, Text, TextStyle } from 'pixi.js';
import { Hero } from './hero';

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
  private readonly hero = new Hero();
  private timer = 0;

  initialize(graphics: Graphics) {
    this.playArea.addPoint({ x: -120, y: -200 });
    this.playArea.addPoint({ x: 120, y: -200 });
    this.playArea.addPoint({ x: 120, y: 200 });
    this.playArea.addPoint({ x: -120, y: 200 });

    this.hero.initialize(graphics);

    // graphics.addChild(this.text);

    graphics.beginFill(0xFFFF00);
    graphics.drawRect(this.playArea.minX, this.playArea.minY, this.playArea.maxX - this.playArea.minX, this.playArea.maxY - this.playArea.minY);
  }

  update(delta: number) {
    this.timer += delta;
    this.hero.update(delta);

    if (this.hero.container.x < this.playArea.minX) this.hero.container.x = this.playArea.minX;
    if (this.hero.container.x > this.playArea.maxX) this.hero.container.x = this.playArea.maxX;
    if (this.hero.container.y < this.playArea.minY) this.hero.container.y = this.playArea.minY;
    if (this.hero.container.y > this.playArea.maxY) this.hero.container.y = this.playArea.maxY;
  }

  draw(graphics: Graphics) {
  }

  handleInput(input: Input) {
    this.hero.handleInput(input);
  }
}