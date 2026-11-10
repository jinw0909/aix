const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const desktopBreakpoint = window.matchMedia('(min-width: 1024px)');
let previousFocus;

function setMenu(open, restoreFocus = false) {
  mobileMenu.hidden = !open;
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  document.querySelector('main').inert = open;
  document.querySelector('footer').inert = open;
  if (open) {
    previousFocus = document.activeElement;
    mobileMenu.querySelector('a').focus();
  } else if (restoreFocus) {
    previousFocus?.focus();
  }
}

menuButton.addEventListener('click', () => setMenu(mobileMenu.hidden, !mobileMenu.hidden));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  setMenu(false);
  const target = document.querySelector(link.hash);
  if (target) {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}));
document.addEventListener('keydown', event => {
  if (mobileMenu.hidden) return;
  if (event.key === 'Escape') setMenu(false, true);
  if (event.key !== 'Tab') return;
  const focusable = [menuButton, ...mobileMenu.querySelectorAll('a')];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
desktopBreakpoint.addEventListener('change', event => {
  if (event.matches) setMenu(false);
});
document.querySelector('.map-link').addEventListener('click', () => {
  const map = document.querySelector('#coex-map');
  map.focus({ preventScroll: true });
  document.querySelector('#venue-map').scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.desktop-nav a').forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-15% 0px -65% 0px' });
document.querySelectorAll('#about, #speaker, #tickets, #faq').forEach(section => sectionObserver.observe(section));
