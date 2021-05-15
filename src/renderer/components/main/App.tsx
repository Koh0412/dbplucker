import React from 'react';
import { ipcKeys } from '../../../common/ipcKeys';
import DatabaseList from './DatabaseList';
import TitleBar from './TitleBar';

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

  /**
   * コンポネントがマウントされた後に実行
   */
  componentDidMount() {
    ipcRenderer.on(ipcKeys.DBINFO, this.dbinfoHandler.bind(this));
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
   * レンダリング
   * @returns
   */
  render(): JSX.Element {
    if (this.state.dbinfo) {
      document.title = `(${this.state.dbinfo.version}) - dbplucker`;
    }

    return (
      <>
        <TitleBar color="#c6cbd1" bgColor="#1e2226" />
        <main className={this.state.mode}>
          <DatabaseList dbinfo={this.state.dbinfo} />
        </main>
      </>
    );
  }
}

export default App;
