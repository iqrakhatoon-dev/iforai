import { createContext, useState } from "react";
import {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReports,
  downloadResumePdf,
} from "./services/interview.api.js";

export const interviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
      setCurrentReport(data.interviewReport);
      setReports((prev) => [data.interviewReport, ...prev]);
      return data.interviewReport;
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReports = async () => {
    setLoading(true);
    try {
      const data = await getAllInterviewReports();
      setReports(data.interviewReports);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReportById = async (id) => {
    setLoading(true);
    try {
      const data = await getInterviewReportById(id);
      setCurrentReport(data.interviewReport);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async (id) => {
  setLoading(true);
  setError(null);
  try {
    await downloadResumePdf(id);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to download PDF.");
  } finally {
    setLoading(false);
  }
};

  return (
    <interviewContext.Provider
      value={{
        reports,
        currentReport,
        loading,
        error,
        generateReport,
        fetchAllReports,
        fetchReportById,
        downloadPdf,
      }}
    >
      {children}
    </interviewContext.Provider>
  );
};