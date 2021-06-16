import { Dispatch } from "@reduxjs/toolkit";
import { connect } from "react-redux";
import { RootState } from "../stores";

export type MainProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function mapStateToProps(state: RootState) {
  return {
    tab: state.main.tab,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return { dispatch };
}

export const connectComponentMain = connect(mapStateToProps, mapDispatchToProps);
