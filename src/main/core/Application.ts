import { app, BrowserWindow, ipcMain } from 'electron';
import { WINDOW_OPTIONS } from '../constants/windowOption';
import { ipcKeys } from '../../common/ipcKeys';
import { SystemUtil } from '../utils/SystemUtil';

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

  static start(): Application {
    return new Application();
  }

  createWindow(): BrowserWindow {
    this.mainWindow = new BrowserWindow(WINDOW_OPTIONS.main);

    this.mainWindow.loadURL(SystemUtil.createHtmlPath('index'));
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    return this.mainWindow;
  }
}
