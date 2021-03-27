import React from 'react';
import { ipcKeys } from '../../../common/ipcKeys';
import FormItem from './FormItem';

interface ISettingFormState {
  setting: IDatabaseSetting;
}

class ConnectForm extends React.Component<{}, ISettingFormState> {
  private formParts: IDatabaseSetting;

  constructor(props: {}) {
    super(props);

    this.state = {
      setting: {
        host: '',
        username: '',
        password: '',
        database: '',
        port: 3306,
      },
    };

    this.formParts = this.state.setting;
  }

  /**
   * dbサーバと接続を試す
   * @param e
   */
  connect(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    ipcRenderer.send(ipcKeys.CONNECT, this.state.setting);
  }

  /**
   * お気に入り登録
   * @param e
   */
  favorite(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const setting = this.state.setting;

    if (setting.host && setting.username && setting.password) {
      ipcRenderer.send(ipcKeys.FAVORITE, this.state.setting);
    }
  }

  /**
   * フォーム変更時のハンドラ
   * @param e
   */
  change(e: React.FormEvent<HTMLFormElement>) {
    const target = e.target as HTMLInputElement;
    this.formParts[target.name] = target.value;

    if (target.name === 'port') {
      this.formParts[target.name] = parseInt(target.value, 10);
    }

    this.setState({setting: this.formParts});
  }

  render() {
    return (
      <div className="form-container">
        <form className="setting-form card" onSubmit={this.connect.bind(this)} onChange={this.change.bind(this)}>
          <FormItem name="host" type="text" value={this.state.setting.host} />
          <FormItem name="username" type="text" value={this.state.setting.username} />
          <FormItem name="password" type="password" value={this.state.setting.password} />
          <FormItem name="port" type="number" value={this.state.setting.port} />
          <FormItem name="database" type="text" value={this.state.setting.database} placeholder='option' />
          <div className="btn-container">
            <button className="btn-primary" type="submit">connect</button>
          </div>
        </form>
        <div>
          <button className="btn-secondary" onClick={this.favorite.bind(this)}>favorite</button>
        </div>
      </div>
    );
  }
}

export default ConnectForm;
