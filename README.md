# Space Arena — Lab 01

Браузерна гра з космічним кораблем: фіксований крок симуляції 60 Hz, рендер через `requestAnimationFrame` з інтерполяцією, арена з загортанням країв.

## Керування

- `W` / `↑` — тяга
- `S` / `↓` — реверс
- `A` `D` / `←` `→` — поворот

## Запуск

```bash
npm install
npm run dev
```

Лінт / формат / збірка:

```bash
npm run lint
npm run format
npm run build
```

Node 22+ (див. `.nvmrc`).

## Структура

```text
space-arena/
├── index.html
├── .nvmrc
├── eslint.config.js
├── src/
│   ├── main.js              # збирає loop, input, sim, render
│   ├── loop.js              # createLoop({ step, simulate, render })
│   ├── input.js             # createInput(target) — замикання
│   ├── sim/
│   │   ├── ship.js          # integrate(ship, input, dt) без DOM
│   │   └── arena.js         # wrap + lerp через границю
│   └── render/
│       ├── canvas.js        # devicePixelRatio + resize
│       └── draw.js          # корабель, сітка, HUD
└── scripts/
    └── measure-timestep.mjs # експеримент 3 (детермінізм)
```

Експерименти показали, що блокуючий синхронний код зупиняє роботу головного потоку та затримує виконання наступних кадрів. setInterval дозволяє запускати ігровий цикл, але не синхронізує його з оновленням екрана. Variable timestep робить поведінку simulation залежною від FPS. Тому в основній реалізації використано requestAnimationFrame для рендерингу та fixed timestep 1/60 для simulation.