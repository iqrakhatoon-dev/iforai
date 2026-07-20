import { useContext } from "react";
import { interviewContext } from "../interview.context.jsx";

export const useInterview = () => {
  const context = useContext(interviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  return context;
};