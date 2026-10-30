// 404 minigame by Osmo (https://osmo.supply), in Freeplay colors. Drag the hand back and let go
// to launch the rocket; hit every target (nav, eyebrow, headline words and both flies) to win.
// Osmo's code is unchanged down to onHit(); the pasted resource was cut off there, so the rest
// (finish, explode, drag-and-launch) is written to match it.
gsap.registerPlugin(Draggable, InertiaPlugin, Physics2DPlugin);

function initConfettiExplosion(x, y) {
  const dotCount = gsap.utils.random(10, 20, 1);
  const colors   = ["#C8001C", "#F5F5F5", "#3BE3D6", "#B3001C"];
  const container = document.querySelector('[data-minigame-init]');

  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    container.appendChild(dot);

    gsap.set(dot, {
      left:  `${x}px`,
      top:   `${y}px`,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      backgroundColor: gsap.utils.random(colors)
    });

    gsap.timeline({ onComplete: () => dot.remove() })
      .to(dot, {
        scale:    gsap.utils.random(0.3, 1),
        duration: 0.3,
        ease:     "power3.out"
      })
      .to(dot, {
        duration: 2,
        physics2D: {
          velocity: gsap.utils.random(500, 1000),
          angle:    gsap.utils.random(0, 360),
          gravity:  500
        },
        autoAlpha: 0,
        ease:      "none"
      }, "<");
  }
}

