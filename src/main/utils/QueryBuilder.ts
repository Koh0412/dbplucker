interface ISelect {
  table: string;
  selectColumns?: string[];
}

class QueryBuilder {
  private query: string = '';

  /**
   * クエリの発行
   * @returns
   */
  build() {
    return this.query;
  }

  /**
   * 現在の保持しているクエリをクリアする
   */
  clear() {
    this.query = '';
  }

  /**
   * showクエリの作成
   * @param name
   * @returns
   */
  show(name: string) {
    this.query = `SHOW ${name.toUpperCase()}`;
    return this;
  }

  /**
   * selectクエリの作成
   * @param query
   */
  select(props: ISelect) {
    let mergeSelector = '';

    if (props.selectColumns && props.selectColumns.length > 0) {
      mergeSelector = props.selectColumns.join(', ');
    } else {
      mergeSelector = ' *';
    }

    this.query = `SELECT ${mergeSelector} FROM ${props.table}`;
    return this;
  }

  where(selector: {[column: string]: string | number}) {
    const tmpList: string[] = [];

    const keys = Object.keys(selector);
    const values = Object.values(selector);

    for (let i = 0; i < keys.length; i++) {
      tmpList.push(`${keys[i]} = '${values[i]}'`);
    }

    this.query += ` WHERE ${tmpList.join(' AND ')}`;

    return this;
  }
}

export const queryBuilder = new QueryBuilder();
