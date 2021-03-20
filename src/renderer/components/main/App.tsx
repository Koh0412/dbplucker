import React from 'react';

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
    ipcRenderer.on('dbinfo', this.dbinfoHandler.bind(this));
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
   * データベース名を表示する要素
   */
  get databaseElements() {
    return this.state.dbinfo?.databases.map((database) => {
      return <li>{database}</li>
    });
  }

  render(): JSX.Element {
    return (
      <div className={this.state.mode}>
        <div>Hello</div>
        <ul>{this.databaseElements}</ul>
      </div>
    );
  }
}

export default App;
