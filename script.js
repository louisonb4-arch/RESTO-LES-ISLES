// Resto Les Isles — interactions légères

const reduits = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Révélations au scroll ----------
// (on observe les éléments eux-mêmes, pas de clip-path)
function lancerReveals() {
  // ce qui est déjà à l'écran apparaît tout de suite (synchrone, fiable)
  const hauteurEcran = window.innerHeight;
  const restants = [];
  document.querySelectorAll('.reveal:not(.est-visible)').forEach((el) => {
    if (el.getBoundingClientRect().top < hauteurEcran * 0.95) {
      el.classList.add('est-visible');
    } else {
      restants.push(el);
    }
  });

  if (!reduits && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('est-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('est-visible'));
  }
}

// ---------- Ouverture : l'ardoise qu'on lève ----------
const ouverture = document.getElementById('ouverture');
let ouvertureFinie = false;

function finirOuverture() {
  if (ouvertureFinie) return;
  ouvertureFinie = true;
  if (ouverture) ouverture.classList.add('est-finie');
  document.body.classList.remove('a-ouverture');
  lancerReveals();
}

// le hero entre en cascade décalée pendant que l'ardoise se lève
function cascadeHero() {
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    el.style.transitionDelay = (0.2 + i * 0.13) + 's';
    el.classList.add('est-visible');
    el.addEventListener('transitionend', () => {
      el.style.transitionDelay = '';
    }, { once: true });
  });
}

if (ouverture) {
  if (reduits) {
    finirOuverture();
  } else {
    document.body.classList.add('a-ouverture');
    ouverture.classList.add('est-lancee');

    setTimeout(() => {
      ouverture.classList.add('est-levee');
      cascadeHero();
      ouverture.addEventListener('animationend', (e) => {
        if (e.animationName === 'ardoise-levee') finirOuverture();
      });
      // filet de sécurité si animationend ne remonte pas
      setTimeout(finirOuverture, 1400);
    }, 2000);
  }
} else {
  lancerReveals();
}

// ---------- Menu mobile ----------
const burger = document.getElementById('burger');
const menu = document.getElementById('mobilemenu');

if (burger && menu) {
  const fermerMenu = () => {
    menu.hidden = true;
    burger.classList.remove('est-ouvert');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    if (!menu.hidden) {
      fermerMenu();
    } else {
      menu.hidden = false;
      burger.classList.add('est-ouvert');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  });

  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', fermerMenu));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) fermerMenu();
  });
}
