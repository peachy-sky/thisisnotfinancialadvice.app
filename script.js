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
