import React from 'react';
import ReactDOM from 'react-dom/client';
import 'whatwg-fetch';

import App from './components/App';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './style.css'; //import css file!

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
