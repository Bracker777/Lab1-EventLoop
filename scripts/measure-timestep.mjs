import { createShip, integrate } from '../src/sim/ship.js'
import { wrapShip } from '../src/sim/arena.js'

const width = 1280
const height = 720
const hold = { isDown: (code) => code === 'KeyW' }

function run(variable, seconds = 5) {
  const ship = createShip(width / 2, height / 2)
  const step = 1 / 60
  let t = 0
  let steps = 0

  if (variable) {
    const dts = [1 / 60, 1 / 30, 1 / 12, 1 / 8]
    let i = 0
    while (t < seconds) {
      const dt = dts[i % dts.length]
      integrate(ship, hold, dt)
      wrapShip(ship, width, height)
      t += dt
      steps++
      i++
    }
  } else {
    const n = Math.round(seconds / step)
    for (let i = 0; i < n; i++) {
      integrate(ship, hold, step)
      wrapShip(ship, width, height)
      steps++
    }
    t = n * step
  }

  return {
    mode: variable ? 'variable' : 'fixed',
    t,
    steps,
    x: ship.x,
    y: ship.y,
    vx: ship.vx,
    vy: ship.vy,
    speed: Math.hypot(ship.vx, ship.vy),
  }
}

console.log(
  JSON.stringify({ a: run(false), b: run(false), c: run(true) }, null, 2),
)
