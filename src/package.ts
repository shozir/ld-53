import { Bounds, Container, IPointData, Sprite } from 'pixi.js';
import { playerSize } from './player';
import box1 from './assets/Box1.png';
import box2 from './assets/Box2.png';

const size = 24;
const minPlayerDistance = (playerSize / 2) + (size / 2);
const colModifier = 20;
const rotModifier = .5;

export class Package {
  private thrownVector?: { x: number, y: number };
  private size = size;

  readonly sprite = Sprite.from(Math.random() < .5 ? box1 : box2);
  readonly rotClockwise = Math.random() < .5;

  initialize(parent: Container) {
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.anchor.set(.5);

    parent.addChild(this.sprite);
  }

  update(delta: number) {
    if (this.thrownVector) {
      this.sprite.x += this.thrownVector.x;
      this.sprite.y += this.thrownVector.y;

      this.thrownVector.y += delta * 20;

      this.sprite.rotation += (this.rotClockwise ? 1 : -1) * delta * rotModifier * 10;
    }
  }

  spawn(spawnBounds: Bounds) {
    const xRand = Math.random();
    const yRand = Math.random();
    this.sprite.x = (1 - xRand) * spawnBounds.minX + xRand * spawnBounds.maxX;
    this.sprite.y = (1 - yRand) * spawnBounds.minY + yRand * spawnBounds.maxY;
    this.size = size;
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.rotation = Math.random() * 2 * Math.PI;
  }

  collisionCheckPackage(delta: number, otherPackage: Package) {
    const xDiff = otherPackage.sprite.x - this.sprite.x;
    const yDiff = otherPackage.sprite.y - this.sprite.y;
    const sqDist = xDiff * xDiff + yDiff * yDiff;
    if (sqDist < size * size) {
      const dist = Math.sqrt(sqDist);
      const origSpriteX = this.sprite.x;
      const origSpriteY = this.sprite.y;
      this.sprite.x = this.sprite.x + ((this.sprite.x - otherPackage.sprite.x) / dist) * delta * colModifier;
      this.sprite.y = this.sprite.y + ((this.sprite.y - otherPackage.sprite.y) / dist) * delta * colModifier;
      this.sprite.rotation += (this.rotClockwise ? 1 : -1) * delta * rotModifier;
      otherPackage.sprite.x = otherPackage.sprite.x + ((otherPackage.sprite.x - origSpriteX) / dist) * delta * colModifier;
      otherPackage.sprite.y = otherPackage.sprite.y + ((otherPackage.sprite.y - origSpriteY) / dist) * delta * colModifier;
      otherPackage.sprite.rotation += (otherPackage.rotClockwise ? 1 : -1) * delta * rotModifier;
    }
  }

  collisionCheckPlayer(delta: number, playerPos: IPointData) {
    const xDiff = playerPos.x - this.sprite.x;
    const yDiff = playerPos.y - this.sprite.y;
    const sqDist = xDiff * xDiff + yDiff * yDiff;
    if (sqDist < minPlayerDistance * minPlayerDistance) {
      const dist = Math.sqrt(sqDist);
      this.sprite.x = playerPos.x - (xDiff / dist) * minPlayerDistance;
      this.sprite.y = playerPos.y - (yDiff / dist) * minPlayerDistance;
      this.sprite.rotation += (this.rotClockwise ? 1 : -1) * delta * rotModifier;
    }
  }

  boundCheckPlayArea(playArea: Bounds) {
    return !(this.sprite.x < playArea.minX - (size / 2) || this.sprite.x > playArea.maxX + (size / 2) || this.sprite.y < playArea.minY - (size / 2) || this.sprite.y > playArea.maxY + (size / 2));
  }

  fall(delta: number) {
    this.size -= delta * 30;
    this.sprite.width = this.size;
    this.sprite.height = this.size;
  }

  throw(left: boolean) {
    this.thrownVector = { x: (left ? -1 : 1) * 10, y: -5 };
  }
}