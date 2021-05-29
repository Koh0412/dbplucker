import React from "react";
import { ipcKeys } from "../../../common/ipcKeys";

interface CollectionContainerState {
  data: any;
}

class CollectionContainer extends React.Component<{}, CollectionContainerState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      data: {},
    };
  }
  /**
   * コンポネントがマウントされた後に実行
   */
  componentDidMount() {
    ipcRenderer.on(ipcKeys.SHOW_RECORDS, (e, records: any[]) => {
      let data: any = {};

      records.forEach((record) => {
        const columns = Object.keys(record);
        const values = Object.values(record);

        columns.forEach((column, i) => {
          if (!data[column]) {
            data[column] = [];
          }

          data[column].push(values[i]);
        });
      });

      this.setState({ data });
    });
  }

  /**
   * テーブルのレコードを表形式で出力
   */
  get tableDataElement() {
    const dataList: JSX.Element[] = [];

    Object.keys(this.state.data).forEach((column, i) => {
      const records = this.state.data[column] as any[];
      const recordListElement = records.map((record, i) => {
        return (<li key={i}>{record}</li>);
      });

      dataList.push(
        <div className="column" key={i}>
          <div className="column-name">{column}</div>
          <ul className="record-list">{recordListElement}</ul>
        </div>
      );
    });

    return dataList;
  }

  /**
   * レンダリング
   * @returns
   */
  render() {
    return (
      <div>
        <div className="data-table">{this.tableDataElement}</div>
      </div>
    );
  }
}

export default CollectionContainer;
