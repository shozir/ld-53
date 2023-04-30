import { Bounds, Graphics, IPointData, Sprite, Texture } from 'pixi.js';
import { playerSize } from './player';

const size = 16;
const minPlayerDistance = (playerSize / 2) + (size / 2);
const colModifier = 20;

export class Package {
  readonly sprite = Sprite.from(Texture.WHITE);

  initialize(graphics: Graphics) {
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.anchor.set(.5);
    this.sprite.tint = 0xff0000;

    graphics.addChild(this.sprite);
  }

  update(delta: number) {
  }

  spawn(spawnBounds: Bounds) {
    const xRand = Math.random();
    const yRand = Math.random();
    this.sprite.x = (1 - xRand) * spawnBounds.minX + xRand * spawnBounds.maxX;
    this.sprite.y = (1 - yRand) * spawnBounds.minY + yRand * spawnBounds.maxY;
  }

  collisionCheckPackage(delta: number, box: Sprite) {
    const xDiff = box.x - this.sprite.x;
    const yDiff = box.y - this.sprite.y;
    const sqDist = xDiff * xDiff + yDiff * yDiff;
    if (sqDist < size * size) {
      const dist = Math.sqrt(sqDist);
      const origSpriteX = this.sprite.x;
      const origSpriteY = this.sprite.y;
      this.sprite.x = this.sprite.x + ((this.sprite.x - box.x) / dist) * delta * colModifier;
      this.sprite.y = this.sprite.y + ((this.sprite.y - box.y) / dist) * delta * colModifier;
      box.x = box.x + ((box.x - origSpriteX) / dist) * delta * colModifier;
      box.y = box.y + ((box.y - origSpriteY) / dist) * delta * colModifier;
    }
  }

  collisionCheckPlayer(playerPos: IPointData) {
    const xDiff = playerPos.x - this.sprite.x;
    const yDiff = playerPos.y - this.sprite.y;
    const sqDist = xDiff * xDiff + yDiff * yDiff;
    if (sqDist < minPlayerDistance * minPlayerDistance) {
      const dist = Math.sqrt(sqDist);
      this.sprite.x = playerPos.x - (xDiff / dist) * minPlayerDistance;
      this.sprite.y = playerPos.y - (yDiff / dist) * minPlayerDistance;
    }
  }

  boundCheckPlayArea(playArea: Bounds) {
    return !(this.sprite.x < playArea.minX || this.sprite.x > playArea.maxX || this.sprite.y < playArea.minY || this.sprite.y > playArea.maxY);
  }
}