import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  snackbar: {
    open: false,
    message: "",
    severity: "success",
    duration: 2000
  },
  openShare: false,
  openCommitment: false,
  openWithdraw: false,
  openEditProfile: false,
  openInteractions: false,
  previousRoute: "/",
  transactionState: null,
  title: "",
  connections: 0
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openSnackbar(state, action) {
      state.snackbar.open = true;
      state.snackbar.message = action.payload.message;
      state.snackbar.severity = action.payload.severity || "success";
      state.snackbar.duration = action.payload.duration || 4000;
    },
    closeSnackbar(state) {
      state.snackbar = {
        ...state.snackbar,
        open: false
      };
    },
    setTitle(state, action) {
      state.title = action.payload;
    },
    updateTransactionState(state, action) {
      state.transactionState = action.payload;
    },
    setPreviusRoute(state, action) {
      state.previousRoute = action.payload;
    },
    setOpenShare(state, action) {
      state.openShare = action.payload;
    },
    setOpenCommitment(state, action) {
      state.openCommitment = action.payload;
    },
    setOpenWithdraw(state, action) {
      state.openWithdraw = action.payload;
    },
    setOpenEditProfile(state, action) {
      state.openEditProfile = action.payload;
    },
    setOpenInteractions(state, action) {
      state.openInteractions = action.payload;
    },
    setConnections(state, action) {
      state.connections = action.payload;
    },
    resetUIState: () => initialState
  }
});

export const {
  openSnackbar,
  closeSnackbar,
  setTitle,
  setPreviusRoute,
  setOpenShare,
  setOpenCommitment,
  setOpenWithdraw,
  setOpenEditProfile,
  setOpenInteractions,
  updateTransactionState,
  setConnections
} = uiSlice.actions;

export const IsEditingProfile = (state) => state.ui.openEditProfile as boolean;
export const IsInteractionDialogOpen = (state) =>
  state.ui.openInteractions as boolean;

export default uiSlice.reducer;
