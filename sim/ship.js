export const SHIP = {
  rotation: 4.4,
  thrust: 560,
  reverse: 220,
  drag: 1.05,
  maxSpeed: 360,
}

export function createShip(x, y) {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    thrust: 0,
  }
}

export function copyShip(from, to) {
  to.x = from.x
  to.y = from.y
  to.vx = from.vx
  to.vy = from.vy
  to.angle = from.angle
  to.thrust = from.thrust
  return to
}

export function cloneShip(ship) {
  return copyShip(ship, {})
}

export function integrate(ship, input, dt) {
  if (input.isDown('KeyA') || input.isDown('ArrowLeft')) {
    ship.angle -= SHIP.rotation * dt
  }

  if (input.isDown('KeyD') || input.isDown('ArrowRight')) {
    ship.angle += SHIP.rotation * dt
  }

  ship.thrust = 0

  if (input.isDown('KeyW') || input.isDown('ArrowUp')) {
    ship.vx += Math.cos(ship.angle) * SHIP.thrust * dt
    ship.vy += Math.sin(ship.angle) * SHIP.thrust * dt
    ship.thrust = 1
  }

  if (input.isDown('KeyS') || input.isDown('ArrowDown')) {
    ship.vx -= Math.cos(ship.angle) * SHIP.reverse * dt
    ship.vy -= Math.sin(ship.angle) * SHIP.reverse * dt
  }

  const damp = Math.exp(-SHIP.drag * dt)
  ship.vx *= damp
  ship.vy *= damp

  const speed = Math.hypot(ship.vx, ship.vy)
  if (speed > SHIP.maxSpeed) {
    const scale = SHIP.maxSpeed / speed
    ship.vx *= scale
    ship.vy *= scale
  }

  ship.x += ship.vx * dt
  ship.y += ship.vy * dt
}
