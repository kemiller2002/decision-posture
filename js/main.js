(function () {
  const root = document.documentElement;

  const themeBtn = document.querySelector('[data-action="toggle-theme"]');
  const fontBtn = document.querySelector('[data-action="toggle-font"]');
  const menuBtn = document.querySelector('[data-action="toggle-menu"]');
  const nav = document.querySelector('.nav');

  function setTheme(theme) {
    if (!theme) return;
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('dp_theme', theme); } catch (e) {}
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      themeBtn.querySelector('span').textContent = theme === 'light' ? 'Dark' : 'Light';
    }
  }

  function toggleTheme() {
    const cur = root.getAttribute('data-theme') || 'dark';
    setTheme(cur === 'dark' ? 'light' : 'dark');
  }

  function setLargeFont(on) {
    if (on) root.setAttribute('data-font', 'large');
    else root.removeAttribute('data-font');
    try { localStorage.setItem('dp_font', on ? 'large' : 'normal'); } catch (e) {}
    if (fontBtn) {
      fontBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      fontBtn.querySelector('span').textContent = on ? 'Normal text' : 'Large text';
    }
  }

  function toggleFont() {
    const on = root.getAttribute('data-font') === 'large';
    setLargeFont(!on);
  }

  function setMenuOpen(open) {
    if (!nav || !menuBtn) return;
    if (open) nav.classList.add('open');
    else nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function toggleMenu() {
    if (!nav) return;
    setMenuOpen(!nav.classList.contains('open'));
  }

  // Init theme
  let storedTheme = null;
  try { storedTheme = localStorage.getItem('dp_theme'); } catch (e) {}
  if (storedTheme) {
    setTheme(storedTheme);
  } else {
    // default dark
    setTheme('dark');
  }

  // Init font size
  let storedFont = null;
  try { storedFont = localStorage.getItem('dp_font'); } catch (e) {}
  setLargeFont(storedFont === 'large');

  // Wire controls
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  if (fontBtn) fontBtn.addEventListener('click', toggleFont);
  if (menuBtn) menuBtn.addEventListener('click', toggleMenu);

  // Close menu when navigating
  if (nav) {
    nav.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.tagName === 'A') setMenuOpen(false);
    });
  }

  // Escape closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenuOpen(false);
  });
})();
