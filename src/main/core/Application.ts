import { app } from 'electron';
import { MainWindow } from './window/MainWindow';

export class Application {
  constructor() {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = String(true);

    app.on('ready', () => MainWindow.create());
    app.on('window-all-closed', () => app.quit());
    app.on('activate', () => MainWindow.create());
  }

  static start(): Application {
    return new Application();
  }
}
