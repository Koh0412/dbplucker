import promiseMysql from 'promise-mysql';
import * as Bluebird from 'bluebird';
import { dialog } from 'electron';
import { queryBuilder } from '../utils/QueryBuilder';
import { store } from './Store';
import { storeKeys } from '../../common/storeKeys';

export class MySQL {
  private _connection: any | undefined;
  private setting: IDatabaseSetting | undefined;

  constructor() {}

  /**
   * コネクションを取得
   */
  get connection(): Bluebird<promiseMysql.Connection> | undefined {
    return this._connection;
  }

  /**
   * データベースへの接続を作る
   * @param setting
   */
  createConnection(setting: IDatabaseSetting) {
    this.setting = setting;

    this._connection = promiseMysql.createConnection({
      host: this.setting.host,
      user: this.setting.username,
      password: this.setting.password,
      database: this.setting.database,
      port: this.setting.port,
      multipleStatements: true
    });

    (this._connection as Bluebird<promiseMysql.Connection>).then(() => {
      store.set(storeKeys.CONNECT_INFO, this.setting);
    }).catch((err) => {
      this.error(err);
    });
  }

  /**
   * クエリを実行する
   * @param query
   */
  async execute<T = any[]>(query: string): Promise<T> {
    return this.connection?.then(async (connect) => {
      try {
        const res = await connect.query(query);
        return res;
      } catch (err) {
        this.error(err);
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
   * テーブル名の取得
   * @param database
   * @returns
   */
  async getTableNames(database: IDatabaseProps) {
    const selectQuery = queryBuilder.select({
      table: 'information_schema.TABLES',
      columns: {
        TABLE_NAME: 'tableName'
      }
    });

    const query = selectQuery.where({ TABLE_SCHEMA: database.name }).build();

    const data = await this.execute(query);
    const tableNames = data?.map((row) => {
      return row.tableName as string;
    });

    return tableNames;
  }

  /**
   * テーブルのレコードを取得
   * @param props
   * @returns
   */
  async getTableRecords(props: { table: string; database: string; }) {
    // TODO: 仮limit
    const query = queryBuilder.select({
      table: `${props.database}.${props.table}`,
    }).limit(0, 50).build();

    return await this.execute(query);
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

  private error(err: any) {
    if (err.sqlMessage) {
      dialog.showErrorBox('Connection Error', `${err.sqlMessage}\n\n SQL: ${err.sql}`);
    } else if (err.address) {
      dialog.showErrorBox('Uncaught Application Error', `Error: ${err.code} ${err.address}:${err.port}`);
    } else {
      dialog.showErrorBox('Uncaught Application Error', `Error: ${err.code}`);
    }
  }
}

export const mysql = new MySQL();
