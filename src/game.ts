import { Bounds, Container, Graphics, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { Hero } from './hero';

export enum Input {
  Up = 1 << 0,
  Down = 1 << 1,
  Left = 1 << 2,
  Right = 1 << 3,
  Action = 1 << 4,
};

export class Game {
  private readonly text = new Text('', new TextStyle({ fill: 'white' }));
  private readonly playArea = new Bounds();
  private readonly hero = new Hero();
  private readonly packages = new Container();
  private readonly package = Sprite.from(Texture.WHITE);
  private timer = 0;
  private actionDown = false;

  initialize(graphics: Graphics) {
    this.playArea.addPoint({ x: -120, y: -200 });
    this.playArea.addPoint({ x: 120, y: -200 });
    this.playArea.addPoint({ x: 120, y: 200 });
    this.playArea.addPoint({ x: -120, y: 200 });

    this.package.width = 32;
    this.package.height = 32;
    this.package.anchor.x = .5;
    this.package.anchor.y = .5;
    this.package.x = 40;
    this.package.tint = 0xff0000;
    this.packages.addChild(this.package);

    graphics.addChild(this.packages);

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

    if (!this.hero.container.children.includes(this.package)) {
      const xDiff = this.hero.container.x - this.package.x;
      const yDiff = this.hero.container.y - this.package.y;
      const sqDist = xDiff * xDiff + yDiff * yDiff;
      if (sqDist < 32 * 32) {
        const dist = Math.sqrt(sqDist);
        this.package.x = this.hero.container.x - (xDiff / dist) * 32;
        this.package.y = this.hero.container.y - (yDiff / dist) * 32;
      }
    }
  }

  draw(graphics: Graphics) {
  }

  handleInput(input: Input) {
    this.hero.handleInput(input);
    if (input & Input.Action) {
      if (!this.actionDown) {
        if (this.hero.container.children.includes(this.package)) {
          this.packages.addChild(this.package);
          this.package.x = this.hero.container.x;
          this.package.y = this.hero.container.y -32;
        } else {
          this.hero.container.addChild(this.package);
          this.package.x = 0;
          this.package.y = -32;
        }
      }

      this.actionDown = true;
    } else {
      this.actionDown = false;
    }
  }
}