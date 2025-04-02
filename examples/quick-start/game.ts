import { createEngine } from '@studiokeywi/banjo/engine';
import { clamp } from '@studiokeywi/banjo/math/conversions';
import { native } from '@studiokeywi/banjo/math/random';
import { add, vector2 } from '@studiokeywi/banjo/math/v2';
import { createWatcher } from '@studiokeywi/banjo/watcher';

const pause = () => {
  if (!engine.paused) {
    engine.pause();
  }
};
const unpause = () => {
  if (engine.paused) {
    engine.pause();
  }
};

const hud = document.querySelector<HTMLDivElement>('#debugHUD')!;
const isPaused = createWatcher({
  do: () => {
    if (engine.paused && !hud.innerText.includes('Paused')) {
      hud.innerText += ' | Paused';
    }
  },
});
let FPS: number;
let TPS: number;

const ball = document.querySelector<HTMLDivElement>('#ball')!;
const rng = native();
const speedX = rng.randRange(1, 5, true) * (rng.randFloat() < 0.5 ? 1 : -1);
const speedY = rng.randRange(1, 5, true) * (rng.randFloat() < 0.5 ? 1 : -1);
const ballSpeed = vector2(speedX, speedY);
const startX = rng.randRange(0, innerWidth - 16, true);
const startY = rng.randRange(0, innerHeight - 16, true);
const ballPosition = vector2(startX, startY);

const engine = createEngine({
  TPS: 60,
  render: delta => {
    hud.innerText = `Engine TPS: ${TPS} | Engine FPS: ${FPS}`;
    ball.style.left = `${ballPosition.x + delta * ballSpeed.x}px`;
    ball.style.top = `${ballPosition.y + delta * ballSpeed.y}px`;
  },
  update: () => {
    ({ FPS, TPS } = engine);
    if (!isPaused.running) {
      isPaused.start();
    }
    add(ballPosition, ballSpeed, ballPosition);
    if (ballPosition.x < 0 || ballPosition.x >= innerWidth - 16) {
      ballPosition.x = clamp(ballPosition.x, 0, innerWidth - 16);
      ballSpeed.x *= -1;
    }
    if (ballPosition.y < 0 || ballPosition.y >= innerHeight - 16) {
      ballPosition.y = clamp(ballPosition.y, 0, innerHeight - 16);
      ballSpeed.y *= -1;
    }
  },
});

addEventListener('beforeunload', () => {
  engine.stop();
  isPaused.stop();
  removeEventListener('blur', pause);
  removeEventListener('focus', unpause);
});
addEventListener('blur', pause);
addEventListener('focus', unpause);

if (document.readyState === 'complete') {
  engine.start();
} else {
  addEventListener('load', () => {
    engine.start();
  });
}
