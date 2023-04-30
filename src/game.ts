import { Bounds, Graphics, Text, TextStyle } from 'pixi.js';
import { Player } from './player';
import { Package } from './package';
import { Conveyor, speed as conveyorSpeed } from './conveyor';

export enum Input {
  Up = 1 << 0,
  Down = 1 << 1,
  Left = 1 << 2,
  Right = 1 << 3,
  Action = 1 << 4,
};

export const playAreaWidth = 120;
export const playAreaHeight = 200;

export class Game {
  private readonly text = new Text('', new TextStyle({ fill: 'white' }));
  private readonly playArea = new Bounds();
  private readonly packageSpawnArea = new Bounds();
  private readonly player = new Player();
  private readonly packages: Package[] = [];
  private readonly conveyor = new Conveyor();

  private timer = 0;
  private actionDown = false;

  initialize(graphics: Graphics) {
    graphics.scale.x = 2;
    graphics.scale.y = 2;

    this.playArea.addPoint({ x: -playAreaWidth / 2, y: -playAreaHeight / 2 });
    this.playArea.addPoint({ x: playAreaWidth / 2, y: -playAreaHeight / 2 });
    this.playArea.addPoint({ x: playAreaWidth / 2, y: playAreaHeight / 2 });
    this.playArea.addPoint({ x: -playAreaWidth / 2, y: playAreaHeight / 2 });

    this.packageSpawnArea.addPoint({ x: this.playArea.minX, y: this.playArea.minY });
    this.packageSpawnArea.addPoint({ x: this.playArea.maxX, y: this.playArea.minY });
    this.packageSpawnArea.addPoint({ x: this.playArea.maxX, y: this.playArea.minY / 2 });
    this.packageSpawnArea.addPoint({ x: this.playArea.minX, y: this.playArea.minY / 2 });

    this.conveyor.initialize(graphics);

    for (let i = 0; i < 50; ++i) {
      const box = new Package();
      box.initialize(graphics);
      box.spawn(this.playArea);
      this.packages.push(box);
    }

    this.player.initialize(graphics);

    // graphics.addChild(this.text);
  }

  update(delta: number) {
    this.timer += delta;

    this.conveyor.update(delta);

    this.player.container.y += delta * conveyorSpeed;

    this.player.update(delta);

    if (this.player.container.x < this.playArea.minX) this.player.container.x = this.playArea.minX;
    if (this.player.container.x > this.playArea.maxX) this.player.container.x = this.playArea.maxX;
    if (this.player.container.y < this.playArea.minY) this.player.container.y = this.playArea.minY;
    if (this.player.container.y > this.playArea.maxY) this.player.container.y = this.playArea.maxY;

    // if (!this.player.container.children.includes(this.package)) {
    //   const xDiff = this.player.container.x - this.package.x;
    //   const yDiff = this.player.container.y - this.package.y;
    //   const sqDist = xDiff * xDiff + yDiff * yDiff;
    //   if (sqDist < 24 * 24) {
    //     const dist = Math.sqrt(sqDist);
    //     this.package.x = this.player.container.x - (xDiff / dist) * 24;
    //     this.package.y = this.player.container.y - (yDiff / dist) * 24;
    //   }
    // }

    const remainingColCheckPackages = this.packages.slice();
    for (const box of this.packages) {
      box.sprite.y += delta * conveyorSpeed;
      if (!box.boundCheckPlayArea(this.playArea)) {
        box.spawn(this.packageSpawnArea);
      } else {
        const packageIdx = remainingColCheckPackages.indexOf(box);
        remainingColCheckPackages.splice(packageIdx, 1);
        for (const otherBox of remainingColCheckPackages) {
          box.collisionCheckPackage(delta, otherBox);
        }
        box.collisionCheckPlayer(delta, this.player.container);
      }
    }
  }

  draw(graphics: Graphics) {
  }

  handleInput(input: Input) {
    this.player.handleInput(input);
    // if (input & Input.Action) {
    //   if (!this.actionDown) {
    //     if (this.player.container.children.includes(this.package)) {
    //       this.packages.addChild(this.package);
    //       this.package.x = this.player.container.x;
    //       this.package.y = this.player.container.y -24;
    //     } else {
    //       this.player.container.addChild(this.package);
    //       this.package.x = 0;
    //       this.package.y = -24;
    //     }
    //   }

    //   this.actionDown = true;
    // } else {
    //   this.actionDown = false;
    // }
  }
}