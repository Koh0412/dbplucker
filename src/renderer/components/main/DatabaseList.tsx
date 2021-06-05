import React from "react";
import ReactDOM from "react-dom";
import { ipcKeys } from "../../../common/ipcKeys";
import { UtilFunc } from "../../utils/UtilFunc";

interface DatabaseListProps {
  dbinfo?: IDatabaseInfoCollection;
  resize: (width: number) => void;
}

class DatabaseList extends React.Component<DatabaseListProps> {
  private tableRefs: React.RefObject<HTMLUListElement>[] = [];
  private databaseRef: React.RefObject<HTMLUListElement>;

  constructor(props: DatabaseListProps) {
    super(props);
    ipcRenderer.on(ipcKeys.DBINFO, this.setTableRefs.bind(this));

    this.databaseRef = React.createRef<HTMLUListElement>();
  }

  /**
   * データベース名を表示する要素
   */
  get databaseElements(): JSX.Element[] | undefined {
    return this.props.dbinfo?.schemataList.map((schemata, i) => {
      return (
        <li className="database" key={i}>
          <div
            className="name"
            data-database={schemata.name}
            onClick={this.clickDatabaseName.bind(this)}
          >
            <div className="icon"><i className="fas fa-database"></i></div>
            <div className="three-point-leader">{schemata.name}</div>
          </div>
          <ul className="table-list" id={`database_${i}`} ref={this.tableRefs[i]}></ul>
        </li>
      );
    });
  }

  /**
   * コンポネントがマウントされた後に実行
   */
  componentDidMount() {
    ipcRenderer.on(ipcKeys.SHOW_TABLES, this.showTables.bind(this));

    const resizeObserver = new ResizeObserver((entries) => {
      const target = entries[0].target as HTMLElement;

      if (!target.style.width) {
        this.props.resize(target.clientWidth);
      } else {
        this.props.resize(parseInt(target.style.width, 10));
      }
    });

    if (this.databaseRef.current) {
      resizeObserver.observe(this.databaseRef.current);
    }
  }

  /**
  * データベース名を取得し送信
  * @param e
  */
  clickDatabaseName(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const parentElement = e.currentTarget.parentElement;
    const tableListElement = UtilFunc.getChildrenByClass(parentElement, 'table-list').shift();

    const props: IDatabaseProps = {
      id: tableListElement?.id as string,
      name: e.currentTarget.dataset.database as string,
    };

    tableListElement?.classList.toggle('open');

    if (tableListElement?.children.length === 0) {
      ipcRenderer.send(ipcKeys.SEND_DB, props);
    }
  }

  /**
   * テーブル名を取得し送信
   * @param e
   */
  clickTableName(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    const dataset = e.currentTarget.dataset;
    ipcRenderer.send(ipcKeys.SEND_TABLE, { table: dataset.table, database: dataset.database });
  }

  /**
   * テーブル名を表示する
   * @param e
   * @param tableNames
   */
  showTables(e: Electron.IpcRendererEvent, props: IShowTableProps) {
    const target = this.tableRefs.find((ref) => {
      return ref.current?.id === props.id;
    })?.current;

    if (target?.children.length === 0) {
      const tableitems = props.tableNames?.map((table, i) => {
        return (
          <li
            key={i}
            data-table={table}
            data-database={props.database}
            onClick={this.clickTableName.bind(this)}
          >
            <i className="fas fa-table"></i>{table}
          </li>
        );
      });

      ReactDOM.render(<>{tableitems}</>, target);
    }
  }

  /**
   * テーブル名用のRefをセット
   * @param e
   * @param dbinfo
   */
  setTableRefs(e: Electron.IpcRendererEvent, dbinfo: IDatabaseInfoCollection | undefined) {
    if (dbinfo && this.tableRefs.length === 0) {
      for (let i = 0; i < dbinfo.schemataList.length; i++) {
        this.tableRefs.push(React.createRef<HTMLUListElement>());
      }
    }
  }

  /**
   * レンダリング
   * @returns
   */
  render() {
    return (
      <ul className="database-list" ref={this.databaseRef}>{this.databaseElements}</ul>
    );
  }
}

export default DatabaseList;
