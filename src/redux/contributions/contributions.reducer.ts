import { ResultState } from "@store/result-status";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { set } from "date-fns";
import { TaskStatus } from "@store/model";
import { attach } from "@react-three/fiber/dist/declarations/src/core/utils";
import { TaskType } from "@api/models/task-type";

export const createLink = createAsyncThunk(
  "contributions/create",
  async (contribution, { dispatch, getState, rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return { status: "Success!", contribution };
    } catch (error) {
      return rejectWithValue({ status: "Error!", error: error.message });
    }
  }
);

// const initialContributions = [
//   {
//     status: TaskStatus.Created,
//     id: "d327e620-7cfa-48fe-8432-39cd0d67b651",
//     metadata: {
//       name: "Let's get to know you!",
//       description:
//         "We would love to know more about you. Please tell us your favourite season and upload a picture you find interesting.",
//       startDate: new Date("2024-10-05"),
//       endDate: new Date("2024-10-15"),
//       contributionType: "open",
//       properties: {
//         textRequired: true,
//         attachmentType: "image",
//         attachmentRequired: true
//       }
//     }
//   },
//   {
//     status: TaskStatus.Created,
//     id: "2a026607-ab47-4777-9f66-2b2c578c50eb",
//     metadata: {
//       name: "Introduction",
//       description:
//         "Please write a short introduction, so we can get to know you better.",
//       startDate: new Date("2024-10-05"),
//       endDate: new Date("2024-10-15"),
//       contributionType: "open",
//       properties: {
//         textRequired: true
//       }
//     }
//   },
//   {
//     status: TaskStatus.Created,
//     id: "6df121f6-32cc-4f3f-8d45-bb3a6bf8e9f8",
//     metadata: {
//       name: "A quiz about Web3",
//       description: "Take a quiz to test your knowledge about our project.",
//       startDate: new Date("2024-10-10"),
//       endDate: new Date("2024-10-11"),
//       contributionType: "quiz",
//       properties: {
//         questions: [
//           {
//             question: "What does 'decentralized' mean in the context of Web3?",
//             answers: [
//               { value: "Controlled by a single entity", correct: false },
//               { value: "Distributed across multiple nodes", correct: true },
//               { value: "Hosted on a central server", correct: false },
//               { value: "Owned by a government", correct: false }
//             ]
//           },
//           {
//             question: "What is a DAO in the context of Web3?",
//             answers: [
//               { value: "Digital Asset Organization", correct: false },
//               { value: "Decentralized Autonomous Organization", correct: true },
//               { value: "Distributed Application Operator", correct: false },
//               { value: "Digital Application Organizer", correct: false }
//             ]
//           }
//         ]
//       }
//     }
//   },
//   {
//     status: TaskStatus.Created,
//     id: "db9096cc-469b-41ef-ac0d-0cc284bd7ad5",
//     metadata: {
//       name: "Image Contest",
//       description:
//         "Upload a picture that represents how you think about our project.",
//       startDate: new Date("2024-10-20"),
//       endDate: new Date("2024-10-30"),
//       contributionType: "open",
//       properties: {
//         attachmentType: "image",
//         attachmentRequired: true,
//         textRequired: false
//       }
//     }
//   },
//   {
//     status: TaskStatus.Created,
//     id: "1781cd39-f55b-490d-8a59-cf8180186420",
//     metadata: {
//       name: "Join our Discord",
//       description: "Become a member of our Discord community.",
//       startDate: new Date("2024-11-01"),
//       endDate: new Date("2024-11-10"),
//       contributionType: "discord",
//       properties: {
//         inviteUrl: "https://discord.gg/invite"
//       }
//     }
//   },
//   {
//     status: TaskStatus.Created,
//     id: "13871cc2-fa8f-4d25-8010-c690809dfb12",
//     metadata: {
//       name: "Upload a cover letter",
//       description:
//         "Write a bit about yourself and why you want to join our project.",
//       startDate: new Date("2024-10-01"),
//       endDate: new Date("2024-11-05"),
//       contributionType: "open",
//       properties: {
//         attachmentType: "text",
//         attachmentRequired: true,
//         textRequired: true
//       }
//     }
//   }
// ];

export interface ContributionState {
  status: ResultState;
  errorMessage: string;
  selectedContribution: any;
  contributions: any[];
  taskTypes: TaskType[];
}

const initialState: ContributionState = {
  status: ResultState.Idle,
  errorMessage: "",
  selectedContribution: null,
  contributions: [],
  taskTypes: [],
};

export const contributionSlice = createSlice({
  name: "contribution",
  initialState,
  reducers: {
    resetContributionState: () => initialState,
    updateContributionState: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
    addContribution(state, action) {
      state.contributions.push(action.payload);
    },
    updateContributionById(state, action) {
      const { id, data } = action.payload;
      const index = state.contributions.findIndex(
        (contribution) => contribution?.id === id
      );
      if (index !== -1) {
        state.contributions[index] = { ...state.contributions[index], ...data };
      }
    },
    setSelectedContribution(state, action) {
      state.selectedContribution = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLink.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
      })
      .addCase(createLink.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      });
  }
});

export const {
  addContribution,
  updateContributionState,
  setSelectedContribution,
  updateContributionById
} = contributionSlice.actions;

export const ContributionStatus = (state) =>
  state.contribution.status as ResultState;
export const SelectedContribution = (state) =>
  state.contribution.selectedContribution;
export const AllContributions = (state) =>
  state.contribution.contributions as any[];
export const ContributionErrorMessage = (state) =>
  state.contribution.errorMessage as string;

export const TaskTypes = (state) => state.contribution.taskTypes as TaskType[];

export default contributionSlice.reducer;
