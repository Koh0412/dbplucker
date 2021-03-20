import { IpcRenderer } from 'electron';

declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
  }

  interface IDatabaseSetting {
    [key: string]: string | number;
    host: string;
    username: string;
    password: string;
    database: string;
    port: number;
  }

  interface IDatabaseInfoCollection {
    databases: string[];
  }

  let ipcRenderer = window.ipcRenderer;
}
