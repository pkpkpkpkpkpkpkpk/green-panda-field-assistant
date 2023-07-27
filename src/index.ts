import './styles/style.scss';
import './RecordAudio';
// import './CopyTableToClipboard';

function component() {
  const element = document.createElement('div');
  element.classList.add('main');

  element.innerHTML = `
    <div class="recorder">
      <button data-start-recording class="btn is-start"><div class="icon is-record"></div></button>
      <button data-stop-recording disabled class="btn is-stop is-disabled"><div class="icon is-stop"></div></button>
    </div>

    <div class="output">
      <table data-output-table class="table is-docs">
        <tr><td>Speak to generate a table</td></tr>
        <tr><td><div class="icon is-record"></div> starts recording</td></tr>
        <tr><td><div class="icon is-stop"></div> stops recording</td></tr>
        <tr><td>Saying "NEXT" moves 1 column to the right</td></tr>
        <tr><td>Saying "LINE" moves 1 row down</td></tr>
      </table>
    </div>
  `;

  return element;
}

document.body.appendChild(component());