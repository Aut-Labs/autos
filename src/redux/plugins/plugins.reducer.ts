import { ResultState } from "@store/result-status";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const createPlugin = createAsyncThunk(
  "plugin/create",
  async (plugin, { dispatch, getState, rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return { status: "Success!", plugin };
    } catch (error) {
      return rejectWithValue({ status: "Error!", error: error.message });
    }
  }
);

export interface PluginState {
  status: ResultState;
  errorMessage: string;
  plugin: any;
  plugins: any[];
}

const initialState: PluginState = {
  status: ResultState.Idle,
  errorMessage: "",
  plugin: null,
  plugins: []
};

export const pluginSlice = createSlice({
  name: "plugin",
  initialState,
  reducers: {
    resetPluginState: () => initialState,
    updatePluginState: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
    addPlugin(state, action) {
      state.plugins.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPlugin.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
      })
      .addCase(createPlugin.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      });
  }
});

export const { addPlugin, updatePluginState } = pluginSlice.actions;

export const PluginStatus = (state) => state.plugin.status as ResultState;
export const PluginForAction = (state) => state.plugin.plugin;
export const AddedPlugins = (state) => state.plugin.plugins as any[];
export const PluginErrorMessage = (state) =>
  state.plugin.errorMessage as string;

export default pluginSlice.reducer;
