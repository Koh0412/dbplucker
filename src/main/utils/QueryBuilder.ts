interface ISelect {
  table: string;
  columns?: {[as: string]: string} | string[];
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

    // カラム指定があるかどうか
    if (props.columns) {
      if (Array.isArray(props.columns)) {
        if (props.columns.length > 0) {
          mergeSelector = props.columns.join(', ');
        }
      } else {
        const orgColumnNames = Object.keys(props.columns);
        const newNames = Object.values(props.columns);
        const tmpList: string[] = [];

        for (let i = 0; i < orgColumnNames.length; i++) {
          tmpList.push(`${orgColumnNames[i]} AS ${newNames[i]}`);
        }

        mergeSelector = tmpList.join(', ');
      }
    } else {
      mergeSelector = '*';
    }

    this.query = `SELECT ${mergeSelector} FROM ${props.table}`;
    return this;
  }

  /**
   * where句の作成
   * @param selector
   * @returns
   */
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

  limit(start: number, end: number) {
    this.query += ` LIMIT ${start}, ${end}`;
    return this;
  }
}

export const queryBuilder = new QueryBuilder();
