import React from "react";
import { XIcon, SquareIcon, DashIcon } from '@primer/octicons-react'
import { ipcKeys } from "@common/ipcKeys";

interface TitleBarProps {
  bgColor: string;
  color: string;
}

interface TitleBarState {
  title: string;
  winChangeToggle: boolean
}

class TitleBar extends React.Component<TitleBarProps, TitleBarState> {

  constructor(props: TitleBarProps) {
    super(props);

    this.state = {
      title: 'dbplucker',
      winChangeToggle: false,
    };
  }

  /**
   * コンポネントがマウントされた後に実行
   */
  componentDidMount() {
    ipcRenderer.on(ipcKeys.TITLE, this.updateTitle.bind(this));
  }

  /**
   * タイトルの更新
   * @param e
   * @param title
   */
  updateTitle(e: Electron.IpcRendererEvent, title: string) {
    this.setState({ title });
  }

  changeWinSize() {
    if (this.state.winChangeToggle) {
      ipcRenderer.send(ipcKeys.WIN_RESTORE);
    } else {
      ipcRenderer.send(ipcKeys.WIN_MAX);
    }

    this.setState({ winChangeToggle: !this.state.winChangeToggle });
  }

  /**
   * レンダリング
   * @returns
   */
  render() {
    return (
      <header className="title-bar" style={{ background: this.props.bgColor, color: this.props.color }}>
        <div className="menu">
          <span className="icon"><img src="../resources/images/favicon.ico" width="20" /></span>
          {/*<ul className="menu-item"> menu </ul>*/}
          <span className="title three-point-leader">{this.state.title}</span>
        </div>
        <div className="btns">
          <div className="title-btn" onClick={() => ipcRenderer.send(ipcKeys.WIN_MIN)}>
            <DashIcon size={20} />
          </div>
          <div className="title-btn" onClick={this.changeWinSize.bind(this)}>
            <SquareIcon size={20} />
          </div>
          <div className="title-btn close" onClick={() => ipcRenderer.send(ipcKeys.WIN_CLOSE)}>
            <XIcon size={20} />
          </div>
        </div>
      </header>
    );
  }
}

export default TitleBar;
