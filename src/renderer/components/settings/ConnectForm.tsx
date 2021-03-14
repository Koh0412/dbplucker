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
    };
  }

  connect(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    ipcRenderer.send(ipcKeys.CONNECT, this.state);
  }

  changeUsername(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: e.target.value });
  }

  changePassword(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: e.target.value });
  }

  changeHost(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ host: e.target.value });
  }

  changeDatabase(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ database: e.target.value });
  }

  render() {
    return (
      <form className="setting-form" onSubmit={this.connect.bind(this)}>
        <div className="form-item">
          <label htmlFor="host">host</label>
          <input type="text" id="host" value={this.state.host} onChange={this.changeHost.bind(this)} />
        </div>
        <div className="form-item">
          <label htmlFor="username">username</label>
          <input type="text" id="username" value={this.state.username} onChange={this.changeUsername.bind(this)} />
        </div>
        <div className="form-item">
          <label htmlFor="password">password</label>
          <input type="password" id="password" value={this.state.password} onChange={this.changePassword.bind(this)} />
        </div>
        <div className="form-item">
          <label htmlFor="database">database</label>
          <input type="text" id="database" value={this.state.database} onChange={this.changeDatabase.bind(this)} />
        </div>
        <div className="form-item">
          <button type="submit">connect</button>
        </div>
      </form>
    );
  }
}

export default ConnectForm;