function init404Minigame() {
  const CONFIG = {
    dragToVelocityRatio: 0.01,
    inertiaResistance:   20,
    pullReset:           { duration: 0.8, ease: 'elastic.out(1,0.5)' },
    rocketFadeOut:       { duration: 0.5 },
    maxSpeed:            2000,
    flyMinDuration:      1.5,
    flyMaxDuration:      3,
    flyRotateDuration:   1
  };

  const container     = document.querySelector('[data-minigame-init]');
  if (!container) return;
  const pull          = container.querySelector('[data-minigame-pull]');
  const rocket        = container.querySelector('[data-minigame-rocket]');
  const line          = container.querySelector('[data-minigame-line]');
  const statusEl      = container.querySelector('[data-minigame-status]');
  const scoreTimeSpan = container.querySelector('[data-minigame-score-time]');
  const resetButton   = container.querySelector('[data-minigame-reset]');
  const flies         = Array.from(container.querySelectorAll('[data-minigame-fly]'));

  let rocketTween, isFlying = false;
  let containerRect, origin;
  let startTime = null;

  // The nav sits outside the game section, so targets are collected from the whole page
  const rawTargets = [
    ...document.querySelectorAll('[data-minigame-target]'),
    ...flies
  ];
  const allTargets = rawTargets.filter(el => el && window.getComputedStyle(el).display !== 'none');
  const totalTargets = allTargets.length;
  const hitTargets   = new Set();
  const flyTweens    = new Map();

  function resetGame() {
    hitTargets.clear();
    allTargets.forEach(el => {
      el.style.visibility    = '';
      el.style.opacity       = '';
      el.style.pointerEvents = '';
    });

    startTime = null;
    statusEl.setAttribute('data-minigame-status','ready');
    scoreTimeSpan.textContent = '0.00';

    gsap.set([pull, rocket, line], {
      clearProps: 'all',
      x: 0, y: 0,
      opacity: 1,
      rotation: 0
    });
    isFlying = false;
    if (rocketTween) rocketTween.kill();

    containerRect = container.getBoundingClientRect();

    flies.forEach(fly => {
      if (flyTweens.has(fly)) flyTweens.get(fly).kill();

      const maxX = containerRect.width  - fly.offsetWidth;
      const maxY = containerRect.height - fly.offsetHeight;
      const startX = gsap.utils.random(0, maxX);
      const startY = gsap.utils.random(0, maxY);

      gsap.set(fly, { clearProps: 'x,y,rotation' });
      fly.style.left      = `${startX}px`;
      fly.style.top       = `${startY}px`;
      fly.style.transform = 'rotate(0deg)';

      moveFly(fly);
    });
  }

  resetButton.addEventListener('click', () => {
    resetGame();
  });
  resetGame();

  function moveFly(fly) {
    const maxX = containerRect.width  - fly.offsetWidth;
    const maxY = containerRect.height - fly.offsetHeight;
    const newX = gsap.utils.random(0, maxX);
    const newY = gsap.utils.random(0, maxY);

    const cur = fly.getBoundingClientRect();
    const curX = cur.left - containerRect.left;
    const curY = cur.top  - containerRect.top;
    const dx = newX - curX;
    const dy = newY - curY;
    const targetAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;

    gsap.to(fly, {
      rotation: targetAngle,
      duration: CONFIG.flyRotateDuration,
      ease:     'elastic.out(1,0.75)'
    });

    const tween = gsap.to(fly, {
      left:     `${newX}px`,
      top:      `${newY}px`,
      duration: gsap.utils.random(CONFIG.flyMinDuration, CONFIG.flyMaxDuration),
      ease:     'power1.inOut',
      onComplete: () => moveFly(fly)
    });
    flyTweens.set(fly, tween);
  }

  function rectsOverlap(r1, r2) {
    return !(
      r2.left   > r1.right ||
      r2.right  < r1.left  ||
      r2.top    > r1.bottom||
      r2.bottom < r1.top
    );
  }

  function onRocketUpdate() {
    const rRect = rocket.getBoundingClientRect();
    const cRect = containerRect;
    if (
      rRect.right  < cRect.left   ||
      rRect.left   > cRect.right  ||
      rRect.bottom < cRect.top    ||
      rRect.top    > cRect.bottom
    ) {
      rocketTween.kill();
      isFlying = false;
      gsap.set(rocket, { opacity: 0 });
      return;
    }
    for (let t of allTargets) {
      if (hitTargets.has(t)) continue;
      const tRect = t.getBoundingClientRect();
      if (rectsOverlap(rRect, tRect)) {
        hitTargets.add(t);
        if (flies.includes(t) && flyTweens.has(t)) flyTweens.get(t).kill();
        explodeTarget(t, tRect);
        onHit();
        break;
      }
    }
  }

  function onHit() {
    if (hitTargets.size === totalTargets) {
      const seconds = (performance.now() - startTime) / 1000;
      scoreTimeSpan.textContent = seconds.toFixed(2);
      statusEl.setAttribute('data-minigame-status', 'finished');
    }
  }

  // Confetti from the target's center, then hide it (resetGame clears these styles)
  function explodeTarget(el, rect) {
    initConfettiExplosion(
      rect.left + rect.width  / 2 - containerRect.left,
      rect.top  + rect.height / 2 - containerRect.top
    );
    el.style.visibility    = 'hidden';
    el.style.opacity       = '0';
    el.style.pointerEvents = 'none';
  }

  function launch(dx, dy, distance) {
    if (startTime === null) startTime = performance.now();
    if (rocketTween) rocketTween.kill();

    // Fly away from the pull, faster the further it was pulled
    const speed = Math.min(distance / CONFIG.dragToVelocityRatio, CONFIG.maxSpeed);
    const vx = -dx / distance * speed;
    const vy = -dy / distance * speed;

    gsap.set(rocket, {
      x: dx,
      y: dy,
      rotation: Math.atan2(vy, vx) * 180 / Math.PI + 90,
      opacity: 1
    });
    isFlying = true;

    rocketTween = gsap.to(rocket, {
      inertia: {
        x: { velocity: vx, resistance: CONFIG.inertiaResistance },
        y: { velocity: vy, resistance: CONFIG.inertiaResistance }
      },
      onUpdate: onRocketUpdate,
      onComplete: () => {
        isFlying = false;
        gsap.to(rocket, { opacity: 0, ...CONFIG.rocketFadeOut });
      }
    });
  }

  Draggable.create(pull, {
    type: 'x,y',
    onPress() {
      gsap.killTweensOf(pull);
      this.update();
      containerRect = container.getBoundingClientRect();
      // The pull's resting center, relative to the container: where the aim line starts
      const r = pull.getBoundingClientRect();
      origin = {
        x: r.left + r.width  / 2 - containerRect.left - this.x,
        y: r.top  + r.height / 2 - containerRect.top  - this.y
      };
    },
    onDrag() {
      pull.classList.add('is--drag');
      // Aim line: from the resting point, pointing where the rocket will fly
      const distance = Math.hypot(this.x, this.y);
      gsap.set(line, {
        x: origin.x,
        y: origin.y,
        width: Math.min(distance * 3, 600),
        rotation: Math.atan2(-this.y, -this.x) * 180 / Math.PI,
        opacity: distance > 10 ? 1 : 0
      });
    },
    onRelease() {
      pull.classList.remove('is--drag');
      gsap.set(line, { opacity: 0 });
      const dx = this.x;
      const dy = this.y;
      const distance = Math.hypot(dx, dy);
      gsap.to(pull, { x: 0, y: 0, ...CONFIG.pullReset });
      if (distance > 10) launch(dx, dy, distance);
    }
  });

  window.addEventListener('resize', () => {
    containerRect = container.getBoundingClientRect();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.gsap && window.Draggable && window.InertiaPlugin && window.Physics2DPlugin) {
    init404Minigame();
  }
});
