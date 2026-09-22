export function createInput(target = window) {
  const down = new Set()
  const pressed = new Set()

  function onKeyDown(event) {
    if (!down.has(event.code)) {
      pressed.add(event.code)
    }
    down.add(event.code)

    if (
      event.code.startsWith('Arrow') ||
      event.code === 'Space' ||
      event.code === 'KeyW' ||
      event.code === 'KeyA' ||
      event.code === 'KeyS' ||
      event.code === 'KeyD'
    ) {
      event.preventDefault()
    }
  }

  function onKeyUp(event) {
    down.delete(event.code)
  }

  function onBlur() {
    down.clear()
    pressed.clear()
  }

  target.addEventListener('keydown', onKeyDown)
  target.addEventListener('keyup', onKeyUp)
  target.addEventListener('blur', onBlur)

  return {
    isDown(code) {
      return down.has(code)
    },
    justPressed(code) {
      return pressed.has(code)
    },
    endFrame() {
      pressed.clear()
    },
  }
}
