export default () => {
  const element = document.createElement('div');
  element.classList.add('main');
  element.innerHTML = `
    <div class="recorder">
      <button data-toggle-recording class="btn">
        <span class="icon"></span>
      </button>
    </div>

    <div class="output">
      <table data-output-table class="table is-docs">
        <tr><td>Speak to generate a table</td></tr>
        <tr><td><span class="icon is-record"></span> starts recording</td></tr>
        <tr><td><span class="icon is-stop"></span> stops recording</td></tr>
        <tr><td>Saying "NEXT" moves 1 column to the right</td></tr>
        <tr><td>Saying "LINE" moves 1 row down</td></tr>
      </table>

      <div data-loader class="loader"></div>
    </div>
  `;
  return element;
}
