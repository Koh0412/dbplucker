import { Dispatch } from "@reduxjs/toolkit";
import { connect } from "react-redux";
import { RootState } from "../stores";

export type MainProps = ReturnType<typeof mapStateToMainProps> & ReturnType<typeof mapDispatchToMainProps>;

function mapStateToMainProps(state: RootState) {
  return {
    tab: state.main.tab,
    dblistWidth: state.main.dblistWidth,
  };
}

function mapDispatchToMainProps(dispatch: Dispatch) {
  return { dispatch };
}

export const connectStoreMain = connect(mapStateToMainProps, mapDispatchToMainProps);
