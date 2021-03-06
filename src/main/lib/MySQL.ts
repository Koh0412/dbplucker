import mysql from 'promise-mysql';
import * as Bluebird from 'bluebird';

export class MySQL {
  private connection: Bluebird<mysql.Connection>;

  constructor(
    private host: string,
    private user: string,
    private password: string,
    private database: string
  ) {
    this.connection = mysql.createConnection({
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database,
      multipleStatements: true
    });
  }

  async execute(query: string) {
    return this.connection.then((connect) => {
      const result = connect.query(query);
      connect.end();

      return result
    }).catch((err) => this.handleError(err));
  }

  private handleError(err: any) {
    console.log(err);
  }
}
