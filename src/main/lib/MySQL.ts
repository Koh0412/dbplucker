import mysql from 'promise-mysql';
import * as Bluebird from 'bluebird';
import { dialog } from 'electron';
import { queryBuilder } from '../utils/QueryBuilder';

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
  async execute<T = any>(query: string): Promise<T> {
    return this.connection.then(async (connect) => {
      const result = await connect.query(query);
      return result
    });
  }

  /**
   * データベースの情報を取得
   * @param database
   * @returns
   */
  async showDatabaseInfo(database: string): Promise<ISchemata[]> {
    let query = '';
    const selectQuery = queryBuilder.select({
      table: 'information_schema.SCHEMATA',
      selectColumns: ['SCHEMA_NAME AS name', 'DEFAULT_COLLATION_NAME AS collation'],
    });

    if (database) {
      query = selectQuery.where({ SCHEMA_NAME: database }).build();
    } else {
      query = selectQuery.build();
    }

    const schemaList: ISchemata[] = await this.execute(query);
    return schemaList
  }

  /**
   * dbに関する情報を集める
   * @param setting
   * @returns
   */
  async collectInfo(setting: IDatabaseSetting) {
    const info: IDatabaseInfoCollection = {
      schemataList: await this.showDatabaseInfo(setting.database)
    };

    return info;
  }
}
