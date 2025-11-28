import { ResultState } from "@store/result-status";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { editCommitment, updateProfile, withdraw } from "@api/data.api";
import { AutOSHub } from "@api/models/hub.model";
import { CommitmentMessages } from "@utils/misc";
import { AutOSAutID } from "@api/models/aut.model";

export interface AutState {
  status: ResultState;
  errorMessage: string;
  selectedAutIDAddress: string;
  autID: AutOSAutID;
  hubs: AutOSHub[];
  selectedHubAddress: string;
  autIDs: AutOSAutID[];
}

const initialState: AutState = {
  autIDs: [],
  hubs: [],
  selectedHubAddress: "",
  autID: null,
  status: ResultState.Idle,
  errorMessage: "",
  selectedAutIDAddress: null
};

export const autSlice = createSlice({
  name: "aut",
  initialState,
  reducers: {
    resetAutState: () => initialState,
    updateAutState: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(editCommitment.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(editCommitment.fulfilled, (state, action) => {
        const { hubAddress, autIDAddress, commitment } = action.payload;
        state.status = ResultState.Idle;
        const autID = state.autIDs.find(
          (item) => item.properties.address === autIDAddress
        );
        const joinedHub = autID.properties.joinedHubs.find(
          (item) => item.hubAddress === hubAddress
        );
        joinedHub.commitment = commitment;
        const autIdData: AutOSAutID = JSON.parse(
          window.localStorage.getItem("aut-data")
        );
        autIdData.properties.joinedHubs = autID.properties.joinedHubs;
        window.localStorage.setItem("aut-data", JSON.stringify(autIdData));
      })
      .addCase(editCommitment.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      })

      // withdraw
      .addCase(withdraw.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
        // state.profiles = state.profiles.map((autID) => {
        //   autID.properties.communities = autID.properties.communities.filter(
        //     (c) => {
        //       return c.properties.address !== action.payload;
        //     }
        //   );
        //   return autID;
        // });
      })
      .addCase(withdraw.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      })
      // update
      .addCase(updateProfile.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
        state.autID = action.payload;
        state.autIDs = state.autIDs.map((autID) => {
          if (
            autID.properties.address.toLowerCase() ===
            action.payload.properties.address.toLowerCase()
          ) {
            return action.payload;
          }
          return autID;
        });
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      });
  }
});

export const { updateAutState } = autSlice.actions;

export const SelectedAutIDAddress = (state) =>
  state.aut.selectedAutIDAddress as string;

export const AutIDs = (state) => state.aut.autIDs as AutOSAutID[];
export const Hubs = (state) => state.aut.hubs as AutOSHub[];
export const SelectedAutID = (state) => state.aut.autID as AutOSAutID;
export const SelectedHubAddress = (state) =>
  state.aut.selectedHubAddress as string;

export const AutUpdateStatus = (state) => state.aut.status as ResultState;
export const UpdateErrorMessage = (state) => state.aut.errorMessage as string;

export const SelectedHub = (hubAddress: string) =>
  createSelector(SelectedAutID, (autID) => {
    return autID?.selectedHub(hubAddress);
  });

export const AutIdHubState = (hubAddress: string) =>
  createSelector(SelectedAutID, (autID) => {
    return autID.joinedHub(hubAddress);
  });

export const RoleName = (hubAddress: string) =>
  createSelector(
    SelectedHub(hubAddress),
    AutIdHubState(hubAddress),
    (hub, hubState) => {
      if (!hub || !hubState) return;
      return hub.roleName(hubState?.role as number);
    }
  );

export const CommitmentTemplate = (hubAddress: string) =>
  createSelector(AutIdHubState(hubAddress), (hubState) => {
    const commitment = hubState?.commitment as string;
    const commitmentMsg = CommitmentMessages(+commitment);
    return `${commitment}/10 - ${commitmentMsg}`;
  });

export default autSlice.reducer;
