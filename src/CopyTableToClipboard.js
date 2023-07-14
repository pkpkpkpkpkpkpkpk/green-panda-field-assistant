document.addEventListener('DOMContentLoaded', () => {
  const outputCopy = document.querySelector('[data-output-copy]');
  const outputTable = document.querySelector('[data-output-table]');

  outputCopy?.addEventListener('click', e => {
    e.preventDefault();
    const range = document.createRange();
    range.selectNode(outputTable);
    window.getSelection().addRange(range);
    document.execCommand('copy');
  });
});
