/* ============================================================
   SCRIPT.JS — Mayur Nangre · Model & Actor Portfolio
   ============================================================
   TABLE OF CONTENTS
   01. Custom Cursor
   02. Scroll Progress Bar
   03. Navbar (scroll effect + mobile toggle + active link)
   04. Smooth Scroll
   05. Scroll Reveal (IntersectionObserver)
   06. Typing Animation (Hero tagline)
   07. Animated Number Counters (About stats)
   08. Portfolio Filter
   09. Lightbox (open / close / prev / next / keyboard)
   10. Contact Form (live validation + toast notification)
   11. Download CV Button
   12. Footer Year
   ============================================================ */

'use strict';

/* ============================================================
   HELPERS
   ============================================================ */

/**
 * Shorthand for document.getElementById
 * @param {string} id
 */
const $ = id => document.getElementById(id);

/**
 * Show a toast notification
 * @param {string} message  - text to display
 * @param {'success'|'error'} type
 */
function showToast(message, type = 'success') {
  const toast = $('toast');
  toast.textContent = message;
  toast.className   = `toast toast--${type} show`;

  // Auto-hide after 4 seconds
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}


/* ============================================================
   01 · CUSTOM CURSOR  (desktop only — hidden via CSS on mobile)
   ============================================================ */

const cursorDot      = $('cursor');
const cursorRing     = $('cursorFollower');

// Track real mouse position
let mouseX = 0;
let mouseY = 0;

// Follower lags behind (smooth lerp)
let ringX  = 0;
let ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Dot snaps instantly
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Animate the ring using requestAnimationFrame for smooth lag
function animateCursorRing() {
  // Lerp factor — smaller = more lag
  const lerpFactor = 0.10;
  ringX += (mouseX - ringX) * lerpFactor;
  ringY += (mouseY - ringY) * lerpFactor;

  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';

  requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

// Enlarge cursor when hovering interactive elements
const interactiveEls = document.querySelectorAll(
  'a, button, .filter-btn, .portfolio-zoom, .social-link, .contact-item, input, textarea'
);

interactiveEls.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('enlarged');
    cursorRing.classList.add('enlarged');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('enlarged');
    cursorRing.classList.remove('enlarged');
  });
});


/* ============================================================
   02 · SCROLL PROGRESS BAR
   ============================================================ */

const progressBar = $('scrollProgress');

window.addEventListener('scroll', () => {
  const scrolled    = window.scrollY;
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct         = totalHeight > 0 ? (scrolled / totalHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });


/* ============================================================
   03 · NAVBAR — scroll glass effect + mobile toggle + active link
   ============================================================ */

const navbar      = $('navbar');
const hamburger   = $('hamburger');
const navLinks    = $('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id]');

/* --- Glass effect on scroll --- */
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* --- Mobile hamburger toggle --- */
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);

  // Prevent body scroll while mobile menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* --- Close mobile menu when a link is clicked --- */
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* --- Highlight active nav link based on scroll position --- */
function setActiveNavLink() {
  const scrollMid = window.scrollY + window.innerHeight / 2;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);

    if (link && scrollMid >= top && scrollMid < bottom) {
      allNavLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveNavLink, { passive: true });


/* ============================================================
   04 · SMOOTH SCROLL  (polyfill for Safari < 15.4)
   ============================================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    // Offset by navbar height so section title isn't hidden
    const offset = navbar.offsetHeight + 8;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ============================================================
   05 · SCROLL REVEAL  (IntersectionObserver)
   ============================================================ */

const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once only
      }
    });
  },
  {
    threshold:  0.12,
    rootMargin: '0px 0px -40px 0px'
  }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ============================================================
   06 · TYPING ANIMATION  (hero tagline cycles through phrases)
   ============================================================ */

const typingEl  = $('typingText');
const phrases   = [
  'Model | Actor | Open for Work',
  'Fashion · Commercial · Film',
  'Based in India 🇮🇳',
  'Creating Stories Through Presence'
];

// Create a blinking caret element
const caret = document.createElement('span');
caret.className = 'caret';
typingEl.appendChild(caret);

let phraseIdx   = 0;
let charIdx     = 0;
let isDeleting  = false;

