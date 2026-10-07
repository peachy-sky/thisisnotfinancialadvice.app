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
  alertForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alertForm.style.display = 'none';
    alertThanks.style.display = 'block';
  });
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
