const form = document.querySelector('[data-fixture-form]');
const field = document.getElementById('reference-code');
const error = document.getElementById('reference-code-error');
const conforming = document.getElementById('conform-button');
const negative = document.getElementById('negative-button');

function reveal(button) {
  button.classList.add('is-invalid');
  error.hidden = false;
  field.setAttribute('aria-invalid', 'true');
  field.focus();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  reveal(conforming);
});

negative.addEventListener('click', () => {
  reveal(negative);
});
