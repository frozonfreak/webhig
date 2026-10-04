(function () {
  const REPO = 'https://github.com/frozonfreak/webhig';
  const BADGE = 'https://frozonfreak.github.io/webhig/badge.svg';
  const sourceSelect = document.getElementById('share-source');
  const customWrap = document.getElementById('share-custom-wrap');
  const customInput = document.getElementById('share-custom');
  const snippet = document.getElementById('share-snippet');
  const copyBtn = document.getElementById('share-copy');
  const status = document.getElementById('share-status');
  const previewLink = document.getElementById('share-preview-link');
  const formatRadios = document.querySelectorAll('input[name="share-format"]');
  if (!sourceSelect || !snippet || !copyBtn) return;

  let resetTimer = 0;

  function slug(value) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40) || 'custom';
  }

  function currentSource() {
    return sourceSelect.value === 'custom' ? slug(customInput.value) : sourceSelect.value;
  }

  function currentFormat() {
    return document.querySelector('input[name="share-format"]:checked')?.value || 'markdown';
  }

  function repoUrl() {
    const params = new URLSearchParams({
      utm_source: currentSource(),
      utm_medium: 'badge',
      utm_campaign: 'share',
    });
    return REPO + '?' + params.toString();
  }

  function markdownSnippet() {
    return '[![The Web HIG](' + BADGE + ')](' + repoUrl() + ')';
  }

  function htmlSnippet() {
    return (
      '<a href="' +
      repoUrl() +
      '">\n  <img src="' +
      BADGE +
      '" width="204" height="20" alt="The Web HIG — open behavioral standard">\n</a>'
    );
  }

  function copyLabel() {
    return currentFormat() === 'html' ? 'Copy HTML' : 'Copy markdown';
  }

  function setStatus(message, tone) {
    status.textContent = message;
    if (tone) {
      status.dataset.tone = tone;
    } else {
      delete status.dataset.tone;
    }
  }

  function updateSnippet() {
    const isCustom = sourceSelect.value === 'custom';
    customWrap.hidden = !isCustom;
    snippet.value = currentFormat() === 'html' ? htmlSnippet() : markdownSnippet();
    previewLink.href = repoUrl();
    copyBtn.textContent = copyLabel();
  }

  async function copySnippet() {
    const text = snippet.value;
    const isHtml = currentFormat() === 'html';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        snippet.focus();
        snippet.select();
        if (!document.execCommand('copy')) throw new Error('copy failed');
      }
      setStatus(isHtml ? 'Copied HTML to the clipboard.' : 'Copied markdown to the clipboard.', 'success');
      copyBtn.textContent = 'Copied';
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(function () {
        copyBtn.textContent = copyLabel();
      }, 2500);
    } catch {
      snippet.focus();
      snippet.select();
      setStatus('Copy failed. The snippet is selected — press Ctrl+C or Command+C.', 'error');
      copyBtn.textContent = copyLabel();
    }
  }

  sourceSelect.addEventListener('change', function () {
    updateSnippet();
    if (sourceSelect.value === 'custom') customInput.focus();
  });
  customInput.addEventListener('input', updateSnippet);
  formatRadios.forEach(function (radio) {
    radio.addEventListener('change', updateSnippet);
  });
  copyBtn.addEventListener('click', copySnippet);
  updateSnippet();
})();
