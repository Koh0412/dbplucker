import mysql from 'promise-mysql';
import * as Bluebird from 'bluebird';
import { dialog } from 'electron';

export class MySQL {
  private _connection: Bluebird<mysql.Connection>;

  constructor(
    private setting: IDatabaseSetting
  ) {
    this._connection = mysql.createConnection({
      host: this.setting.host,
      user: this.setting.username,
      password: this.setting.password,
      database: this.setting.database,
      port: this.setting.port,
      multipleStatements: true
    });

    this.connection.catch((err) => {
      const msg = err.sqlMessage;

      if (msg) {
        dialog.showErrorBox('Connection Error', msg);
      } else {
        dialog.showErrorBox('Uncaught Application Error', `Error: ${err.code} ${err.address}:${err.port}`);
      }
    });
  }

  /**
   * コネクションを取得
   */
  get connection(): Bluebird<mysql.Connection> {
    return this._connection;
  }

  /**
   * クエリを実行する
   * @param query
   */
  async execute(query: string): Promise<any> {
    return this.connection.then(async (connect) => {
      const result = await connect.query(query);
      connect.end();

      return result
    });
  }

  /**
   * データベース名を取得
   */
  async showDatabases(): Promise<string[]> {
    const results: any[] = await this.execute('SHOW DATABASES');
    const tmp_box: string[] = [];

    for (const res of results) {
      tmp_box.push(res.Database);
    }
    return tmp_box;
  }

  /**
   * dbに関する情報を集める
   */
  async collectInfo() {
    const info: IDatabaseInfoCollection = {
      databases: await this.showDatabases()
    };

    return info;
  }
}
