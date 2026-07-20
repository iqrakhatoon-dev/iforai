const pdfParse = require("pdf-parse");
const generateInterviewReport =
  require("../services/ai.service").generateInterviewReport;
const interviewReportModel = require("../models/interviewReport.model");
const { generateResumePdf } = require("../services/ai.service");


/**
 * @description Controller to generate interview report base on user self description, resume and job description
 */
async function generateInterviewReportController(req, res) {
  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });

  res.status(201).json({
    message: "interview report generated successfully",
    interviewReport,
  });
}

/**
 * @description Constroller to get interview report by interview id
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;
  const interviewReport = await interviewReportModel
    .findOne({
      _id: req.params.id,
      user: req.user.id,
    })
    .select("-resume -selfDescription -v");

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }

  return res.status(200).json({
    message: "Interview report retrieved successfully",
    interviewReport,
  });
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );
  res.status(200).json({
    message: "Interview reports retrieved successfully",
    interviewReports,
  });
}

/**
 * @description Controller to generate Ai Generated pdf resume
 */
async function generateResumePdfController(req, res) {
  
  const interviewReport = await interviewReportModel.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({ message: "Report not found" });
  }

  const pdfBuffer = await generateResumePdf({
    resume: interviewReport.resume,
    selfDescription: interviewReport.selfDescription,
    jobDescription: interviewReport.jobDescription,
  });


  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="iforai-resume.pdf"`,
    "Content-Length": pdfBuffer.length,
  });

  res.send(pdfBuffer);
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportController,
  generateResumePdfController
};
