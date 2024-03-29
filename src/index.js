import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './node_modules/bootstrap/dist/css/bootstrap.min.css';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
