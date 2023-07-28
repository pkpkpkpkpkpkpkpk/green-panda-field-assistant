export const formatTextToTable = (text:string) => {
  const outputTable:HTMLTableElement = document.querySelector('[data-output-table]');
  
  while (outputTable.firstChild) outputTable.removeChild(outputTable.firstChild);

  //for testing
  // text = 'a next b next c line d next e next f';

  text = text.toLowerCase();
  text = text.replaceAll('.', '');
  text = text.replaceAll(',', '');
  // console.log(text)

  const textArray:string[]|string = text.split('next');
  // console.log(textArray);

  let textMap = textArray.map((val:string[]|string) => {
    if(val.includes('line')) val = val.split('line');
    return val;
  });
  // console.log(textMap);

  let line = 0;
  let textMatrix:string[][] = [];
  textMap.forEach(val => {
    if(!textMatrix[line]) textMatrix[line] = [];
  
    if(Array.isArray(val)) {
      const first = val[0].trim();
      textMatrix[line].push(first);
      line++
      textMatrix[line] = [];
      const second = val[1].trim();
      textMatrix[line].push(second);
      return;
    }
  
    const valStripped = val.trim(); 
    textMatrix[line].push(valStripped);
  });
  // console.log(textMatrix);

  textMatrix.forEach(row => {
    const rowEl = document.createElement('tr');

    row.forEach(cell => {
      const cellEl = document.createElement('td');
      cellEl.setAttribute('contenteditable', '');
      cellEl.innerHTML = cell;
      rowEl.appendChild(cellEl);
    });

    outputTable.appendChild(rowEl);
  });
};
