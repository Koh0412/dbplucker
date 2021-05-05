import { ipcMain } from "electron";
import { ipcKeys } from "../../../common/ipcKeys";
import { storeKeys } from "../../../common/storeKeys";
import { WINDOW_OPTIONS } from "../../constants/windowOption";
import { MySQL } from "../../lib/MySQL";
import { store } from "../../lib/Store";
import { queryBuilder } from "../../utils/QueryBuilder";
import { BaseWindow } from "./BaseWindow";
import { SettingWindow } from "./SettingWindow";

export class MainWindow extends BaseWindow {
  private settings: BaseWindow | null = null;
  private mysql: MySQL | null = null;

  constructor() {
    super(WINDOW_OPTIONS.main);
    this.setUsingHtmlName('index');

    ipcMain.on(ipcKeys.SEND_DB, this.showTables.bind(this));

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
      this.mysql = new MySQL(connectInfo);

      this.mysql.connection.then(async () => {
        const info = await this.mysql?.collectInfo(connectInfo);
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

  /**
   * テーブル名の表示
   * @param e
   * @param database
   */
  async showTables(e: Electron.IpcMainEvent, database: IDatabaseProps) {
    const selectQuery = queryBuilder.select({
      table: 'information_schema.TABLES',
      columns: {
        TABLE_NAME: 'tableName'
      }
    });

    const query = selectQuery.where({ TABLE_SCHEMA: database.name }).build();

    const data = await this.mysql?.execute(query);
    const tableNames = data?.map((row) => {
      return row.tableName as string;
    });

    this.window?.webContents.send(ipcKeys.SHOW_TABLES, { id: database.id, tableNames });
  }
}
