import Ball from './ball';
import Letter from './letter';
jest.mock('./letter');

global.Math.random = () => 0.5
const letter = new Letter()

beforeEach(() => {
  Letter.mockClear();
});

it('Ball is created with a random x position,a chosen y position and a radius', () => {
  const testBall = new Ball(800,10,Letter,'canvas')
  expect(testBall.xPos).toBe(250);
  expect(testBall.yPos).toBe(800);
  expect(testBall.radius).toBe(10);
});

it('Ball starts with zero velocity', () => {
  const testBall = new Ball(800,10,Letter,'canvas')
  expect(testBall.xVel).toBe(0);
  expect(testBall.yVel).toBe(0);
});

it('Ball starts with zero speed', () => {
  const testBall = new Ball(800,10,Letter,'canvas')
  expect(testBall.speed()).toBe(0);
});

it('Ball can be given velocity', () => {
  const testBall = new Ball(800,10,Letter,'canvas')
  testBall.giveVelocity (0, 0, 10, 10);
  expect(testBall.xVel).toBe(10);
  expect(testBall.yVel).toBe(10);
});

it('cant give velocity twice', () => {
  const testBall = new Ball(800,10,Letter,'canvas')
  testBall.giveVelocity (0, 0, 10, 10);
  testBall.giveVelocity (0, 0, 20, 20);
  expect(testBall.xVel).toBe(10);
  expect(testBall.yVel).toBe(10);
  expect(testBall.isClicked).toBeTruthy()
});

it('can check if ball is "not done" aka stil in use', () => {
  const testBall = new Ball(800,10,Letter,'canvas')
  testBall.giveVelocity (0, 0, 20, 20);
  testBall.checkStill()
  expect(testBall.isDone).toNotBeTruthy
});

it('can check if ball is "done" aka used and still ', () => {
  const testBall = new Ball(800,10,Letter,'canvas')
  testBall.isClicked = true
  testBall.checkStill()
  expect(testBall.isDone).toBeTruthy
});

it('can set a ball as done', () => {
  const testBall = new Ball(800,10,Letter,'canvas')
  testBall.done()
  expect(testBall.done).toBeTruthy
});

it('can know the position of the ball', () => {
  const testBall = new Ball(800,10,Letter,'canvas')
  testBall.position()
  expect(testBall.xPos).toBe(250);
  expect(testBall.yPos).toBe(800);
});

it('does nothing with no colision', () => {
  const testBall = new Ball(800,10,Letter,'canvas')
  testBall.detectCollision ()
  expect(testBall.xPos).toBe(250);
  expect(testBall.yPos).toBe(800);
  expect(testBall.xVel).toBe(0);
  expect(testBall.yVel).toBe(0);
});

it('handles a colision bottom y', () => {
  var canvas = {height:900};
  const testBall = new Ball(1000,10,Letter,canvas)
  testBall.giveVelocity (0, 0, 20, 20);
  testBall.detectCollision()
  expect(testBall.xPos).toBe(250);
  expect(testBall.yPos).toBe(900-testBall.radius);
  expect(testBall.xVel).toBe(20);
  expect(testBall.yVel).toBe(-10);
});

it('handles a colision top left x', () => {
  var canvas = {width:500};
  const testBall = new Ball(800,10,Letter,canvas)
  testBall.xPos = -100
  testBall.giveVelocity (20, 20, 0, 0);
  testBall.detectCollision()
  expect(testBall.xPos).toBe(testBall.radius);
  expect(testBall.yPos).toBe(800);
  expect(testBall.xVel).toBe(10);
  expect(testBall.yVel).toBe(-20);
});

it('handles a colision top right x', () => {
  var canvas = {width:500};
  const testBall = new Ball(800,10,Letter,canvas)
  testBall.xPos = 800
  testBall.giveVelocity (0, 0, 20, 20);
  testBall.detectCollision()
  expect(testBall.xPos).toBe(canvas.width-testBall.radius);
  expect(testBall.yPos).toBe(800);
  expect(testBall.xVel).toBe(-10);
  expect(testBall.yVel).toBe(20);
});
