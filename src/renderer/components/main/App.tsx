import React from 'react';
import { ipcKeys } from '../../../common/ipcKeys';

interface AppState {
  mode: string;
  dbinfo?: IDatabaseInfoCollection;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      mode: 'dark'
    };
  }

  componentDidMount() {
    ipcRenderer.on(ipcKeys.DBINFO, this.dbinfoHandler.bind(this));
    ipcRenderer.on('show-table', (e, tableNames: string[]) => {
      tableNames.forEach((table) => {
        console.log(table);
      });
    });
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
    ipcRenderer.send('send-db', e.currentTarget.dataset.database);
  }

  /**
   * データベース名を表示する要素
   */
  get databaseElements() {
    return this.state.dbinfo?.schemataList.map((schemata, i) => {
      return (
        <li key={i}>
          <div className="icon"><i className="fas fa-database"></i></div>
          <div data-database={schemata.name} onClick={this.clickDatabaseName.bind(this)}>{schemata.name}: {schemata.collation}</div>
        </li>
      );
    });
  }

  render(): JSX.Element {
    if (this.state.dbinfo) {
      document.title = `(${this.state.dbinfo.version}) - dbplucker`;
    }

    return (
      <div className={this.state.mode}>
        {!this.state.dbinfo && (
          <div>No database is connected</div>
        )}
        <ul className="database-list">{this.databaseElements}</ul>
      </div>
    );
  }
}

export default App;
