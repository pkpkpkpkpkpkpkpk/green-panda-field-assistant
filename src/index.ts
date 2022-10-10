import './styles/style.scss';
import Almonds from './assets/images/almonds.jpg';

function component() {
  const element = document.createElement('div');
  element.innerHTML = 'test';
  element.classList.add('test');

  const image = new Image();
  image.src = Almonds;
  element.appendChild(image);

  return element;
}

document.body.appendChild(component());