import mysql from 'promise-mysql';
import * as Bluebird from 'bluebird';
import { dialog } from 'electron';
import { queryBuilder } from '../utils/QueryBuilder';
import { store } from './Store';
import { storeKeys } from '../../common/storeKeys';

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

    this.connection.then(() => {
      store.set(storeKeys.CONNECT_INFO, setting);
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
  async execute<T = any[]>(query: string): Promise<T> {
    return this.connection.then(async (connect) => {
      try {
        const res = await connect.query(query);
        return res;
      } catch (err) {
        dialog.showErrorBox('SQL ERROR', `${err.sqlMessage}\n\n your SQL: ${err.sql}`);
      }
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
      columns: {
        SCHEMA_NAME: 'name',
        DEFAULT_COLLATION_NAME: 'collation'
      },
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
   * mysqlのバージョン取得
   */
  async mysqlVersion() {
    const packet = await this.execute('SELECT version() as version');
    return packet[0].version as string;
  }

  /**
   * dbに関する情報を集める
   * @param setting
   * @returns
   */
  async collectInfo(setting: IDatabaseSetting) {
    const info: IDatabaseInfoCollection = {
      schemataList: await this.showDatabaseInfo(setting.database),
      version: await this.mysqlVersion(),
    };

    return info;
  }
}
