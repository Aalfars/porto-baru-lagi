// ==========================================================================
// AHMAD ALFARISI PORTFOLIO — INTERACTIVE 3D MOUSE ENGINE & SCRIPTS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // 1. THEME SWITCHER (DARK MODE DEFAULT)
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      showToast(`Mode ${newTheme === 'dark' ? 'Gelap 🌙' : 'Terang ☀️'} diaktifkan`);
    });
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
  }

  // 2. INTERACTIVE MOUSE-TRACKING 3D TILT EFFECT FOR CARDS
  const tiltCards = document.querySelectorAll('.tilt-card-3d');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    });
  });

  // 3. INTERACTIVE 3D CANVAS PARTICLE BACKGROUND
  const canvas = document.getElementById('canvas3D');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const numParticles = 45;
    const particles = [];
    let mouseX = width / 2;
    let mouseY = height / 2;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5,
        radius: Math.random() * 2.5 + 1,
        color: ['#1DB954', '#00E5FF', '#FF007A', '#FFE600'][Math.floor(Math.random() * 4)],
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      });
    }

    function render3DCanvas() {
      ctx.clearRect(0, 0, width, height);

      const targetX = (mouseX - width / 2) * 0.05;
      const targetY = (mouseY - height / 2) * 0.05;

      particles.forEach(p => {
        p.x += p.vx + (targetX * p.z * 0.02);
        p.y += p.vy + (targetY * p.z * 0.02);

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.35 * p.z;
        ctx.fill();
      });

      requestAnimationFrame(render3DCanvas);
    }

    render3DCanvas();
  }

  // 4. MOBILE MENU TOGGLE
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // 5. SCROLL REVEAL & NAV ACTIVE OBSERVER
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 6. ANIMATED COUNTER FOR STATS
  const statValues = document.querySelectorAll('.stat-value');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '+';
        const duration = 1400;
        const start = performance.now();

        function updateCounter(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);

          el.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.5
  });

  statValues.forEach(el => counterObserver.observe(el));

  // 7. COPY EMAIL TO CLIPBOARD
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.dataset.email || 'aalfarss173@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email ${email} tersalin! 📋`);
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  });

  // 8. CONTACT FORM HANDLER
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      showToast(`Terima kasih ${name}! Pesan Anda berhasil dikirim. ⚡`);
      contactForm.reset();
    });
  }

  // 9. TOAST NOTIFICATION UTILITY
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.add('show');

      setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }
  }

});
