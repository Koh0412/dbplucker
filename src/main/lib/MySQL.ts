import mysql from 'promise-mysql';
import * as Bluebird from 'bluebird';

export class MySQL {
  private connection: Bluebird<mysql.Connection>;

  constructor(
    private setting: ISettingFormState
  ) {
    this.connection = mysql.createConnection({
      host: this.setting.host,
      user: this.setting.username,
      password: this.setting.password,
      database: this.setting.database,
      multipleStatements: true
    });
  }

  /**
   * コネクションドライバーを取得
   */
  get driver() {
    return this.connection;
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
