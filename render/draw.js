function starPositions(width, height, count) {
  const stars = []
  let seed = (width * 73856093) ^ (height * 19349663)

  for (let i = 0; i < count; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0
    const x = (seed % 10000) / 10000
    seed = (seed * 1664525 + 1013904223) >>> 0
    const y = (seed % 10000) / 10000
    seed = (seed * 1664525 + 1013904223) >>> 0
    const r = 0.6 + (seed % 1000) / 1000
    stars.push({ x: x * width, y: y * height, r })
  }

  return stars
}

export function drawArena(ctx, width, height) {
  ctx.fillStyle = '#070b16'
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)'
  ctx.lineWidth = 1
  const gap = 80

  ctx.beginPath()
  for (let x = 0; x <= width; x += gap) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }
  for (let y = 0; y <= height; y += gap) {
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }
  ctx.stroke()

  ctx.fillStyle = '#e2e8f0'
  for (const star of starPositions(width, height, 90)) {
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function drawShip(ctx, ship) {
  ctx.save()
  ctx.translate(ship.x, ship.y)
  ctx.rotate(ship.angle)

  if (ship.thrust > 0) {
    ctx.fillStyle = '#fb923c'
    ctx.beginPath()
    ctx.moveTo(-16, -6)
    ctx.lineTo(-28 - Math.abs(Math.sin(ship.x * 0.15 + ship.y * 0.15)) * 8, 0)
    ctx.lineTo(-16, 6)
    ctx.closePath()
    ctx.fill()
  }

  ctx.fillStyle = '#38bdf8'
  ctx.strokeStyle = '#e0f2fe'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(22, 0)
  ctx.lineTo(-16, -14)
  ctx.lineTo(-8, 0)
  ctx.lineTo(-16, 14)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.restore()
}

export function drawHud(ctx, stats, extra = '') {
  const fps = stats.framesPerSecond
  const steps = stats.stepsPerSecond
  const frameTime = stats.frameTime.toFixed(2)

  ctx.fillStyle = 'rgba(2, 6, 23, 0.72)'
  ctx.fillRect(12, 12, 320, extra ? 78 : 58)

  ctx.fillStyle = '#e2e8f0'
  ctx.font = '13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
  ctx.fillText(`steps/s  ${steps}`, 24, 32)
  ctx.fillText(`frames/s ${fps}`, 24, 50)
  ctx.fillText(`frame    ${frameTime} ms`, 148, 32)
  ctx.fillText('WASD / arrows  ·  wrap arena', 148, 50)

  if (extra) {
    ctx.fillStyle = '#fbbf24'
    ctx.fillText(extra, 24, 72)
  }
}
