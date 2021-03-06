import path from 'path';

export const DEFAULT_WINDOW_OPTIONS: Electron.BrowserWindowConstructorOptions = {
  width: 800,
  height: 600,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: false,
    preload: path.join(__dirname, '../preload.js')
  }
};

export const WINDOW_OPTIONS: {[key: string]: Electron.BrowserWindowConstructorOptions} = {
  main: {
    ...DEFAULT_WINDOW_OPTIONS,
    title: 'dbplucker',
    backgroundColor: '#262d34',
    titleBarStyle: 'hidden',
    frame: false,
  },
  settings: {
    ...DEFAULT_WINDOW_OPTIONS,
    width: 650,
    height: 500,
    backgroundColor: '#fff',
    modal: true
  }
};
