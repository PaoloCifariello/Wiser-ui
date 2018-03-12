import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import 'semantic-ui-css/semantic.min.css'
// Load Roboto and Lato fonts
import 'typeface-roboto'
import 'typeface-lato'

ReactDOM.render(
    <App/>, document.getElementById('root'));
registerServiceWorker();
