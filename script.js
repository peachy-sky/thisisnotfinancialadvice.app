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

// Home banner — clicking it scrolls to the next segment
const homeBanner = document.getElementById('homeBanner');
if (homeBanner) {
  homeBanner.addEventListener('click', () => {
    const next = homeBanner.closest('section').nextElementSibling;
    const target = next && next.classList.contains('wave') ? next.nextElementSibling : next;
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}
