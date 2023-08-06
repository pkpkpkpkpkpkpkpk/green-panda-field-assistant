export default (isFreestyle:boolean) => {
  const element = document.createElement('div');
  element.classList.add('main');

  element.innerHTML = `
    <div class="recorder">
      <button data-toggle-recording class="btn">
        <span class="icon"></span>
      </button>
    </div>

    <div class="output">
      <input data-columns-input class="input" type="number"
        placeholder="enter number of columns" autofocus
      />

      <table data-output-table class="table is-docs">
        <tr><td>Speak</td><td>to</td><td>generate</td><td>a</td><td>table</td></tr>
        <tr><td>First</td><td>enter</td><td>number</td><td>of</td><td>columns</td></tr>
        <tr><td>Next</td><td>populate</td><td>headings</td><td>for</td><td>columns</td></tr>
        <tr><td><span class="icon is-record"></span></td><td>or</td><td>&#9166;</td><td>starts</td><td>recording</td></tr>
        <tr><td>&#9658;&#9658;</td><td>or</td><td>&#9166;</td><td>moves</td><td>next</td></tr>
      </table>

      <div data-loader class="loader is-hidden"></div>
    </div>
  `;

  if(isFreestyle) {
    element.innerHTML = `
      <div class="recorder">
        <button data-toggle-recording class="btn">
          <span class="icon"></span>
        </button>
      </div>
  
      <div class="output">
        <table data-output-table class="table is-docs">
          <tr><td>Speak</td><td>to</td><td>generate</td><td>a</td><td>table</td></tr>
          <tr><td><span class="icon is-record"></span></td><td>or</td><td>&#9166;</td><td>starts</td><td>recording</td></tr>
          <tr><td><span class="icon is-stop"></span></td><td>or</td><td>&#9166;</td><td>stops</td><td>recording</td></tr>
          <tr><td>Saying</td><td>"NEXT"</td><td>moves</td><td>1</td><td>column</td><td>right</td></tr>
          <tr><td>Saying</td><td>"LINE"</td><td>moves</td><td>1</td><td>row</td><td>down</td></tr>
        </table>
  
        <div data-loader class="loader is-hidden"></div>
      </div>
    `;
  };

  return element;
}
