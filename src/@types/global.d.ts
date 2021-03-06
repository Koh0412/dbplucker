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
    version: string;
  }

  interface ISchemata {
    name: string;
    collation: string;
  }

  interface IDatabaseProps {
    id: string;
    name: string;
  }

  interface IShowTableProps {
    id: string;
    tableNames: string[] | undefined;
    database: string;
  }

  let ipcRenderer = window.ipcRenderer;
}
