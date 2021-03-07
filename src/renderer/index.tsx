import React from 'react';
import ReactDOM from 'react-dom';
import { ipcKeys } from '../common/ipcKeys';
import App from './components/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app')
);

setTimeout(() => {
  ipcRenderer.send(ipcKeys.TEST, 'ping');
}, 3000);

ipcRenderer.on(ipcKeys.REPLY, (e, args) => {
  console.log(e, args);
});
