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

  interface IFavorite {
    name: string;
    setting: IDatabaseSetting;
  }

  interface IDatabaseInfoCollection {
    schemataList: ISchemata[];
  }

  interface ISchemata {
    name: string;
    collation: string;
  }

  let ipcRenderer = window.ipcRenderer;
}
