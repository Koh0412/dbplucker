import { ipcMain } from "electron";
import { ipcKeys } from "../../../common/ipcKeys";
import { storeKeys } from "../../../common/storeKeys";
import { WINDOW_OPTIONS } from "../../constants/windowOption";
import { MySQL } from "../../lib/MySQL";
import { store } from "../../lib/Store";
import { BaseWindow } from "./BaseWindow";

export class SettingWindow extends BaseWindow {
  constructor() {
    super(WINDOW_OPTIONS.settings);
    this.setUsingHtmlName('settings');

    ipcMain.on(ipcKeys.CONNECT, this.connectDatabase.bind(this));
    ipcMain.on(ipcKeys.FAVORITE, this.registFavorite.bind(this));

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
        parent.webContents.send(ipcKeys.DBINFO, info);
      }
    });
  }

  /**
   * お気に入りをストアに追加
   * @param e
   * @param setting
   */
  async registFavorite(e: Electron.IpcMainEvent, setting: IDatabaseSetting) {
    const favList = store.getAsArray<IDatabaseSetting>(storeKeys.FAV_LIST);

    if (favList) {
      const isDeplicated = favList.some((fav) => JSON.stringify(fav) === JSON.stringify(setting));

      if (!isDeplicated) {
        favList.push(setting);
        store.set(storeKeys.FAV_LIST, favList);
      }
    } else {
      store.set(storeKeys.FAV_LIST, [setting]);
    }
  }
}
