import { ipcKeys } from "../../../common/ipcKeys";
import { storeKeys } from "../../../common/storeKeys";
import { WINDOW_OPTIONS } from "../../constants/windowOption";
import { MySQL } from "../../lib/MySQL";
import { store } from "../../lib/Store";
import { BaseWindow } from "./BaseWindow";
import { SettingWindow } from "./SettingWindow";

export class MainWindow extends BaseWindow {
  private settings: BaseWindow | null = null;

  constructor() {
    super(WINDOW_OPTIONS.main);
    this.setUsingHtmlName('index');

    this.window?.on('ready-to-show', this.readyToShow.bind(this));
    this.window?.on('closed', this.closed.bind(this));
  }

  /**
   * ウィンドウ作成
   */
  static create(): BaseWindow {
    return new MainWindow();
  }

  /**
   * ウィンドウの準備完了時に処理
   */
  readyToShow() {
    const connectInfo = store.get(storeKeys.CONNECT_INFO) as IDatabaseSetting;

    if (connectInfo) {
      const mysql = new MySQL(connectInfo);

      mysql.connection.then(async () => {
        const info = await mysql.collectInfo(connectInfo);
        this.window?.webContents.send(ipcKeys.DBINFO, info);
      });
    } else {
      this.settings = SettingWindow.create();
      this.settings.window?.setParentWindow(this.window);
    }
  }

  /**
   * ウィンドウがclosed時に処理
   */
  closed() {
    store.delete(storeKeys.CONNECT_INFO);

    if (this.settings) {
      this.settings.window?.close();
    }
  }
}
