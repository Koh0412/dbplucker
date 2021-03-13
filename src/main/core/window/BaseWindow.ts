import { BrowserWindow } from "electron";
import { SystemUtil } from "../../utils/SystemUtil";

export class BaseWindow {
  protected window: BrowserWindow | null = null;

  constructor(options: Electron.BrowserWindowConstructorOptions) {
    this.window = new BrowserWindow(options);

    this.window.on('ready-to-show', () => this.window?.show());
    this.window.on('closed', () => {
      this.window = null;
    });
  }

  loadHtmlName(name: string) {
    this.window?.loadURL(SystemUtil.createHtmlPath(name));
  }

  dispose() {
    this.window?.close();
  }
}
