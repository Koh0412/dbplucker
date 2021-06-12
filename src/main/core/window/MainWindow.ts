import { ipcKeys } from "@common/ipcKeys";
import { storeKeys } from "@common/storeKeys";
import { WINDOW_OPTIONS } from "../../constants/windowOption";
import { mysql } from "../../lib/MySQL";
import { store } from "../../lib/Store";
import { useDocument, envHandler, ipcMainRecieve } from "../../utils";
import { BaseWindow } from "./BaseWindow";
import { SettingWindow } from "./SettingWindow";

@useDocument('index')
export class MainWindow extends BaseWindow {
  private settings: BaseWindow | null = null;

  constructor() {
    super(WINDOW_OPTIONS.main);

    this.window?.on('ready-to-show', this.readyToShow.bind(this));
    this.window?.on('closed', this.closed.bind(this));
    this.window?.on('page-title-updated', () => {
      this.window?.webContents.send(ipcKeys.TITLE, this.window?.webContents.getTitle());
    });
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
    envHandler({
      development: () => {
        this.window?.webContents.openDevTools();
        this.window?.maximize();
      }
    });

    const connectInfo = store.get(storeKeys.CONNECT_INFO) as IDatabaseSetting;

    if (connectInfo) {
      mysql.createConnection(connectInfo);

      mysql.connection?.then(async () => {
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

  /**
   * テーブル名の表示
   * @param e
   * @param database
   */
  @ipcMainRecieve(ipcKeys.SEND_DB)
  async showTables(e: Electron.IpcMainEvent, database: IDatabaseProps) {
    const tableNames = await mysql.getTableNames(database);
    const props: IShowTableProps = {
      id: database.id,
      tableNames,
      database: database.name,
    };

    this.window?.webContents.send(ipcKeys.SHOW_TABLES, props);
  }

  /**
   * レコードの表示
   * @param e
   * @param props
   */
  @ipcMainRecieve(ipcKeys.SEND_TABLE)
  async showTableRecords(e: Electron.IpcMainEvent, props: { table: string; database: string; }) {
    const records = await mysql.getTableRecords(props);
    this.window?.webContents.send(ipcKeys.SHOW_RECORDS, records);
  }
}
