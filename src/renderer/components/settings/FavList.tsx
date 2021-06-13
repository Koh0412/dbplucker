import * as React from 'react';
import { ipcKeys } from '@common/ipcKeys';

interface FavListProps {
  favorite: (fav: IFavorite) => void;
}

interface FavListState {
  favList?: IFavorite[];
}

class FavList extends React.Component<FavListProps, FavListState> {
  constructor(props: FavListProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    ipcRenderer.on(ipcKeys.SEND_FAV, this.setFavList.bind(this));
  }

  /**
   * 親コンポーネントにお気に入りを渡す
   * @param fav
   */
  passFavorite(token: string) {
    this.props.favorite(JSON.parse(token) as IFavorite);
  }

  /**
   * お気に入りリスト要素の取得
   */
  get dispFavList() {
    return this.state.favList?.map((fav, i) => {
      return (
        <li className="item" key={i} onClick={this.passFavorite.bind(this, JSON.stringify(fav))}>{fav.name}</li>
      );
    });
  }

  /**
   * お気に入りをセット
   * @param e
   * @param favList
   */
  setFavList(e: Electron.IpcRendererEvent, favList?: IFavorite[]) {
    this.setState({ favList });
  }

  render() {
    return (
      <div className="fav-list card">
        <p className="title">favorite</p>
        <ul>{this.dispFavList}</ul>
      </div>
    );
  }
}

export default FavList;
