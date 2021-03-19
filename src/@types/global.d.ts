import { IpcRenderer } from 'electron';

declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
  }

  interface ISettingFormState {
    host: string;
    username: string;
    password: string;
    database: string;
    port: number;
  }

  let ipcRenderer = window.ipcRenderer;
}
