const express = require("express");
const {authUser} = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/dashboard
 * @description Generate new interview report on the basis of user sefl description, resume pdf, and job description.
 * @access private
 */

interviewRouter.post("/dashboard", authUser, upload.single("resume"), interviewController.generateInterviewReportController);


/**
 * @route GET /api/interview/dashboard/report/:id
 * @description Get interview report by id.
 * @access private
 */
interviewRouter.get("/dashboard/report/:id", authUser, interviewController.getInterviewReportByIdController);


/**
 * @route GET /api/interview/dashboard
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/dashboard", authUser, interviewController.getAllInterviewReportController)

/**
 * @route GET /api/interview/dashboard/report/:id/download
 * @description Download ai generated resume pdf
 * @access private
 */
interviewRouter.get("/dashboard/report/:id/download", authUser, interviewController.generateResumePdfController);


module.exports = interviewRouter;