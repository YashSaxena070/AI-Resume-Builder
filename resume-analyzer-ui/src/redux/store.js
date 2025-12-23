import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import resumeReducer from "./resumeSlice";
import atsReducer from "./atsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    resume: resumeReducer,
    ats: atsReducer,
  }
});

export default store;
