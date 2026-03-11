/* ═══════════════════════════════════════════════════
   LODESTONE — Arcane Particle System & Interactions
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Particle System ───
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = -(Math.random() * 0.3 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.fadeSpeed = Math.random() * 0.005 + 0.002;
      this.growing = Math.random() > 0.5;

      // Color variation: blue, cyan, violet
      const colors = [
        [74, 153, 255],
        [107, 232, 248],
        [166, 106, 255],
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.growing) {
        this.opacity += this.fadeSpeed;
        if (this.opacity >= 0.5) this.growing = false;
      } else {
        this.opacity -= this.fadeSpeed;
        if (this.opacity <= 0) this.reset();
      }

      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
        this.y = canvas.height + 10;
      }
    }

    draw() {
      const [r, g, b] = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
      ctx.fill();

      // Glow effect
      if (this.opacity > 0.2) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.15})`;
        ctx.fill();
      }
    }
  }

  function initParticles() {
    const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 15000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animFrame = requestAnimationFrame(animateParticles);
  }

  // ─── Tile Interactions ───
  function initTileEffects() {
    document.querySelectorAll('.app-tile').forEach(tile => {
      // Ripple position tracking
      tile.addEventListener('pointerdown', (e) => {
        const rect = tile.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        tile.style.setProperty('--ripple-x', x + '%');
        tile.style.setProperty('--ripple-y', y + '%');
      });

      // Subtle tilt on hover (desktop)
      tile.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        const rect = tile.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        tile.style.transform = `perspective(400px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.05)`;
      });

      tile.addEventListener('pointerleave', () => {
        tile.style.transform = '';
      });
    });
  }

  // ─── Init ───
  function init() {
    resize();
    initParticles();
    animateParticles();
    initTileEffects();
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
