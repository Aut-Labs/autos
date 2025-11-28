import { NetworkConfig } from "@api/models/network.config";
import { createSlice } from "@reduxjs/toolkit";

export interface WalletProviderState {
  selectedNetwork: NetworkConfig;
  networksConfig: NetworkConfig[];
}

const initialState: WalletProviderState = {
  selectedNetwork: null,
  networksConfig: []
};

export const walletProviderSlice = createSlice({
  name: "walletProvider",
  initialState,
  reducers: {
    updateWalletProviderState(state, action) {
      Object.keys(action.payload).forEach((key: string) => {
        state[key] = action.payload[key];
      });
    },
    resetWalletProviderState: () => initialState
  }
});

export const { updateWalletProviderState } = walletProviderSlice.actions;

export const NetworksConfig = (state: any) =>
  state.walletProvider.networksConfig as NetworkConfig[];

export const SelectedNetwork = (state: any) =>
  state.walletProvider.selectedNetwork as NetworkConfig;

export default walletProviderSlice.reducer;
