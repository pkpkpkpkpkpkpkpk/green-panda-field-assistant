import * as constants from './../tools/Constants';
import * as helpers from './../tools/Helpers';

export default (text:string, prompts?:string[], time?:number, startTime?:number) => {
  const outputTable:HTMLTableElement = document.querySelector('[data-output-table]');
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