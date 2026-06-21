(() => {
  const reveals = document.querySelectorAll('.reveal');
  const cards = document.querySelectorAll('.link-card');
  const brand = document.getElementById('brandTitle');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach((el) => revealObserver.observe(el));

  function fitBrand() {
    if (!brand) return;
    const parent = brand.parentElement;
    const maxWidth = Math.min(window.innerWidth * 0.98, parent.clientWidth);
    let size = 128;
    brand.style.fontSize = `${size}px`;

    while (brand.scrollWidth > maxWidth && size > 24) {
      size -= 1;
      brand.style.fontSize = `${size}px`;
    }
  }

  let fitRAF = 0;
  const scheduleFit = () => {
    if (fitRAF) cancelAnimationFrame(fitRAF);
    fitRAF = requestAnimationFrame(() => {
      fitBrand();
      fitRAF = 0;
    });
  };

  window.addEventListener('resize', scheduleFit, { passive: true });
  window.addEventListener('orientationchange', scheduleFit, { passive: true });
  window.addEventListener('load', fitBrand, { once: true });
  fitBrand();

  const supportsHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsHover) {
    cards.forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', `${mx}%`);
        card.style.setProperty('--my', `${my}%`);

        const dx = (mx - 50) / 50;
        const dy = (my - 50) / 50;
        card.style.transform = `translate3d(${dx * 5}px, ${dy * 5}px, 0) scale(1.01)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
        card.style.transform = '';
      });
    });
  }
})();
  const secretButton = document.getElementById('secretButton');
  const nikitaJokes = document.getElementById('nikitaJokes');

  if (secretButton && nikitaJokes) {
    let clickCount = 0;

    secretButton.addEventListener('click', () => {
      clickCount++;

      if (clickCount >= 7) {
        nikitaJokes.classList.add('visible');
      }
    });
  }
