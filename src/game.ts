import { AnimatedSprite, Bounds, Container, Graphics, Point, Text, TextStyle } from 'pixi.js';
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
  private readonly hero = new Container();
  private readonly heroIdle = new Container();
  private readonly heroWalking = new Container();
  private readonly heroIdleFront = AnimatedSprite.fromImages([charIdleFront1, charIdleFront2]);
  private readonly heroIdleBack = AnimatedSprite.fromImages([charIdleBack1, charIdleBack2]);
  private readonly heroWalkingFront = AnimatedSprite.fromImages([charWalkingFront1, charWalkingFront2, charWalkingFront3, charWalkingFront4]);
  private readonly heroWalkingBack = AnimatedSprite.fromImages([charWalkingBack1, charWalkingBack2, charWalkingBack3, charWalkingBack4]);
  private timer = 0;
  private input = 0;

  initialize(graphics: Graphics) {
    this.playArea.addPoint({ x: -120, y: -200 });
    this.playArea.addPoint({ x: 120, y: -200 });
    this.playArea.addPoint({ x: 120, y: 200 });
    this.playArea.addPoint({ x: -120, y: 200 });

    // graphics.addChild(this.text);
    this.hero.addChild(this.heroIdle, this.heroWalking);
    this.heroIdle.addChild(this.heroIdleFront, this.heroIdleBack);
    this.heroWalking.addChild(this.heroWalkingFront, this.heroWalkingBack);
    this.heroIdleFront.anchor.x = .5;
    this.heroIdleFront.anchor.y = .5;
    this.heroIdleFront.animationSpeed = .05;
    this.heroIdleFront.play();
    this.heroIdleBack.anchor.x = .5;
    this.heroIdleBack.anchor.y = .5;
    this.heroIdleBack.animationSpeed = .05;
    this.heroIdleBack.play();
    this.heroWalkingFront.anchor.x = .5;
    this.heroWalkingFront.anchor.y = .5;
    this.heroWalkingFront.animationSpeed = .1;
    this.heroWalkingFront.play();
    this.heroWalkingBack.anchor.x = .5;
    this.heroWalkingBack.anchor.y = .5;
    this.heroWalkingBack.animationSpeed = .1;
    this.heroWalkingBack.play();
    this.heroIdleBack.visible = false;

    graphics.addChild(this.hero);

    graphics.beginFill(0xFFFF00);
    graphics.drawRect(this.playArea.minX, this.playArea.minY, this.playArea.maxX - this.playArea.minX, this.playArea.maxY - this.playArea.minY);

    this.hero.getBounds();
  }

  update(delta: number) {
    this.timer += delta;
    const offset = new Point(
      -((this.input >> 2) & 1) + ((this.input >> 3) & 1),
      -((this.input >> 0) & 1) + ((this.input >> 1) & 1)
    );
    const length = Math.sqrt(offset.x * offset.x + offset.y * offset.y);
    if (length > 0) {
      offset.x /= length;
      offset.y /= length;
      this.hero.x += offset.x * delta * moveSpeed;
      this.hero.y += offset.y * delta * moveSpeed;
      this.heroWalking.visible = true;
      this.heroIdle.visible = false;
    } else {
      this.heroIdle.visible = true;
      this.heroWalking.visible = false;
    }

    if (offset.x > 0) this.hero.scale.x = 1;
    if (offset.x < 0) this.hero.scale.x = -1;
    if (offset.y > 0) {
      this.heroIdleFront.visible = true;
      this.heroIdleBack.visible = false;
      this.heroWalkingFront.visible = true;
      this.heroWalkingBack.visible = false;
    }
    if (offset.y < 0) {
      this.heroIdleBack.visible = true;
      this.heroIdleFront.visible = false;
      this.heroWalkingBack.visible = true;
      this.heroWalkingFront.visible = false;
    }

    if (this.hero.x < this.playArea.minX) this.hero.position.x = this.playArea.minX;
    if (this.hero.x > this.playArea.maxX) this.hero.position.x = this.playArea.maxX;
    if (this.hero.y < this.playArea.minY) this.hero.position.y = this.playArea.minY;
    if (this.hero.y > this.playArea.maxY) this.hero.position.y = this.playArea.maxY;
  }

  draw(graphics: Graphics) {
  }

  handleInput(input: Input) {
    this.input = input;
  }
}