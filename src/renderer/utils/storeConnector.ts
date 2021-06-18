import { Dispatch } from "@reduxjs/toolkit";
import { connect } from "react-redux";
import { RootState } from "../stores";

export type MainStoreProps = ReturnType<typeof mapStateToMainProps> & ReturnType<typeof mapDispatchToMainProps>;

function mapStateToMainProps(state: RootState) {
  return {
    tab: state.main.tab,
    dblistWidth: state.main.dblistWidth,
  };
}

function mapDispatchToMainProps(dispatch: Dispatch) {
  return { dispatch };
}

/**
 * メインのreduxストアに接続したコンポーネントを返す
 **/
export const mainStoreConnectedComponent = connect(mapStateToMainProps, mapDispatchToMainProps);
