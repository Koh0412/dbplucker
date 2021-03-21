import { ipcMain } from "electron";
import { ipcKeys } from "../../../common/ipcKeys";
import { WINDOW_OPTIONS } from "../../constants/windowOption";
import { MySQL } from "../../lib/MySQL";
import { BaseWindow } from "./BaseWindow";

export class SettingWindow extends BaseWindow {
  constructor() {
    super(WINDOW_OPTIONS.settings);
    this.setUsingHtmlName('settings');

    ipcMain.on(ipcKeys.CONNECT, this.connectDatabase.bind(this));

    this.window?.setMenu(null);
  }

  /**
   * インスタンスを作成
   * @returns BaseWindow
   */
  static create(): BaseWindow {
    return new SettingWindow();
  }

  /**
   * データベースへの接続
   * @param e
   * @param setting
   */
  async connectDatabase(e: Electron.IpcMainEvent, setting: IDatabaseSetting) {
    const mysql = new MySQL(setting);

    mysql.connection.then(async () => {
      const parent = this.window?.getParentWindow();
      this.window?.close();

      if (parent) {
        parent.show();

        const info = await mysql.collectInfo(setting);
        parent.webContents.send('dbinfo', info);
      }
    });

  }
}
