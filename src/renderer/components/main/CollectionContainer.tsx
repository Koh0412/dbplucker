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
        const keys = Object.keys(record);
        const values = Object.values(record);

        for (let i = 0; i < keys.length; i++) {
          if (!data[keys[i]]) {
            data[keys[i]] = [];
          }
          data[keys[i]].push(values[i]);
        }
      });

      this.setState({ data });
    });
  }

  get testElement() {
    const list: JSX.Element[] = [];

    const keys = Object.keys(this.state.data);
    const values = Object.values(this.state.data);

    for (let i = 0; i < keys.length; i++) {
      list.push(<div key={i}>{keys[i]}</div>);
    }

    return (
      <div>{list}</div>
    );
  }

  /**
   * レンダリング
   * @returns
   */
  render() {
    return (
      <div>{this.testElement}</div>
    );
  }
}

export default CollectionContainer;
