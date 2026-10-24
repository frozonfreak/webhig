// Enhancement never owns primary text, navigation or actions.
const illustration = document.getElementById('notebook');
const replay = document.getElementById('replay');
const enhancement = document.getElementById('enhancement');
if (illustration && replay && enhancement) {
  replay.addEventListener('click', () => {
    illustration.classList.remove('is-replaying');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Restart only this optional, bounded spatial demonstration.
      void illustration.offsetWidth;
      illustration.classList.add('is-replaying');
    }
  });
  illustration.addEventListener('animationend', () => {
    illustration.classList.remove('is-replaying');
  });
  enhancement.hidden = false;
}
