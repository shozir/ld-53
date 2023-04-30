import { Bounds, Container, Graphics, Text, TextStyle } from 'pixi.js';
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
  private readonly text = new Text('wasd to move\nspace to pickup/throw', new TextStyle({ fill: 'white', fontFamily: 'Tahoma', fontSize: 12, align: 'center' }));
  private readonly playArea = new Bounds();
  private readonly packageSpawnArea = new Bounds();
  private readonly player = new Player();
  private readonly conveyorPackages: Package[] = [];
  private readonly thrownPackages: Package[] = [];
  private readonly packageContainer = new Container();
  private readonly conveyor = new Conveyor();

  private timer = 0;
  private actionDown = false;
  private heldPackage: Package;

  initialize(parent: Container) {
    parent.scale.x = 2;
    parent.scale.y = 2;

    this.playArea.addPoint({ x: -playAreaWidth / 2, y: -playAreaHeight / 2 });
    this.playArea.addPoint({ x: playAreaWidth / 2, y: -playAreaHeight / 2 });
    this.playArea.addPoint({ x: playAreaWidth / 2, y: playAreaHeight / 2 });
    this.playArea.addPoint({ x: -playAreaWidth / 2, y: playAreaHeight / 2 });

    this.packageSpawnArea.addPoint({ x: this.playArea.minX, y: this.playArea.minY });
    this.packageSpawnArea.addPoint({ x: this.playArea.maxX, y: this.playArea.minY });
    this.packageSpawnArea.addPoint({ x: this.playArea.maxX, y: this.playArea.minY / 2 });
    this.packageSpawnArea.addPoint({ x: this.playArea.minX, y: this.playArea.minY / 2 });

    this.conveyor.initialize(parent);

    for (let i = 0; i < 30; ++i) {
      const box = new Package();
      box.initialize(this.packageContainer);
      box.spawn(this.playArea);
      this.conveyorPackages.push(box);
    }
    parent.addChild(this.packageContainer);

    this.player.initialize(parent);

    this.text.anchor.x = .5;
    this.text.y = -150;
    parent.addChild(this.text);
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

    const remainingColCheckPackages = this.conveyorPackages.slice();
    for (const box of this.conveyorPackages) {
      if (!box.boundCheckPlayArea(this.playArea)) {
        box.fall(delta);
        if (box.sprite.scale.y < .1) {
          box.spawn(this.packageSpawnArea);
        }
      } else {
        box.sprite.y += delta * conveyorSpeed;
        const packageIdx = remainingColCheckPackages.indexOf(box);
        remainingColCheckPackages.splice(packageIdx, 1);
        for (const otherBox of remainingColCheckPackages) {
          box.collisionCheckPackage(delta, otherBox);
        }
        box.collisionCheckPlayer(delta, this.player.container);
      }
    }

    for (const box of this.thrownPackages) {
      box.update(delta);

      if (box.sprite.y > this.playArea.maxY) {
        box.spawn(this.packageSpawnArea);
        const idx = this.thrownPackages.indexOf(box);
        this.thrownPackages.splice(idx, 1);
        this.conveyorPackages.push(box);
      }
    }
  }

  draw(graphics: Graphics) {
  }

  handleInput(input: Input) {
    this.player.handleInput(input);
    if (input & Input.Action) {
      if (!this.actionDown) {
        if (this.heldPackage) {
          this.packageContainer.addChild(this.heldPackage.sprite);
          this.thrownPackages.push(this.heldPackage);
          // this.packages.push(this.heldPackage);
          this.heldPackage.throw(this.player.facingLeft);
          this.heldPackage.sprite.x = this.player.container.x;
          this.heldPackage.sprite.y = this.player.container.y -24;
          this.heldPackage = undefined;
          this.player.carrying = false;
        } else {
          this.heldPackage = this.conveyorPackages.pop();
          this.player.container.addChild(this.heldPackage.sprite);
          this.heldPackage.sprite.x = 0;
          this.heldPackage.sprite.y = -24;
          this.heldPackage.sprite.rotation = 0;
          this.player.carrying = true;
        }
      }

      this.actionDown = true;
    } else {
      this.actionDown = false;
    }
  }
}