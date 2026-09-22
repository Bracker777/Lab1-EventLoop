import './style.css'
import { createLoop } from './loop.js'
import { createInput } from './input.js'
import { createShip, copyShip, integrate } from './sim/ship.js'
import { wrapShip, lerpWrap, lerpAngle } from './sim/arena.js'
import { setupCanvas } from './render/canvas.js'
import { drawArena, drawShip, drawHud } from './render/draw.js'

const params = new URLSearchParams(window.location.search)
const experiment = params.get('exp') ?? ''

const app = document.querySelector('#app')
app.innerHTML = `<canvas id="game" tabindex="0"></canvas>`

const canvas = document.querySelector('#game')
const { ctx, size } = setupCanvas(canvas)
const input = createInput(window)

const current = createShip(0, 0)
const previous = createShip(0, 0)

function resetShip() {
  current.x = size.width / 2
  current.y = size.height / 2
  current.vx = 0
  current.vy = 0
  current.angle = -Math.PI / 2
  current.thrust = 0
  copyShip(current, previous)
}

resetShip()
window.addEventListener('resize', resetShip)

const autoThrust = experiment === 'variable' || experiment === 'fixed-log'
const logUntil = performance.now() + 5000
let logged = false

const forcedInput = {
  isDown(code) {
    if (autoThrust && (code === 'KeyW' || code === 'ArrowUp')) return true
    return input.isDown(code)
  },
}

function simulate(dt) {
  copyShip(current, previous)
  integrate(current, autoThrust ? forcedInput : input, dt)
  wrapShip(current, size.width, size.height)

  if (autoThrust && !logged && performance.now() >= logUntil) {
    logged = true
    console.info('[lab-01] position after 5s of thrust', {
      experiment: experiment || 'fixed',
      x: current.x,
      y: current.y,
      vx: current.vx,
      vy: current.vy,
    })
  }
}

function interpolatedShip(alpha) {
  return {
    x: lerpWrap(previous.x, current.x, alpha, size.width),
    y: lerpWrap(previous.y, current.y, alpha, size.height),
    angle: lerpAngle(previous.angle, current.angle, alpha),
    thrust: current.thrust,
  }
}

function render(alpha, stats) {
  drawArena(ctx, size.width, size.height)
  drawShip(ctx, interpolatedShip(alpha))

  const labels = {
    block: 'EXP1 blocking 100ms / 60 frames',
    interval: 'EXP2 setInterval(16) instead of rAF',
    variable: 'EXP3 variable dt (hold thrust 5s, see console)',
    'fixed-log': 'control: fixed step + 5s thrust log',
  }

  drawHud(ctx, stats, labels[experiment] ?? '')
  input.endFrame()
}

const loop = createLoop({
  step: 1 / 60,
  simulate,
  render,
  useInterval: experiment === 'interval',
  variableStep: experiment === 'variable',
  blockEvery: experiment === 'block' ? 60 : 0,
  blockMs: experiment === 'block' ? 100 : 0,
})

loop.start()
canvas.focus()
window.__lab = { loop, current, previous, size }

if (experiment === 'interval') {
  setTimeout(() => {
    console.info(
      '[lab-01] setInterval frame-time stats (10s)',
      loop.getFrameTimeStats(),
    )
  }, 10_000)
}
