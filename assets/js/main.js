const body = document.body;
const themeToggle = document.querySelector('#theme-toggle');
const menuToggle = document.querySelector('#menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const mobileClose = document.querySelector('#mobile-close');
const siteHeader = document.querySelector('.site-header');
const darkSections = document.querySelectorAll('.dark-band, .contact-section, footer, .team-panel');

function updateHeaderContrast() {
  if (body.classList.contains('dark')) {
    siteHeader.classList.remove('over-dark');
    return;
  }

  const header = siteHeader.getBoundingClientRect();
  const headerMiddle = header.top + header.height / 2;
  const elementsBehindHeader = document.elementsFromPoint(window.innerWidth / 2, headerMiddle);
  const isOverDark = elementsBehindHeader.some((element) =>
    [...darkSections].some((section) => section === element || section.contains(element))
  );

  siteHeader.classList.toggle('over-dark', isOverDark);
  siteHeader.dataset.surface = isOverDark ? 'dark' : 'light';
}

function setTheme(theme) {
  const isDark = theme === 'dark';
  body.classList.toggle('dark', isDark);
  document.documentElement.classList.toggle('dark-theme', isDark);
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.firstElementChild.textContent = theme === 'dark' ? '☀' : '◐';
  localStorage.setItem('fourloop-theme', theme);
  updateHeaderContrast();
}

setTheme(localStorage.getItem('fourloop-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeToggle.addEventListener('click', () => setTheme(body.classList.contains('dark') ? 'light' : 'dark'));

let scrollFrame;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    updateHeaderContrast();
    scrollFrame = null;
  });
}, { passive: true });
window.addEventListener('resize', updateHeaderContrast);

function setMobileMenu(open) {
  mobileNav.classList.toggle('open', open);
  body.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menuToggle.firstElementChild.textContent = open ? '×' : '☰';
}

menuToggle.addEventListener('click', () => setMobileMenu(!mobileNav.classList.contains('open')));
mobileClose.addEventListener('click', () => setMobileMenu(false));
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMobileMenu(false)));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMobileMenu(false);
});

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.case').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.type !== filter;
    });
  });
});

document.querySelector('#contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#form-message').textContent = 'Thanks — your inquiry is ready to be shared with the FourLoop team.';
  event.currentTarget.reset();
});
