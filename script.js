// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Alert Me form
const alertForm = document.getElementById('alertForm');
const alertThanks = document.getElementById('alertThanks');

if (alertForm) {
  alertForm.addEventListener('submit', () => {
    // Let the native submission proceed to the hidden iframe (posts to
    // Google Forms without navigating away from the page), and swap
    // the UI to the thank-you message right away.
    alertForm.style.display = 'none';
    alertThanks.style.display = 'block';
  });
}

// FAQ category buttons — filter which questions are shown
const faqCats = document.querySelectorAll('.faq-cat');
const faqItems = document.querySelectorAll('.faq-item');

function showFaqCategory(cat) {
  faqCats.forEach(btn => btn.classList.toggle('active', btn.dataset.cat === cat));
  faqItems.forEach(item => {
    const match = item.dataset.cat === cat;
    item.hidden = !match;
    if (match) item.open = true;
  });
}

faqCats.forEach(btn => {
  btn.addEventListener('click', () => showFaqCategory(btn.dataset.cat));
});

if (faqCats.length) {
  const initialCat = document.querySelector('.faq-cat.active')?.dataset.cat || faqCats[0].dataset.cat;
  showFaqCategory(initialCat);
}

// Nav scroll-spy — bold whichever section's link matches the section
// currently in view, instead of relying on hardcoded "active" classes
// (which previously left two links bolded at once on multi-section pages).
const sectionLinkMap = new Map();
document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
  const id = link.getAttribute('href').slice(1);
  const section = document.getElementById(id);
  if (!section) return;
  if (!sectionLinkMap.has(section)) sectionLinkMap.set(section, []);
  sectionLinkMap.get(section).push(link);
});

function setActiveNavLinks(activeLinks) {
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  activeLinks.forEach(a => a.classList.add('active'));
}

if (sectionLinkMap.size) {
  const navSpyObserver = new IntersectionObserver((entries) => {
    let current = null;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!current || entry.boundingClientRect.top < current.boundingClientRect.top) {
          current = entry;
        }
      }
    });
    if (current) {
      const links = sectionLinkMap.get(current.target);
      if (links) setActiveNavLinks(links);
    }
  }, { rootMargin: '-96px 0px -70% 0px', threshold: 0 });

  sectionLinkMap.forEach((links, section) => navSpyObserver.observe(section));

  // Respond immediately on click rather than waiting for the scroll to settle.
  sectionLinkMap.forEach((links) => {
    links.forEach(link => {
      link.addEventListener('click', () => setActiveNavLinks(links));
    });
  });
}

// Gold coin cursor — replaces the mouse pointer and leaves a fading
// trail of small coins. Only on real mice (not touch), and skipped
// for prefers-reduced-motion.
const wantsCoinCursor =
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (wantsCoinCursor) {
  document.documentElement.classList.add('coin-cursor-active');

  const customCursor = document.createElement('img');
  customCursor.src = './assets/gold-coin.png';
  customCursor.alt = '';
  customCursor.id = 'customCursor';
  document.body.appendChild(customCursor);

  let lastTrailTime = 0;
  const trailInterval = 45; // ms between trailing coins

  document.addEventListener('mousemove', (e) => {
    customCursor.style.opacity = '1';
    customCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;

    const now = performance.now();
    if (now - lastTrailTime > trailInterval) {
      lastTrailTime = now;
      const trail = document.createElement('img');
      trail.src = './assets/gold-coin.png';
      trail.alt = '';
      trail.className = 'cursor-trail';
      trail.style.left = `${e.clientX}px`;
      trail.style.top = `${e.clientY}px`;
      trail.addEventListener('animationend', () => trail.remove());
      document.body.appendChild(trail);
    }
  });

  document.addEventListener('mouseleave', () => {
    customCursor.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    customCursor.style.opacity = '1';
  });
}

// Nav logo easter egg — click it, coins pop out and slide back in
const navBadge = document.getElementById('navBadge');
const coinBurst = document.getElementById('coinBurst');

if (navBadge && coinBurst) {
  navBadge.addEventListener('click', () => {
    const count = 5 + Math.floor(Math.random() * 4); // 5-8
    for (let i = 0; i < count; i++) {
      const coin = document.createElement('img');
      coin.src = './assets/gold-coin.png';
      coin.alt = '';
      coin.className = 'coin-pop';
      // Fully random angle/distance (rather than evenly spaced) so some
      // coins land close together and overlap.
      const angle = Math.random() * Math.PI * 2;
      const dist = 24 + Math.random() * 34;
      coin.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      coin.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
      coin.style.animationDelay = `${i * 30}ms`;
      coin.addEventListener('animationend', () => coin.remove());
      coinBurst.appendChild(coin);
    }
  });
}

// Decorative coins/objects — click to squish, plus a random auto-squish
function squish(el) {
  el.classList.remove('squish');
  void el.offsetWidth; // force reflow so the animation restarts on repeat triggers
  el.classList.add('squish');
}

const decorEls = document.querySelectorAll('.coin-decor, .object-decor');
decorEls.forEach(el => {
  el.addEventListener('click', () => squish(el));
  el.addEventListener('animationend', () => el.classList.remove('squish'));
});

if (decorEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  function isOnScreen(el) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false; // hidden (narrow viewport)
    return rect.bottom > 0 && rect.top < window.innerHeight &&
           rect.right > 0 && rect.left < window.innerWidth;
  }

  setInterval(() => {
    const visible = Array.from(decorEls).filter(isOnScreen);
    if (!visible.length) return;
    squish(visible[Math.floor(Math.random() * visible.length)]);
  }, 10000);
}

// Home banner — clicking it scrolls to the next segment
const homeBanner = document.getElementById('homeBanner');
if (homeBanner) {
  homeBanner.addEventListener('click', () => {
    const next = homeBanner.closest('section').nextElementSibling;
    const target = next && next.classList.contains('wave') ? next.nextElementSibling : next;
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}
