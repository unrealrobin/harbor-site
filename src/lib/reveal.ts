// Directional scroll entrances (brand doc motion rule), shared by all pages.
// Elements tagged data-rv slide in from their anchored side (--rv inline var);
// data-rv-group parents stagger their children. One-shot; under
// prefers-reduced-motion the CSS never hides anything so no observer runs.
// The <noscript> un-hide lives in Base.astro.
export function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('[data-rv-group]').forEach((group) => {
    group.querySelectorAll<HTMLElement>('[data-rv]').forEach((el, i) => {
      el.style.transitionDelay = `${i * 90}ms`;
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('[data-rv]').forEach((el) => io.observe(el));
}
