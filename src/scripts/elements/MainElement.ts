export default () => {
  const main = document.createElement('div');
  main.classList.add('main');

  main.innerHTML = `
    <div class="recorder">
      <button data-settings-toggle class="is-settings-toggle supplementary-btn btn"><span class="icon is-gear"></span></button>

      <button data-toggle-recording class="toggle-recording btn">
        <span class="icon"></span>
      </button>

      <button data-dark-theme-toggle class="is-dark-theme-toggle supplementary-btn btn"><span class="icon is-crescent-moon"></button>
    </div>

    <div class="output">
      <div class="output-start">
        <button data-download disabled class="is-download supplementary-btn btn is-disabled"><span class="icon is-download"></span></button>
      </div>

      <div data-output-main class="output-main">
        <table data-output-table class="table is-docs">
          <thead>
            <tr><th contenteditable data-index="a0" autofocus></th></tr>
          </thead>
          
          <tbody data-docs="default">
            <tr><td>speak</td><td>to</td><td>generate</td><td>a</td><td>table</td></tr>
            <tr><td>first</td><td>populate</td><td>headings</td><td>for</td><td>columns</td></tr>
            <tr><td><span class="icon is-plus"></span></td><td>or</td><td>&#11157;</td><td>creates</td><td>column</td></tr>
            <tr><td><span class="icon is-record"></span></td><td>or</td><td>&#9166;</td><td>starts</td><td>recording</td></tr>
            <tr><td>&#9658;&#9658;</td><td>or</td><td>&#9166;</td><td>moves</td><td>next</td></tr>
          </tbody>

          <tbody data-docs="specific">
            <tr><td>speak</td><td>to</td><td>generate</td><td>a</td><td>table</td></tr>
            <tr><td>first</td><td>populate</td><td>headings</td><td>for</td><td>columns</td></tr>
            <tr><td><span class="icon is-plus"></span></td><td>or</td><td>&#11157;</td><td>creates</td><td>column</td></tr>
            <tr><td><span class="icon is-record"></span></td><td>or</td><td>&#9166;</td><td>starts</td><td>recording</td></tr>
            <tr><td>say</td><td>specified</td><td>column</td><td>heading</td><td>followed</td></tr>
            <tr><td>by</td><td>content</td><td>in</td><td>any</td><td>order</td></tr>
          </tbody>

          <tbody data-docs="freestyle">
            <tr><td>speak</td><td>to</td><td>generate</td><td>a</td><td>table</td></tr>
            <tr><td><span class="icon is-record"></span></td><td>or</td><td>&#9166;</td><td>starts</td><td>recording</td></tr>
            <tr><td><span class="icon is-stop"></span></td><td>or</td><td>&#9166;</td><td>stops</td><td>recording</td></tr>
            <tr><td>say</td><td>"NEXT"</td><td>to</td><td>move</td><td>right</td></tr>
            <tr><td>say</td><td>"LINE"</td><td>to</td><td>move</td><td>down</td></tr>
          </tbody>
        </table>

        <div data-loader class="loader is-hidden"></div>
      </div>

      <div class="output-end">
        <button data-add-column class="is-add-column supplementary-btn btn"><span class="icon is-plus"></span></button>
      </div>
    </div>

    <div class="settings">
      <button data-settings-toggle class="is-settings-toggle settings-btn btn"><span class="icon is-cross"></span></button>
    
      <div class="settings-main">
        <button data-mode-changer data-mode="default" class="is-default-mode settings-btn btn">DEFAULT MODE</button>
        <button data-mode-changer data-mode="specific" class="is-specific-mode settings-btn btn">SPECIFIC MODE</button>
        <button data-mode-changer data-mode="freestyle" class="is-freestyle-mode settings-btn btn">FREESTYLE MODE</button>
      </div>
      
      <button data-settings-toggle class="is-settings-toggle settings-btn btn"><span class="icon is-cross"></span></button>
    </div>
  `;

  return main;
}
