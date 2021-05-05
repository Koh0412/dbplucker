import React from 'react';
import { ipcKeys } from '../../../common/ipcKeys';

interface AppState {
  mode: string;
  dbinfo?: IDatabaseInfoCollection;
}

class App extends React.Component<{}, AppState> {
  tableRefs: React.RefObject<HTMLUListElement>[] = [];

  constructor(props: {}) {
    super(props);

    this.state = {
      mode: 'dark'
    };

    ipcRenderer.on(ipcKeys.DBINFO, this.setTableRefs.bind(this));
  }

  /**
   * データベース名を表示する要素
   */
  get databaseElements(): JSX.Element[] | undefined {
    return this.state.dbinfo?.schemataList.map((schemata, i) => {
      return (
        <li className="database" key={i}>
          <div
          className="name"
            data-database={schemata.name}
            onClick={this.clickDatabaseName.bind(this)}
          >
            <div className="icon"><i className="fas fa-database"></i></div>
            <div>{schemata.name}{/*: {schemata.collation}*/}</div>
          </div>
          <ul className="table-list" id={`database_${i}`} ref={this.tableRefs[i]}></ul>
        </li>
      );
    });
  }

  /**
   * コンポネントがマウントされた後に実行
   */
  componentDidMount() {
    ipcRenderer.on(ipcKeys.DBINFO, this.dbinfoHandler.bind(this));
    ipcRenderer.on(ipcKeys.SHOW_TABLES, this.showTables.bind(this));
  }

  /**
   * dbinfoチャネル用のハンドラ
   * @param e
   * @param dbinfo
   */
  dbinfoHandler(e: Electron.IpcRendererEvent, dbinfo: IDatabaseInfoCollection | undefined) {
    this.setState({ dbinfo });
  }

  /**
   * データベース名を取得し送信
   * @param e
   */
  clickDatabaseName(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const parentElement = e.currentTarget.parentElement;
    const tableListElement = parentElement?.children.item(1);

    const props: IDatabaseProps = {
      id: tableListElement?.id as string,
      name: e.currentTarget.dataset.database as string,
    };

    tableListElement?.classList.toggle('open');

    ipcRenderer.send(ipcKeys.SEND_DB, props);
  }

  /**
   * テーブル名を表示する
   * @param e
   * @param tableNames
   */
  showTables(e: Electron.IpcRendererEvent, props: { id: string; tableNames: string[] | undefined }) {
    const currentElement = this.tableRefs.find((ref) => {
      return ref.current?.id === props.id;
    })?.current;

    if (currentElement?.children.length === 0) {
      const item = props.tableNames?.map((table) => {
        const li = document.createElement('li');
        li.textContent = table;

        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-table');

        li.prepend(icon);

        return li;
      });

      item?.forEach((i) => currentElement?.appendChild(i));
    }
  }

  /**
   * テーブル名用のRefをセット
   * @param e
   * @param dbinfo
   */
  setTableRefs(e: Electron.IpcRendererEvent, dbinfo: IDatabaseInfoCollection | undefined) {
    if (dbinfo && this.tableRefs.length === 0) {
      for (let i = 0; i < dbinfo.schemataList.length; i++) {
        this.tableRefs.push(React.createRef<HTMLUListElement>());
      }
    }
  }

  /**
   * レンダリング
   * @returns
   */
  render(): JSX.Element {
    if (this.state.dbinfo) {
      document.title = `(${this.state.dbinfo.version}) - dbplucker`;
    }

    return (
      <main className={this.state.mode}>
        {!this.state.dbinfo && (
          <div>No database is connected</div>
        )}
        <ul className="database-list">{this.databaseElements}</ul>
      </main>
    );
  }
}

export default App;
