import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './global.css';

const xMdContainer = document.querySelector('x-md');
const rawMarkdown = xMdContainer ? xMdContainer.textContent.trim() : '';

document.body.className = 'min-h-screen font-sans antialiased tracking-tight';
document.body.innerHTML = '<div id="root"></div>';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App rawMarkdown={rawMarkdown} />
  </React.StrictMode>
);