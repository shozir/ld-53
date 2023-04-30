import { Container, AnimatedSprite, Point } from 'pixi.js';
import charIdleFront1 from './assets/Char_idle_front1.png';
import charIdleFront2 from './assets/Char_idle_front2.png';
import charIdleFrontCarry1 from './assets/Char_idle_front_carry1.png';
import charIdleFrontCarry2 from './assets/Char_idle_front_carry2.png';
import charIdleBack1 from './assets/Char_idle_back1.png';
import charIdleBack2 from './assets/Char_idle_back2.png';
import charIdleBackCarry1 from './assets/Char_idle_back_carry1.png';
import charIdleBackCarry2 from './assets/Char_idle_back_carry2.png';
import charWalkingFront1 from './assets/Char_walking_front1.png';
import charWalkingFront2 from './assets/Char_walking_front2.png';
import charWalkingFront3 from './assets/Char_walking_front3.png';
import charWalkingFront4 from './assets/Char_walking_front4.png';
import charWalkingFrontCarry1 from './assets/Char_walking_front_carry1.png';
import charWalkingFrontCarry2 from './assets/Char_walking_front_carry2.png';
import charWalkingFrontCarry3 from './assets/Char_walking_front_carry3.png';
import charWalkingFrontCarry4 from './assets/Char_walking_front_carry4.png';
import charWalkingBack1 from './assets/Char_walking_back1.png';
import charWalkingBack2 from './assets/Char_walking_back2.png';
import charWalkingBack3 from './assets/Char_walking_back3.png';
import charWalkingBack4 from './assets/Char_walking_back4.png';
import charWalkingBackCarry1 from './assets/Char_walking_back_carry1.png';
import charWalkingBackCarry2 from './assets/Char_walking_back_carry2.png';
import charWalkingBackCarry3 from './assets/Char_walking_back_carry3.png';
import charWalkingBackCarry4 from './assets/Char_walking_back_carry4.png';
import { Input } from './game';

const moveSpeed = 100;

export const playerSize = 32;

export class Player {
  private readonly idleContainer = new Container();
  private readonly walkingContainer = new Container();
  private readonly idleFrontSprite = AnimatedSprite.fromImages([charIdleFront1, charIdleFront2]);
  private readonly idleFrontCarrySprite = AnimatedSprite.fromImages([charIdleFrontCarry1, charIdleFrontCarry2]);
  private readonly idleBackSprite = AnimatedSprite.fromImages([charIdleBack1, charIdleBack2]);
  private readonly idleBackCarrySprite = AnimatedSprite.fromImages([charIdleBackCarry1, charIdleBackCarry2]);
  private readonly walkingFrontSprite = AnimatedSprite.fromImages([charWalkingFront1, charWalkingFront2, charWalkingFront3, charWalkingFront4]);
  private readonly walkingFrontCarrySprite = AnimatedSprite.fromImages([charWalkingFrontCarry1, charWalkingFrontCarry2, charWalkingFrontCarry3, charWalkingFrontCarry4]);
  private readonly walkingBackSprite = AnimatedSprite.fromImages([charWalkingBack1, charWalkingBack2, charWalkingBack3, charWalkingBack4]);
  private readonly walkingBackCarrySprite = AnimatedSprite.fromImages([charWalkingBackCarry1, charWalkingBackCarry2, charWalkingBackCarry3, charWalkingBackCarry4]);
  private input = 0;
  private back = false;

  readonly container = new Container();
  readonly move = new Point();
  carrying = false;

  initialize(parent: Container) {
    this.container.addChild(this.idleContainer, this.walkingContainer);
    this.idleContainer.addChild(this.idleFrontSprite, this.idleFrontCarrySprite, this.idleBackSprite, this.idleBackCarrySprite);
    this.walkingContainer.addChild(this.walkingFrontSprite, this.walkingFrontCarrySprite, this.walkingBackSprite, this.walkingBackCarrySprite);

    this.idleFrontSprite.anchor.set(.5);
    this.idleFrontSprite.animationSpeed = .05;
    this.idleFrontSprite.play();

    this.idleFrontCarrySprite.anchor.set(.5);
    this.idleFrontCarrySprite.animationSpeed = .05;
    this.idleFrontCarrySprite.play();
    this.idleFrontCarrySprite.visible = false;

    this.idleBackSprite.anchor.set(.5);
    this.idleBackSprite.animationSpeed = .05;
    this.idleBackSprite.play();
    this.idleBackSprite.visible = false;

    this.idleBackCarrySprite.anchor.set(.5);
    this.idleBackCarrySprite.animationSpeed = .05;
    this.idleBackCarrySprite.play();
    this.idleBackCarrySprite.visible = false;

    this.walkingFrontSprite.anchor.set(.5);
    this.walkingFrontSprite.animationSpeed = .1;
    this.walkingFrontSprite.play();

    this.walkingFrontCarrySprite.anchor.set(.5);
    this.walkingFrontCarrySprite.animationSpeed = .1;
    this.walkingFrontCarrySprite.play();
    this.walkingFrontCarrySprite.visible = false;

    this.walkingBackSprite.anchor.set(.5);
    this.walkingBackSprite.animationSpeed = .1;
    this.walkingBackSprite.play();

    this.walkingBackCarrySprite.anchor.set(.5);
    this.walkingBackCarrySprite.animationSpeed = .1;
    this.walkingBackCarrySprite.play();
    this.walkingBackCarrySprite.visible = false;

    this.walkingContainer.visible = false;

    parent.addChild(this.container);
  }

  update(delta: number) {
    let walking = false;
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
      walking = true;
    }

    if (offset.x > 0) this.container.scale.x = 1;
    if (offset.x < 0) this.container.scale.x = -1;
    if (offset.y > 0) this.back = false;
    if (offset.y < 0) this.back = true;

    this.walkingContainer.visible = walking;
    this.idleContainer.visible = !walking;
    this.idleBackSprite.visible = this.back && !this.carrying;
    this.idleBackCarrySprite.visible = this.back && this.carrying;
    this.walkingBackSprite.visible = this.back && !this.carrying;
    this.walkingBackCarrySprite.visible = this.back && this.carrying;
    this.idleFrontSprite.visible = !this.back && !this.carrying;
    this.idleFrontCarrySprite.visible = !this.back && this.carrying;
    this.walkingFrontSprite.visible = !this.back && !this.carrying;
    this.walkingFrontCarrySprite.visible = !this.back && this.carrying;
  }

  handleInput(input: Input) {
    this.input = input;
  }
}