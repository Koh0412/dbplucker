import React from 'react';
import { ipcKeys } from '@common/ipcKeys';
import CollectionContainer from './CollectionContainer';
import DatabaseList from './DatabaseList';
import TitleBar from './TitleBar';

interface AppState {
  mode: string;
  dbinfo?: IDatabaseInfoCollection;
  resizeWidth?: number;
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
   * 子コンポーネントからリサイズを受け取る
   * @param styleWidth
   */
  resize(width: number) {
    this.setState({ resizeWidth: width });
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
          <div className="side-tab"></div>
          <DatabaseList dbinfo={this.state.dbinfo} resize={this.resize.bind(this)} />
          <CollectionContainer resizeWidth={this.state.resizeWidth} />
        </main>
      </>
    );
  }
}

export default App;
