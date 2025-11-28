import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

import { reducers } from "./reducers";
import { contributionsApi } from "@api/contributions.api";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(logger, contributionsApi.middleware),
  reducer: reducers
});

export default store;
