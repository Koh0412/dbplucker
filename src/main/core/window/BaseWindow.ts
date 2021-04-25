import { BrowserWindow } from "electron";
import { createHtmlPath } from "../../utils/Functions";

export class BaseWindow {
  private windowInstance: BrowserWindow | null = null;

  constructor(options: Electron.BrowserWindowConstructorOptions) {
    this.windowInstance = new BrowserWindow(options);

    this.windowInstance.on('ready-to-show', () => this.windowInstance?.show());
    this.windowInstance.on('closed', () => {
      this.windowInstance = null;
    });
  }

  /**
   * ブラウザウィンドウのインスタンスを取得
   */
  get window() {
    return this.windowInstance;
  }

  /**
   * 使用するhtml名をセット
   * @param name
   */
  setUsingHtmlName(name: string) {
    this.windowInstance?.loadURL(createHtmlPath(name));
  }
}
