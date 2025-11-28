import { combineReducers } from "redux";
import uiSliceReducer from "./ui-reducer";
import autReducer from "./aut/aut.reducer";
import walletProvideReducer from "./WalletProvider/WalletProvider";
import pluginsReducer from "./plugins/plugins.reducer";
import interactionsReducer from "./interactions/interactions.reducer";
import contributionsReducer from "./contributions/contributions.reducer";
import { contributionsApi } from "@api/contributions.api";

export const reducers = combineReducers({
  ui: uiSliceReducer,
  aut: autReducer,
  plugin: pluginsReducer,
  interaction: interactionsReducer,
  contribution: contributionsReducer,
  walletProvider: walletProvideReducer,
  [contributionsApi.reducerPath]: contributionsApi.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_APP") {
    state = undefined;
  }
  return reducers(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
