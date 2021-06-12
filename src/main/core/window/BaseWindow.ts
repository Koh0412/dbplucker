import { ipcKeys } from "@common/ipcKeys";
import { BrowserWindow, ipcMain } from "electron";
import { createHtmlPath } from "../../utils";

export class BaseWindow {
  private windowInstance: BrowserWindow | null = null;

  constructor(options: Electron.BrowserWindowConstructorOptions) {
    this.windowInstance = new BrowserWindow(options);

    this.windowInstance.on('ready-to-show', () => this.windowInstance?.show());
    this.windowInstance.on('closed', () => {
      this.windowInstance = null;
    });

    ipcMain.on(ipcKeys.WIN_CLOSE, () => this.windowInstance?.close());
    ipcMain.on(ipcKeys.WIN_MAX, () => this.windowInstance?.maximize());
    ipcMain.on(ipcKeys.WIN_MIN, () => this.windowInstance?.minimize());
    ipcMain.on(ipcKeys.WIN_RESTORE, () => this.windowInstance?.restore());
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
