import { Container, AnimatedSprite, Graphics, Point } from 'pixi.js';
import charIdleFront1 from './assets/Char_idle_front1.png';
import charIdleFront2 from './assets/Char_idle_front2.png';
import charIdleBack1 from './assets/Char_idle_back1.png';
import charIdleBack2 from './assets/Char_idle_back2.png';
import charWalkingFront1 from './assets/Char_walking_front1.png';
import charWalkingFront2 from './assets/Char_walking_front2.png';
import charWalkingFront3 from './assets/Char_walking_front3.png';
import charWalkingFront4 from './assets/Char_walking_front4.png';
import charWalkingBack1 from './assets/Char_walking_back1.png';
import charWalkingBack2 from './assets/Char_walking_back2.png';
import charWalkingBack3 from './assets/Char_walking_back3.png';
import charWalkingBack4 from './assets/Char_walking_back4.png';
import { Input } from './game';

const moveSpeed = 100;

export class Hero {
  private readonly idleContainer = new Container();
  private readonly walkingContainer = new Container();
  private readonly idleFrontSprite = AnimatedSprite.fromImages([charIdleFront1, charIdleFront2]);
  private readonly idleBackSprite = AnimatedSprite.fromImages([charIdleBack1, charIdleBack2]);
  private readonly walkingFrontSprite = AnimatedSprite.fromImages([charWalkingFront1, charWalkingFront2, charWalkingFront3, charWalkingFront4]);
  private readonly walkingBackSprite = AnimatedSprite.fromImages([charWalkingBack1, charWalkingBack2, charWalkingBack3, charWalkingBack4]);
  private input = 0;

  readonly container = new Container();
  readonly move = new Point();

  initialize(graphics: Graphics) {
    this.container.addChild(this.idleContainer, this.walkingContainer);
    this.idleContainer.addChild(this.idleFrontSprite, this.idleBackSprite);
    this.walkingContainer.addChild(this.walkingFrontSprite, this.walkingBackSprite);

    this.idleFrontSprite.anchor.x = .5;
    this.idleFrontSprite.anchor.y = .5;
    this.idleFrontSprite.animationSpeed = .05;
    this.idleFrontSprite.play();

    this.idleBackSprite.anchor.x = .5;
    this.idleBackSprite.anchor.y = .5;
    this.idleBackSprite.animationSpeed = .05;
    this.idleBackSprite.play();

    this.walkingFrontSprite.anchor.x = .5;
    this.walkingFrontSprite.anchor.y = .5;
    this.walkingFrontSprite.animationSpeed = .1;
    this.walkingFrontSprite.play();

    this.walkingBackSprite.anchor.x = .5;
    this.walkingBackSprite.anchor.y = .5;
    this.walkingBackSprite.animationSpeed = .1;
    this.walkingBackSprite.play();

    this.idleBackSprite.visible = false;
    this.walkingContainer.visible = false;

    graphics.addChild(this.container);
  }

  update(delta: number) {
    const offset = new Point(
      -((this.input >> 2) & 1) + ((this.input >> 3) & 1),
      -((this.input >> 0) & 1) + ((this.input >> 1) & 1)
    );
    const sqLength = offset.x * offset.x + offset.y * offset.y;
    if (sqLength > 0) {
      const length = Math.sqrt(sqLength);
      offset.x /= length;
      offset.y /= length;
      this.container.x += offset.x * delta * moveSpeed;
      this.container.y += offset.y * delta * moveSpeed;
      this.walkingContainer.visible = true;
      this.idleContainer.visible = false;
    } else {
      this.idleContainer.visible = true;
      this.walkingContainer.visible = false;
    }

    if (offset.x > 0) this.container.scale.x = 1;
    if (offset.x < 0) this.container.scale.x = -1;
    if (offset.y > 0) {
      this.idleFrontSprite.visible = true;
      this.idleBackSprite.visible = false;
      this.walkingFrontSprite.visible = true;
      this.walkingBackSprite.visible = false;
    }
    if (offset.y < 0) {
      this.idleBackSprite.visible = true;
      this.idleFrontSprite.visible = false;
      this.walkingBackSprite.visible = true;
      this.walkingFrontSprite.visible = false;
    }
  }

  handleInput(input: Input) {
    this.input = input;
  }
}