import React from 'react';
import { ipcKeys } from '../../../common/ipcKeys';

class ConnectForm extends React.Component<{}, ISettingFormState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      host: '',
      username: '',
      password: '',
      database: '',
      port: 3306,
    };
  }

  /**
   * dbサーバと接続を試す
   * @param e
   */
  connect(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    ipcRenderer.send(ipcKeys.CONNECT, this.state);
  }

  /**
   * ユーザーネーム変更
   * @param e
   */
  changeUsername(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: e.target.value });
  }

  /**
   * パスワード変更
   * @param e
   */
  changePassword(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: e.target.value });
  }

  /**
   * ホスト変更
   * @param e
   */
  changeHost(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ host: e.target.value });
  }

  /**
   * データベース名変更
   * @param e
   */
  changeDatabase(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ database: e.target.value });
  }

  /**
   * ポート変更
   * @param e
   */
  changePort(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ port: parseInt(e.target.value, 10) });
  }

  render() {
    return (
      <form className="setting-form" onSubmit={this.connect.bind(this)}>
        <div className="form-item">
          <label htmlFor="host">host:</label>
          <input type="text" id="host" value={this.state.host} onChange={this.changeHost.bind(this)} />
        </div>
        <div className="form-item">
          <label htmlFor="username">username:</label>
          <input type="text" id="username" value={this.state.username} onChange={this.changeUsername.bind(this)} />
        </div>
        <div className="form-item">
          <label htmlFor="password">password:</label>
          <input type="password" id="password" value={this.state.password} onChange={this.changePassword.bind(this)} />
        </div>
        <div className="form-item">
          <label htmlFor="port">port:</label>
          <input className="port" type="number" id="port" value={this.state.port} onChange={this.changePort.bind(this)} />
        </div>
        <div className="form-item">
          <label htmlFor="database">database</label>
          <input type="text" id="database" value={this.state.database} onChange={this.changeDatabase.bind(this)} />
        </div>
        <div>
          <button type="submit">connect</button>
        </div>
      </form>
    );
  }
}

export default ConnectForm;
