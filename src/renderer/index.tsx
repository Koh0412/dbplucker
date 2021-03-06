import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app')
);

setTimeout(() => {
  ipcRenderer.send('test', 'ping');
}, 3000);

ipcRenderer.on('reply', (e, args) => {
  console.log(e, args);
});
