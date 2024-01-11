import * as constants from './../tools/Constants';
import * as helpers from './../tools/Helpers';

let outputMain:HTMLDivElement;
let outputTable:HTMLTableElement;

export const addColumn = (e:MouseEvent|KeyboardEvent) => {
  e.preventDefault();
  outputTable = document.querySelector('[data-output-table]');
  const rows = outputTable.querySelectorAll('tr');
  const columnCount = rows.length && rows[0].querySelectorAll('th, td').length;
  
  rows.forEach((row, index) => {
    if(!helpers.isMode(constants.MODE_FREESTYLE) && index === 0) {
      const newHeaderCell = document.createElement('th');
      newHeaderCell.setAttribute('contenteditable', '');
      newHeaderCell.setAttribute('data-index', `${helpers.getAlphabetDepthFromIndex(columnCount)}0`);
      row.appendChild(newHeaderCell);
      newHeaderCell.focus();
      return;
    }
    
    const newCell = document.createElement('td');
    newCell.setAttribute('contenteditable', '');
    const cellIndex = `${helpers.getAlphabetDepthFromIndex(columnCount)}${index}`;
    newCell.setAttribute('data-index', `${helpers.getAlphabetDepthFromIndex(columnCount)}${cellIndex}`);
    row.appendChild(newCell);
  });

  removeDocs();
}

export const downloadCSV = (e:MouseEvent) => {
  e.preventDefault();
  outputTable = document.querySelector('[data-output-table]');
  const csv = Array.from(outputTable.querySelectorAll('tr')).map(row => Array.from(row.querySelectorAll('th, td')).map(cell => cell.textContent).join(',')).join('\n');
  const csvBlob = new Blob([csv], { type: 'text/plain' });
  const downloadEl = document.createElement('a');
  downloadEl.href = window.URL.createObjectURL(csvBlob);
  const date = new Date;
  downloadEl.download = `field-assistant-output_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.csv`;
  downloadEl.click();
}

export const focusOnFirstCell = () => {
  outputMain = document.querySelector('[data-output-main]');
  outputMain.querySelector('th')?.focus();
}

export const getHeaderCells = () => {
  outputTable = document.querySelector('[data-output-table]');
  if(!outputTable) return;
  
  const columns = Array.from(outputTable.querySelectorAll('th'));
  if(columns[0].hasAttribute('data-time')) columns.shift();
  return columns;
}

export const getPrompts = () => {
  const columns = getHeaderCells();
  const prompts = columns.map(c => c.innerHTML);
  return prompts;
}

export const removeDocs = () => {
  outputTable = document.querySelector('[data-output-table]');
  outputTable.querySelectorAll('[data-docs]').forEach(docs => docs.remove());
  outputTable.classList.remove('is-docs');
}

export const formatTextToTable = (text:string, prompts?:string[], time?:number, startTime?:number) => {
  outputTable = document.querySelector('[data-output-table]');
  const rowCount = outputTable.querySelectorAll('tr').length;
  
  //for testing
  //default
  // text = 'a next column b next column c next column d next column e next column f';
  // text = 'a next colon b next colon c next colon d next colon e next colon f';
  //specific (prefill 6 columns with 1 2 3 4 5 6)
  // text = ' 3 c 1 a 6 f 5 e 2 b 4 d ';
  //freestyle
  // text = 'a next b next c line d next e next f';

  //sanitise text
  text = text.toLowerCase();
  text = text.replaceAll('.', '');
  text = text.replaceAll(',', '');
  // console.log('text', text);

  //transform string to array matrix
  let textArray:string[];
  let textMatrix:string[][] = [[]];
  switch (document.body.getAttribute(constants.ATTR_MODE)) {
    case constants.MODE_FREESTYLE:
      textArray = text.split('line');
      textMatrix = textArray.map(array => array.split('next'));
      break;
    case constants.MODE_SPECIFIC:
      let textSeparated = ` ${text} `;
      let promptsSeparated = ` ${text} `;
      let promptsOrdered:string[];

      //create array of prompt responses
      prompts.forEach(prompt => {
        if(!text.includes(` ${prompt} `)) return;
        textSeparated = textSeparated.replace(` ${prompt} `, '||');
      });
      textArray = textSeparated.split('||');
      textArray = textArray.map(t => t.trim());
      textArray.shift(); //since first in array will be empty

      //create array of prompts
      textArray.forEach(t => {
        if(!text.includes(` ${t} `)) return;
        promptsSeparated = promptsSeparated.replace(` ${t} `, '||');
      });
      promptsOrdered = promptsSeparated.split('||');
      promptsOrdered.pop(); //since last in array will be empty
      
      //match prompt responses to prompts
      prompts.forEach((prompt, index) => {
        promptsOrdered.forEach((orderedPrompt, orderedIndex) => {
          if(!orderedPrompt.includes(prompt.trim())) return;
          textMatrix[0][index] = textArray[orderedIndex];
        });
      });

      //fill any array indexes that are empty
      for(let i = 0; i < prompts.length; i++) {
        if(!textMatrix[0].hasOwnProperty(i)) textMatrix[0][i] = '';
      }
      break;
    default:
      if(text.includes('next column')) textArray = text.split('next column');
      else textArray = text.split('next colon');
      textMatrix = [textArray];
  }

  //trim whitespace
  textMatrix = textMatrix.map(textArray => textArray.map(text => text && text.trim()));
  
  //if text is blank
  if(textMatrix.length === 1 && textMatrix[0].length === 1 && textMatrix[0][0] === '') textMatrix[0][0] = '[blank_audio]';
  // console.log('textMatrix', textMatrix);

  //add start time
  if(!helpers.isMode(constants.MODE_FREESTYLE)) {
    if(time === startTime) {
      const headerRowEl = outputTable.querySelector('tr');
      const headerTimeCell = document.createElement('th');
      headerTimeCell.setAttribute('data-time', '');
      headerTimeCell.innerHTML = 'time (s)';
      headerRowEl.insertBefore(headerTimeCell, headerRowEl.firstChild);
    }
  }
  
  //transform matrix to html table elements
  textMatrix.forEach((row, rIndex) => {
    const rowEl = document.createElement('tr');

    //add time elapsed
    if(!helpers.isMode(constants.MODE_FREESTYLE)) {
      const timeCellEl = document.createElement('td');
      const timeElapsedSeconds = Math.floor((time - startTime) / 1000);
      timeCellEl.innerHTML = timeElapsedSeconds.toString();
      rowEl.appendChild(timeCellEl);
    }

    row.forEach((cell, cIndex) => {
      const cellEl = document.createElement('td');
      let cellIndex = `${helpers.getAlphabetDepthFromIndex(cIndex)}${rowCount}`;
      if(helpers.isMode(constants.MODE_FREESTYLE)) cellIndex = `${helpers.getAlphabetDepthFromIndex(cIndex)}${rIndex + 1}`;
      cellEl.setAttribute('contenteditable', '');
      cellEl.setAttribute('data-index', cellIndex);
      cellEl.innerHTML = cell;
      rowEl.appendChild(cellEl);
    });

    outputTable.appendChild(rowEl);
  });
}
