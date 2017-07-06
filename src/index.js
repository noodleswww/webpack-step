import _ from 'lodash';
import React from 'react';
import ReactDOM, { render } from 'react-dom';
import './style.css';
import Icon from './licai-ac.png';
import Data from './test.xml';
import add from './test';
import Footer from './components/Footer';

function component() {
  var element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  // Lodash, now imported by this script
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  // 将图像添加到我们现有的 div。
  var myIcon = new Image();
  myIcon.src = Icon;

  var p = document.createElement('p');
  p.innerHTML = Data;

  // console.log(ReactDOM, React);
  console.log(add(22, 22));

  element.appendChild(p)
  element.appendChild(myIcon);


  return element;
}

ReactDOM.render(<Footer />, document.getElementById('app'));
document.body.appendChild(component());

// HMR interface
if(module.hot) {
  // Capture hot update
  module.hot.accept('./test', () => {
    console.log('Accepting the updated library module!');
    console.log(add(33, 33));;
  });
  // module.hot.accept('./components/Footer', () => { render(Footer) });
  module.hot.accept('./components/Footer', () => {
    const NextRootContainer = require('./components/Footer').default;
    render(<NextRootContainer />, document.getElementById('app'));
  });
}