function runTyping() {
  const phrase   = phrases[phraseIdx];
  const displayed = phrase.substring(0, charIdx);

  // Update the text node (keep caret at the end)
  typingEl.childNodes[0]
    ? (typingEl.childNodes[0].textContent = displayed)
    : typingEl.insertBefore(document.createTextNode(displayed), caret);

  if (!isDeleting) {
    // Typing forward
    charIdx++;
    if (charIdx > phrase.length) {
      // Finished typing — pause then start deleting
      isDeleting = true;
      setTimeout(runTyping, 2200);
      return;
    }
    setTimeout(runTyping, 75);
  } else {
    // Deleting
    charIdx--;
    if (charIdx < 0) {
      // Finished deleting — move to next phrase
      isDeleting  = false;
      charIdx     = 0;
      phraseIdx   = (phraseIdx + 1) % phrases.length;
      setTimeout(runTyping, 450);
      return;
    }
    setTimeout(runTyping, 42);
  }
}

// Start after the hero CSS animations settle
setTimeout(runTyping, 1900);


/* ============================================================
   07 · ANIMATED NUMBER COUNTERS  (About section stats)
   ============================================================ */

const statEls = document.querySelectorAll('.stat-num');

/**
 * Animate a number from 0 to its data-target value
 * @param {HTMLElement} el
 */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1600; // ms
  const startTime = performance.now();

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic for natural deceleration
    const eased = 1 - Math.pow(1 - progress, 3);

    el.textContent = Math.round(eased * target);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);
}

// Only start counting when the stat enters the viewport
const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

statEls.forEach(el => counterObserver.observe(el));


/* ============================================================
   08 · PORTFOLIO FILTER
   ============================================================ */

const filterBtns      = document.querySelectorAll('.filter-btn');
const portfolioItems  = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button styling
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    portfolioItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;

      if (match) {
        item.classList.remove('hidden');
        // Re-trigger reveal animation so filtered items fade in
        item.classList.remove('visible');
        // Small delay so CSS transition fires after display is restored
        setTimeout(() => item.classList.add('visible'), 30);
      } else {
        item.classList.add('hidden');
      }
    });
  });
});


/* ============================================================
   09 · LIGHTBOX
   ============================================================ */

const lightbox        = $('lightbox');
const lightboxImg     = $('lightboxImg');
const lightboxCaption = $('lightboxCaption');
const lightboxClose   = $('lightboxClose');
const lightboxPrev    = $('lightboxPrev');
const lightboxNext    = $('lightboxNext');

let lightboxImages    = [];   // array of zoom buttons currently visible
let currentIdx        = 0;

/** Collect visible zoom buttons (respects active filter) */
function getVisibleZoomBtns() {
  return [...document.querySelectorAll(
    '.portfolio-item:not(.hidden) .portfolio-zoom'
  )];
}

/** Open lightbox at a given index */
function openLightbox(index) {
  lightboxImages = getVisibleZoomBtns();
  currentIdx     = index;

  const btn = lightboxImages[currentIdx];
  if (!btn) return;

  lightboxImg.src           = btn.dataset.src;
  lightboxCaption.textContent = btn.dataset.title;

  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

/** Close lightbox */
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';

  // Clear src after transition ends to avoid flash on re-open
  setTimeout(() => { lightboxImg.src = ''; }, 420);
}

/** Navigate to prev or next image */
function navigateLightbox(direction) {
  lightboxImages = getVisibleZoomBtns();
  currentIdx     = (currentIdx + direction + lightboxImages.length) % lightboxImages.length;

  const btn = lightboxImages[currentIdx];

  // Fade out → swap src → fade in
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src              = btn.dataset.src;
    lightboxCaption.textContent  = btn.dataset.title;
    lightboxImg.style.opacity    = '1';
  }, 220);
}

