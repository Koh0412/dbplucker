import React from 'react';
import { ipcKeys } from '../../../common/ipcKeys';
import FormItem from './FormItem';

interface ISettingFormState {
  settings: IDatabaseSetting;
}

class ConnectForm extends React.Component<{}, ISettingFormState> {
  private formParts: IDatabaseSetting;

  constructor(props: {}) {
    super(props);

    this.state = {
      settings: {
        host: '',
        username: '',
        password: '',
        database: '',
        port: 3306,
      },
    };

    this.formParts = this.state.settings;
  }

  /**
   * dbサーバと接続を試す
   * @param e
   */
  connect(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(this.state.settings);
    ipcRenderer.send(ipcKeys.CONNECT, this.state.settings);
  }

  change(e: React.FormEvent<HTMLFormElement>) {
    const target = e.target as HTMLInputElement;
    this.formParts[target.name] = target.value;

    if (target.name === 'port') {
      this.formParts[target.name] = parseInt(target.value, 10);
    }

    this.setState({settings: this.formParts});
  }

  render() {
    return (
      <form className="setting-form" onSubmit={this.connect.bind(this)} onChange={this.change.bind(this)}>
        <FormItem name="host" type="text" value={this.state.settings.host} />
        <FormItem name="username" type="text" value={this.state.settings.username} />
        <FormItem name="password" type="password" value={this.state.settings.password} />
        <FormItem name="port" type="number" value={this.state.settings.port} />
        <FormItem name="database" type="text" value={this.state.settings.database} />
        <div>
          <button type="submit">connect</button>
        </div>
      </form>
    );
  }
}

export default ConnectForm;
