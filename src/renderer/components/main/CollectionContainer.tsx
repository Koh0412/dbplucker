import React from "react";
import { ipcKeys } from "@common/ipcKeys";
import { mainStoreConnectedComponent, MainStoreProps } from "../../utils/storeConnector";
import { UtilFunc } from "../../utils/UtilFunc";

interface ITableData {
  [column: string]: any[];
}

interface CollectionContainerState {
  data: ITableData;
  containerCss?: React.CSSProperties;
}

type Props = MainStoreProps

class CollectionContainer extends React.Component<Props, CollectionContainerState> {
  constructor(props: Props) {
    super(props);

    // TODO: 切り替えは一先ずタブ方式で this.state.tab=1 this.contentElements[this.state.tab]
    this.state = {
      data: {},
    };
  }

  /**
   * コンポネントがマウントされた後に実行
   */
  componentDidMount() {
    ipcRenderer.on(ipcKeys.SHOW_RECORDS, this.rebuildTableData.bind(this));
  }

  /**
   * コンポネントが更新された時に実行
   */
  componentDidUpdate(previousProps: Props) {
    if (previousProps.dblistWidth !== this.props.dblistWidth && this.props.dblistWidth) {
      const computedWidth = document.body.clientWidth - this.props.dblistWidth - 50;

      this.setState({
        containerCss: {
          width: computedWidth + 'px',
        },
      });
    }
  }

  /**
   * テーブルのレコードを表形式で出力
   */
  get tableDataElement() {
    return Object.keys(this.state.data).map((column, i) => {
      const records = this.state.data[column];

      const recordListElement = records.map((record, i) => {
        if (record !== null && typeof (record) === 'object') {
          record = UtilFunc.getStandardDateTime(record);
        }

        return (<li key={i}>{record}</li>);
      });

      return (
        <div className="column" key={i}>
          <div className="column-name">{column}</div>
          <ul className="record-list">{recordListElement}</ul>
        </div>
      );
    });
  }

  /**
   * データを使い易い形に再構築し保存
   * @param e
   * @param records
   */
  rebuildTableData(e: Electron.IpcRendererEvent, records: (string | number)[]) {
    let data: ITableData = {};

    records.forEach((record) => {
      const columnNames = Object.keys(record);
      const fields = Object.values(record);

      columnNames.forEach((name, i) => {
        if (!data[name]) {
          data[name] = [];
        }
        data[name].push(fields[i]);
      });
    });

    this.setState({ data });
  }

  /**
   * レンダリング
   * @returns
   */
  render() {
    return (
      <>
        <div className="container" style={this.state.containerCss}>
          {Object.keys(this.state.data).length > 0 && (
            <div className="data-table">{this.tableDataElement}</div>
          )}
        </div>
      </>
    );
  }
}

export default mainStoreConnectedComponent(CollectionContainer);
