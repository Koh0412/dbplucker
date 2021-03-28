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
    ipcMain.on(ipcKeys.REGIST_FAV, this.registFavorite.bind(this));

    this.window?.on('ready-to-show', () => {
      const favList = store.getAsArray<IDatabaseSetting>(storeKeys.FAV_LIST);
      this.window?.webContents.send(ipcKeys.SEND_FAV, favList);
    });

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
  async registFavorite(e: Electron.IpcMainEvent, favorite: IFavorite) {
    const favList = store.getAsArray<IFavorite>(storeKeys.FAV_LIST);

    if (favList) {
      const isDeplicated = favList.some((item) => JSON.stringify(item) === JSON.stringify(favorite));

      if (!isDeplicated) {
        favList.push(favorite);
        store.set(storeKeys.FAV_LIST, favList);
      }
    } else {
      store.set(storeKeys.FAV_LIST, [favorite]);
    }

    this.window?.webContents.send(ipcKeys.SEND_FAV, store.getAsArray<IFavorite>(storeKeys.FAV_LIST));
  }
}
