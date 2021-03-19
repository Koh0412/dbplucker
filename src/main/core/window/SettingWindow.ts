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
   * @param form
   */
  connectDatabase(e: Electron.IpcMainEvent, form: ISettingFormState) {
    const mysql = new MySQL(form);

    mysql.connection.then(() => {
      const parent = this.window?.getParentWindow();

      this.window?.close();
      parent?.show();
    });
  }
}
