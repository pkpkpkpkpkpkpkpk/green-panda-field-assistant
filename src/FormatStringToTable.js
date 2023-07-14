export const formatStringToTable = string => {
  const outputTable = document.querySelector('[data-output-table]');

  //for testing
  string = 'a next b next c line d next e next f';

  string = string.toLowerCase();
  string = string.replaceAll('.', '');
  string = string.replaceAll(',', '');
  // console.log(string)

  const textArray = string.split('next');
  // console.log(textArray);

  let textMap = textArray.map(val => {
    if(val.includes('line')) val = val.split('line');
    return val;
  });
  // console.log(textMap);

  let line = 0;
  let textMatrix = [];
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
      cellEl.innerHTML = cell;
      rowEl.appendChild(cellEl);
    });

    outputTable.appendChild(rowEl);
  });
};
