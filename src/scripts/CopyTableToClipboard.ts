export const copyTableToClipboard = () => {
  const outputCopy = document.querySelector('[data-output-copy]');
  const outputTable = document.querySelector('[data-output-table]');
  
  outputCopy?.addEventListener('click', e => {
    e.preventDefault();
    const range = document.createRange();
    const select = window.getSelection();
    range.selectNode(outputTable);
    select.addRange(range);
    document.execCommand('copy');
  });
};
