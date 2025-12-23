import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const analyzeResume = createAsyncThunk(
    "ats/analyze",
    async(formData) => {
        const res = await axiosInstance.post(API_PATHS.RESUME.ANALYZE, formData);
        return res.data;
    }
);


const initialState = {
  isLoading: false,
  atsScore: null,
  strengths: [],
  gaps: [],
  fixes: [],
  error: null
};

const atsSlice = createSlice({
    name: "ats",
    initialState,
    reducers: {
        resetAnalysis: (state) => {
            state.atsScore = null;
            state.strengths = [];
            state.gaps = [];
            state.fixes = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(analyzeResume.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(analyzeResume.fulfilled, (state,action) => {
                state.isLoading = false;
                Object.assign(state, action.payload);
            })
            .addCase(analyzeResume.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export const { resetAnalysis } = atsSlice.actions;
export default atsSlice.reducer;