// Wire up zoom buttons
document.querySelectorAll('.portfolio-zoom').forEach((btn, _) => {
  btn.addEventListener('click', () => {
    const visibleBtns = getVisibleZoomBtns();
    const idx         = visibleBtns.indexOf(btn);
    openLightbox(idx >= 0 ? idx : 0);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click',  () => navigateLightbox(-1));
lightboxNext.addEventListener('click',  () => navigateLightbox(+1));

// Close when clicking the dark backdrop
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard controls
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;

  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   navigateLightbox(-1);
  if (e.key === 'ArrowRight')  navigateLightbox(+1);
});

// Smooth opacity transition for image swaps
lightboxImg.style.transition = 'opacity 0.22s ease';


/* ============================================================
   10 · CONTACT FORM — live validation + simulated send + toast
   ============================================================ */

const contactForm = $('contactForm');

/* ---------- Validators ---------- */

function validateName() {
  const input = $('name');
  const error = $('nameError');

  if (!input.value.trim()) {
    input.classList.add('invalid');
    error.textContent = 'Please enter your name.';
    return false;
  }

  input.classList.remove('invalid');
  error.textContent = '';
  return true;
}

function validateEmail() {
  const input   = $('email');
  const error   = $('emailError');
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!input.value.trim()) {
    input.classList.add('invalid');
    error.textContent = 'Email address is required.';
    return false;
  }

  if (!pattern.test(input.value.trim())) {
    input.classList.add('invalid');
    error.textContent = 'Please enter a valid email address.';
    return false;
  }

  input.classList.remove('invalid');
  error.textContent = '';
  return true;
}

function validateMessage() {
  const input = $('message');
  const error = $('messageError');

  if (!input.value.trim()) {
    input.classList.add('invalid');
    error.textContent = 'Please write a short message.';
    return false;
  }

  if (input.value.trim().length < 10) {
    input.classList.add('invalid');
    error.textContent = 'Message is too short (min 10 characters).';
    return false;
  }

  input.classList.remove('invalid');
  error.textContent = '';
  return true;
}

/* --- Live (on-blur) validation --- */
$('name').addEventListener('blur',    validateName);
$('email').addEventListener('blur',   validateEmail);
$('message').addEventListener('blur', validateMessage);

/* --- Clear error styling as user types --- */
$('name').addEventListener('input',    () => {
  $('name').classList.remove('invalid');
  $('nameError').textContent = '';
});
$('email').addEventListener('input',   () => {
  $('email').classList.remove('invalid');
  $('emailError').textContent = '';
});
$('message').addEventListener('input', () => {
  $('message').classList.remove('invalid');
  $('messageError').textContent = '';
});

/* --- Submit handler --- */
contactForm.addEventListener('submit', e => {
  e.preventDefault();

  // Run all validators
  const isValid = validateName() & validateEmail() & validateMessage();
  // (& not && so ALL validators run even if one fails)

  if (!isValid) {
    showToast('Please fix the highlighted fields.', 'error');
    return;
  }

  // Show loading state
  const submitBtn = contactForm.querySelector('.btn-submit');
  const label     = contactForm.querySelector('.btn-label');
  const spinner   = contactForm.querySelector('.btn-spinner');

  submitBtn.classList.add('loading');
  submitBtn.disabled  = true;
  label.textContent   = 'Sending…';
  spinner.style.display = 'block';

  /*
    ── REAL INTEGRATION ──────────────────────────────────────
    To actually send emails, replace the setTimeout below with
    a fetch() call to a backend endpoint, e.g.:

    fetch('https://your-api.com/send', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:    $('name').value,
        email:   $('email').value,
        subject: $('subject').value,
        message: $('message').value
      })
    })
    .then(res => res.json())
    .then(() => { ... success ... })
    .catch(() => { ... error ... });

    Free options: EmailJS, Formspree, Web3Forms
    ────────────────────────────────────────────────────────── */

  // Simulated 2-second network delay
  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.disabled    = false;
    label.textContent     = 'Send Message';
    spinner.style.display = 'none';

    contactForm.reset();
    showToast('✓ Message sent! Mayur will reply soon.', 'success');
  }, 2000);
});


/* ============================================================
   11 · DOWNLOAD CV BUTTON  (simulated)
   ============================================================ */

$('downloadBtn').addEventListener('click', e => {
  e.preventDefault();

  /*
    REAL USAGE: Link directly to your PDF file like this:
    <a href="files/mayur-nangre-cv.pdf" download class="btn-download">Download CV</a>

    Or trigger it via JS:
    const link = document.createElement('a');
    link.href = 'files/mayur-nangre-cv.pdf';
    link.download = 'Mayur-Nangre-CV.pdf';
    link.click();
  */

  showToast('📄 CV download will start shortly…', 'success');
});


/* ============================================================
   12 · FOOTER YEAR  (always up-to-date automatically)
   ============================================================ */

$('year').textContent = new Date().getFullYear();


// ====================================== New JavaScript ========================================= 

