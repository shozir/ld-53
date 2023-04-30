import { Graphics, Texture, TilingSprite } from 'pixi.js';
import { playAreaHeight, playAreaWidth } from './game';
import conveyorCenter from './assets/Conveyor_center1.png';
import conveyorSide from './assets/Conveyor_side1.png';
import conveyorBottom from './assets/Conveyor_bottom1.png';
import conveyorTop from './assets/Conveyor_top1.png';
import conveyorBottomCorner from './assets/Conveyor_bottom_corner1.png';
import conveyorTopCorner from './assets/Conveyor_top_corner1.png';

export const speed = 10;

export class Conveyor {
  private readonly conveyorSprite = new TilingSprite(Texture.from(conveyorCenter), playAreaWidth, playAreaHeight);
  private readonly conveyorRightSprite = new TilingSprite(Texture.from(conveyorSide), 32, playAreaHeight);
  private readonly conveyorLeftSprite = new TilingSprite(Texture.from(conveyorSide), 32, playAreaHeight);
  private readonly conveyorBottomSprite = new TilingSprite(Texture.from(conveyorBottom), playAreaWidth, 3);
  private readonly conveyorTopSprite = new TilingSprite(Texture.from(conveyorTop), playAreaWidth, 3);
  private readonly conveyorRightBottomSprite = new TilingSprite(Texture.from(conveyorBottomCorner), 32, 3);
  private readonly conveyorLeftBottomSprite = new TilingSprite(Texture.from(conveyorBottomCorner), 32, 3);
  private readonly conveyorRightTopSprite = new TilingSprite(Texture.from(conveyorTopCorner), 32, 3);
  private readonly conveyorLeftTopSprite = new TilingSprite(Texture.from(conveyorTopCorner), 32, 3);
  private timer = 0;

  initialize(graphics: Graphics) {
    this.conveyorSprite.anchor.set(.5);
    graphics.addChild(this.conveyorSprite);

    this.conveyorRightSprite.anchor.set(0, .5);
    this.conveyorRightSprite.x = playAreaWidth / 2;
    graphics.addChild(this.conveyorRightSprite);

    this.conveyorLeftSprite.anchor.set(0, .5);
    this.conveyorLeftSprite.x = -playAreaWidth / 2;
    this.conveyorLeftSprite.scale.x = -1;
    graphics.addChild(this.conveyorLeftSprite);

    this.conveyorBottomSprite.anchor.set(.5, 0);
    this.conveyorBottomSprite.y = playAreaHeight / 2;
    graphics.addChild(this.conveyorBottomSprite);

    this.conveyorTopSprite.anchor.set(.5, 1);
    this.conveyorTopSprite.y = -playAreaHeight / 2;
    graphics.addChild(this.conveyorTopSprite);

    this.conveyorRightBottomSprite.position.set(playAreaWidth / 2, playAreaHeight / 2);
    graphics.addChild(this.conveyorRightBottomSprite);

    this.conveyorLeftBottomSprite.position.set(-playAreaWidth / 2, playAreaHeight / 2);
    this.conveyorLeftBottomSprite.scale.x = -1;
    graphics.addChild(this.conveyorLeftBottomSprite);

    this.conveyorRightTopSprite.anchor.set(0, 1);
    this.conveyorRightTopSprite.position.set(playAreaWidth / 2, -playAreaHeight / 2);
    graphics.addChild(this.conveyorRightTopSprite);

    this.conveyorLeftTopSprite.anchor.set(0, 1);
    this.conveyorLeftTopSprite.position.set(-playAreaWidth / 2, -playAreaHeight / 2);
    this.conveyorLeftTopSprite.scale.x = -1;
    graphics.addChild(this.conveyorLeftTopSprite);
  }

  update(delta: number) {
    this.timer += delta;

    const uvY = (this.timer * 0.033) % 1;
    const tilePosY = uvY * 32 * speed;

    this.conveyorSprite.tilePosition.y = tilePosY;
    this.conveyorRightSprite.tilePosition.y = tilePosY;
    this.conveyorLeftSprite.tilePosition.y = tilePosY;
  }
}