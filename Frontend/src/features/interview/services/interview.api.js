import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);

  /**
   * @description Service to generate interview repost based on user self description, resume, and job description
   */
  const response = await api.post("/api/interview/dashboard", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 *@description Service to get interview report by interviewId
 */
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(
    `/api/interview/dashboard/report/${interviewId}`,
  );
  return response.data;
};

/**
 * @description Service to ge all interview reports of logged in user
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview/dashboard/");
  return response.data;
};

/**
 * @description Service to download ai generated resume pdf
 */
export const downloadResumePdf = async (interviewId) => {
  const response = await api.get(
    `/api/interview/dashboard/report/${interviewId}/download`,
    { responseType: "blob" },
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "iforai-resume.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
