import React from 'react';
import { ipcKeys } from '../../../common/ipcKeys';
import FormItem from './FormItem';

interface ConnectFormProps {
  setting?: IDatabaseSetting;
}

interface ConnectFormState {
  setting: IDatabaseSetting;
  favorite: { name: string };
}

class ConnectForm extends React.Component<ConnectFormProps, ConnectFormState> {
  private formParts: IDatabaseSetting;

  constructor(props: ConnectFormProps) {
    super(props);

    this.state = {
      setting: {
        host: '',
        username: '',
        password: '',
        database: '',
        port: 3306,
      },
      favorite: {
        name: '',
      },
    };

    this.formParts = this.state.setting;
  }

  componentDidUpdate(previousProps: ConnectFormProps) {
    if (previousProps.setting !== this.props.setting) {
      if (this.props.setting) {
        this.setState({ setting: this.props.setting })
        this.formParts = this.props.setting;
      }
    }
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
    const fav: IFavorite = {
      setting, name: this.state.favorite.name
    };

    if (fav.name && setting.host && setting.username && setting.password) {
      this.setState({favorite: { name: '' }});
      ipcRenderer.send(ipcKeys.REGIST_FAV, fav);
    }
  }

  /**
   * フォーム変更時のハンドラ
   * @param e
   */
  changeSetting(e: React.FormEvent<HTMLFormElement>) {
    const target = e.target as HTMLInputElement;
    this.formParts[target.name] = target.value;

    if (target.name === 'port') {
      this.formParts[target.name] = parseInt(target.value, 10);
    }

    this.setState({setting: this.formParts});
  }

  /**
   * お気に入りの名前ハンドラ
   * @param e
   */
  changeFavName(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ favorite: { name: e.target.value }});
  }

  render() {
    return (
      <div className="form-container">
        <form className="setting-form card" onSubmit={this.connect.bind(this)} onChange={this.changeSetting.bind(this)}>
          <FormItem name="host" type="text" value={this.state.setting.host} />
          <FormItem name="username" type="text" value={this.state.setting.username} />
          <FormItem name="password" type="password" value={this.state.setting.password} />
          <FormItem name="port" type="number" value={this.state.setting.port} />
          <FormItem name="database" type="text" value={this.state.setting.database} placeholder='option' />
          <div className="btn-container">
            <button className="btn-primary" type="submit">connect</button>
          </div>
        </form>
        <div className="fav-form card">
          <input
            type="text"
            name="name"
            placeholder="name"
            value={this.state.favorite.name}
            onChange={this.changeFavName.bind(this)}
          />
          <button className="btn-secondary" onClick={this.favorite.bind(this)}>favorite</button>
        </div>
      </div>
    );
  }
}

export default ConnectForm;
