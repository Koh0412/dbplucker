import { combineReducers, createStore } from 'redux';
import mainReducer from './mainStore';

const reducer = combineReducers({
  main: mainReducer,
});

const store = createStore(reducer);

export default store;

export type RootState = ReturnType<typeof reducer>;
