// @ts-nocheck
import './styles/style.scss';
import './RecordAudio';
import './CopyTableToClipboard';

function component() {
  const element = document.createElement('div');
  element.classList.add('main');

  element.innerHTML = `
    <div class="recorder">
      <button data-start-recording class="btn is-start">&#9679;</button>
      <button data-stop-recording disabled class="btn is-stop is-disabled">&#9632;</button>
    </div>

    <div class="output">
      <table data-output-table class="table">
        <tr><td>Speak to generate a table</td></tr>
        <tr><td><span style="color:red;font-size:24px">&#9679;</span> starts recording</td></tr>
        <tr><td><span style="font-size:24px">&#9632;</span> stops recording</td></tr>
        <tr><td>Saying "NEXT" moves 1 column to the right</td></tr>
        <tr><td>Saying "LINE" moves 1 row down</td></tr>
      </table>

      <div data-output-copy class="copy"></div>
    </div>
  `;

  return element;
}

document.body.appendChild(component());