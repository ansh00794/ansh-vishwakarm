/* ==========================================================================
   FRAMER-STYLE ANIMATIONS & INTERACTION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Lenis Smooth Scroll Engine
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 2. Register GSAP Plugins & Connect with Lenis
  gsap.registerPlugin(ScrollTrigger);

  lenis.on('scroll', () => {
    ScrollTrigger.update();
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 3. Top Scroll Progress Indicator
  const scrollProgress = document.getElementById('scroll-progress');
  lenis.on('scroll', ({ scroll, limit }) => {
    const progress = (scroll / limit) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }
  });

  // ==========================================================================
  // 4. FRAMER-STYLE SCROLL REVEAL ANIMATIONS (SCALE + FADE UP)
  // ==========================================================================
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
  
  scrollRevealElements.forEach((el) => {
    gsap.fromTo(el, 
      {
        y: 40,
        opacity: 0,
        scale: 0.96
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // ==========================================================================
  // 5. HERO IMAGE PARALLAX & CARD SCALING
  // ==========================================================================
  const heroImg = document.getElementById('hero-img');
  if (heroImg) {
    gsap.to(heroImg, {
      y: 40,
      scale: 1.08,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Floating Badges Gentle Parallax Shift
  gsap.to('.badge-top-right', {
    y: -20,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  gsap.to('.badge-bottom-left', {
    y: 20,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  // ==========================================================================
  // 6. STATS COUNTER ANIMATION
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach((stat) => {
    const target = parseFloat(stat.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(stat, {
          innerText: target,
          duration: 2.0,
          ease: 'power2.out',
          snap: { innerText: isDecimal ? 0.1 : 1 },
          onUpdate: function () {
            if (isDecimal) {
              stat.innerText = parseFloat(stat.innerText).toFixed(1);
            }
          }
        });
      }
    });
  });

  // 7. Smooth Navigation Anchor Clicking
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        lenis.scrollTo(targetEl, {
          offset: -80,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    });
  });

});
