import path from 'path';

import { app, BrowserWindow, ipcMain } from 'electron';
import { DEFAULT_WINDOW_OPTIONS, ROOT_INDEX_URL } from '../constants/const';
import { ipcKeys } from '../../common/ipcKeys';

export class Application {
  private mainWindow: BrowserWindow | null;

  constructor() {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
    this.mainWindow = null;

    ipcMain.on(ipcKeys.TEST, (e) => {
      e.sender.send(ipcKeys.REPLY, 'pong');
    });

    app.on('ready', () => this.createWindow());
    app.on('window-all-closed', () => app.quit());
    app.on('activate', () => {
      this.mainWindow ?? this.createWindow();
    });
  }

  private get windowOption() {
    const options: Electron.BrowserWindowConstructorOptions = {
      ...DEFAULT_WINDOW_OPTIONS,
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: false,
        preload: path.join(__dirname, '../preload.js')
      },
    }

    return options;
  }

  static start(): Application {
    return new Application();
  }

  createWindow(): BrowserWindow {
    this.mainWindow = new BrowserWindow(this.windowOption);

    this.mainWindow.loadURL(ROOT_INDEX_URL);
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    return this.mainWindow;
  }
}
