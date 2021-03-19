import mysql from 'promise-mysql';
import * as Bluebird from 'bluebird';
import { dialog } from 'electron';

export class MySQL {
  private _connection: Bluebird<mysql.Connection>;

  constructor(
    private setting: ISettingFormState
  ) {
    this._connection = mysql.createConnection({
      host: this.setting.host,
      user: this.setting.username,
      password: this.setting.password,
      database: this.setting.database,
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
  get connection() {
    return this._connection;
  }

  /**
   * クエリを実行する
   * @param query
   * @returns Promise<any>
   */
  async execute(query: string) {
    return this.connection.then((connect) => {
      const result = connect.query(query);
      connect.end();

      return result
    });
  }
}
