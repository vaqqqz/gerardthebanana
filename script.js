(() => {
  const reveals = document.querySelectorAll('.reveal');
  const cards = document.querySelectorAll('.link-card');
  const hero = document.querySelector('.hero');
  const scene = document.getElementById('orbitScene');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${Math.min(index * 90, 300)}ms`;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16
  });

  reveals.forEach((el) => revealObserver.observe(el));

  const applyParallax = (card, clientX, clientY) => {
    const rect = card.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((clientY - rect.top) / rect.height - 0.5) * 2;
    card.style.setProperty('--mx', `${((clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--my', `${((clientY - rect.top) / rect.height) * 100}%`);
    card.style.transform = `translate3d(${x * 6}px, ${y * 6}px, 0) translateY(${card.matches(':hover') ? -6 : 0}px) scale(${card.matches(':hover') ? 1.012 : 1})`;
  };

  cards.forEach((card) => {
    card.addEventListener('pointermove', (e) => applyParallax(card, e.clientX, e.clientY));
    card.addEventListener('pointerenter', (e) => applyParallax(card, e.clientX, e.clientY));
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
      card.style.transform = '';
    });
  });

  if (hero && scene) {
    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      scene.style.transform = `
        rotateX(${8 - currentY * 5}deg)
        rotateY(${-8 + currentX * 6}deg)
        translateY(${currentY * 8}px)
      `;

      if (Math.abs(targetX - currentX) < 0.01 && Math.abs(targetY - currentY) < 0.01) {
        raf = 0;
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  }
})();
