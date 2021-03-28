import React from 'react';
import ConnectForm from './ConnectForm';
import FavList from './FavList';

interface AppState {
  setting?: IDatabaseSetting;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  /**
   * 子コンポーネントからお気に入りを受け取り
   * @param fav
   */
  acceptFavorite(fav: IFavorite) {
    this.setState({ setting: fav.setting });
  }

  render(): JSX.Element {
    return (
      <>
        <FavList favorite={this.acceptFavorite.bind(this)} />
        <ConnectForm setting={this.state.setting} />
      </>
    );
  }
}

export default App;
