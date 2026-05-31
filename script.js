/* =============================================
   GerardTheBanana — script.js
   Planet orbit + stars + hover effects
   ============================================= */

(function () {
  'use strict';

  /* ---- STARS ---- */
  function initStars() {
    const container = document.getElementById('stars');
    if (!container) return;
    const COUNT = 120;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < COUNT; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const size = Math.random() * 2 + 0.5;
      const minOp = (Math.random() * 0.15 + 0.05).toFixed(2);
      const maxOp = (Math.random() * 0.45 + 0.2).toFixed(2);
      const dur = (Math.random() * 4 + 2).toFixed(1);
      const delay = -(Math.random() * 6).toFixed(2);

      Object.assign(s.style, {
        width:  size + 'px',
        height: size + 'px',
        top:    (Math.random() * 100).toFixed(2) + '%',
        left:   (Math.random() * 100).toFixed(2) + '%',
        '--min-op': minOp,
        '--max-op': maxOp,
        '--dur': dur + 's',
        '--delay': delay + 's',
      });
      frag.appendChild(s);
    }
    container.appendChild(frag);
  }

  /* ---- PLANET ORBIT ---- */
  function initOrbit() {
    const scene      = document.getElementById('orbitScene');
    const logo       = document.getElementById('logo');
    const planetBack = document.getElementById('planetBack');
    const planetFront= document.getElementById('planetFront');

    if (!scene || !logo || !planetBack || !planetFront) return;

    // Config
    const PLANET_SIZE  = 22;   // px diameter
    const ORBIT_SCALE  = 0.58; // orbit radius relative to half logo width
    const TILT_Y       = 0.32; // vertical squish for 3D feel (ellipse minor/major ratio)
    const BASE_PERIOD  = 7000; // ms full orbit
    const FAST_PERIOD  = 2200; // ms on hover

    let period  = BASE_PERIOD;
    let targetPeriod = BASE_PERIOD;
    let startTime = null;
    let currentAngle = 0;   // radians
    let rafId;

    // Style both halves
    [planetBack, planetFront].forEach(el => {
      Object.assign(el.style, {
        width:  PLANET_SIZE + 'px',
        height: PLANET_SIZE + 'px',
        position: 'absolute',
        borderRadius: '50%',
        pointerEvents: 'none',
      });
    });

    // Planet visual — glowing sphere
    const gradient = 'radial-gradient(circle at 35% 35%, #c97bff 0%, #8329D6 45%, #4a0d8a 80%, #1a002f 100%)';
    [planetBack, planetFront].forEach(el => {
      el.style.background = gradient;
      el.style.boxShadow  = '0 0 12px 4px rgba(131,41,214,0.55), inset -3px -3px 6px rgba(0,0,0,0.4)';
    });

    // Get orbit center (logo center, relative to scene)
    function getOrbitParams() {
      const logoRect  = logo.getBoundingClientRect();
      const sceneRect = scene.getBoundingClientRect();

      const cx = logoRect.left - sceneRect.left + logoRect.width  / 2;
      const cy = logoRect.top  - sceneRect.top  + logoRect.height / 2;

      // Orbit radii — adapt to logo size
      const rx = logoRect.width  / 2 + PLANET_SIZE * ORBIT_SCALE + 8;
      const ry = rx * TILT_Y;

      return { cx, cy, rx, ry };
    }

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;

      // Smooth period transition
      period += (targetPeriod - period) * 0.04;

      // Advance angle
      const dt = (timestamp - startTime);
      currentAngle = ((dt % period) / period) * Math.PI * 2;
      startTime = timestamp - (currentAngle / (Math.PI * 2)) * period;

      const { cx, cy, rx, ry } = getOrbitParams();
      const x = cx + rx * Math.cos(currentAngle);
      const y = cy + ry * Math.sin(currentAngle);

      const half = PLANET_SIZE / 2;
      const posLeft = (x - half) + 'px';
      const posTop  = (y - half) + 'px';

      // The planet crosses behind the logo when sin > 0 (bottom arc in 3D perspective)
      // We split into two halves:
      //   back:  visible when in front of text (sin < 0, upper arc) — z below text
      //   front: visible when behind text (sin > 0, lower arc) — z above text
      // But actually for "behind text" effect: when planet is on the far side (sin < 0 in
      // our coordinate, meaning top of ellipse = behind), we show planetBack (z<text).
      // When on near side (sin > 0 = bottom of ellipse = in front), we show planetFront (z>text).

      const sinA = Math.sin(currentAngle);
      const inFront = sinA > 0;  // bottom arc = in front of logo

      if (inFront) {
        // Planet in front of logo
        planetFront.style.left    = posLeft;
        planetFront.style.top     = posTop;
        planetFront.style.zIndex  = '10';
        planetFront.style.opacity = '1';

        planetBack.style.opacity  = '0';
        planetBack.style.left     = posLeft;
        planetBack.style.top      = posTop;
        planetBack.style.zIndex   = '1';
      } else {
        // Planet behind logo
        planetBack.style.left    = posLeft;
        planetBack.style.top     = posTop;
        planetBack.style.zIndex  = '1';
        planetBack.style.opacity = '1';

        planetFront.style.opacity = '0';
        planetFront.style.left    = posLeft;
        planetFront.style.top     = posTop;
        planetFront.style.zIndex  = '1';
      }

      // Scale planet slightly by depth (y position on ellipse) for extra 3D
      const depthScale = 0.75 + 0.35 * ((sinA + 1) / 2);
      const activeEl = inFront ? planetFront : planetBack;
      activeEl.style.transform = `scale(${depthScale.toFixed(3)})`;

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    // Hover to speed up
    scene.addEventListener('mouseenter', () => { targetPeriod = FAST_PERIOD; });
    scene.addEventListener('mouseleave', () => { targetPeriod = BASE_PERIOD; });

    // Touch speed boost
    scene.addEventListener('touchstart', () => {
      targetPeriod = FAST_PERIOD;
      setTimeout(() => { targetPeriod = BASE_PERIOD; }, 1200);
    }, { passive: true });

    // Recalculate on resize (no restart needed, getOrbitParams is called each frame)
    // but we debounce to avoid jank
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {}, 200);
    });
  }

  /* ---- CARD ENTRANCE ANIMATION ---- */
  function initCardAnimations() {
    const cards = document.querySelectorAll('.card');
    if (!cards.length) return;

    // Use IntersectionObserver for staggered reveal
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach((card, i) => {
      card.style.opacity  = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = `opacity 0.55s ease ${i * 0.07}s, transform 0.55s cubic-bezier(.22,.68,0,1.2) ${i * 0.07}s`;

      // Trigger after a short delay to allow initial paint
      setTimeout(() => {
        card.style.opacity  = '1';
        card.style.transform = 'translateY(0)';
      }, 900 + i * 70);
    });
  }

  /* ---- INIT ---- */
  function init() {
    initStars();
    initOrbit();
    initCardAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
