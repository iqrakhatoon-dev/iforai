const { GoogleGenAI, Type } = require("@google/genai");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    matchScore: { type: Type.NUMBER },
    summary: { type: Type.STRING },

    technicalQuestions: {
      type: Type.ARRAY,
      minItems: 5,
      maxItems: 5,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          intention: { type: Type.STRING },
          answer: { type: Type.STRING },
        },
        required: ["question", "intention", "answer"],
        propertyOrdering: ["question", "intention", "answer"],
      },
    },

    behavioralQuestions: {
      type: Type.ARRAY,
      minItems: 3,
      maxItems: 3,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          intention: { type: Type.STRING },
          answer: { type: Type.STRING },
        },
        required: ["question", "intention", "answer"],
        propertyOrdering: ["question", "intention", "answer"],
      },
    },

    skillGaps: {
      type: Type.ARRAY,
      maxItems: 3,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
        },
        required: ["skill", "severity"],
        propertyOrdering: ["skill", "severity"],
      },
    },

    preparationPlan: {
      type: Type.ARRAY,
      minItems: 5,
      maxItems: 5,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER },
          focus: { type: Type.STRING },
        },
        required: ["day", "focus"],
        propertyOrdering: ["day", "focus"],
      },
    },
  },
  required: [
    "title",
    "matchScore",
    "summary",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
  propertyOrdering: [
    "title",
    "matchScore",
    "summary",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

async function retryWithBackoff(fn, retries = 3, delay = 2000) {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.status === 503) {
      console.warn(
        `[Gemini API 503] Server busy. Retrying in ${delay}ms... (${retries} left)`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

function truncateWords(text, limit = 30) {
  if (!text) return text;
  const words = text.trim().split(/\s+/);
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
}

function enforceLimits(report) {
  report.summary = truncateWords(report.summary, 40);

  report.technicalQuestions?.forEach((q) => {
    q.answer = truncateWords(q.answer, 30);
    q.intention = truncateWords(q.intention, 10);
  });

  report.behavioralQuestions?.forEach((q) => {
    q.answer = truncateWords(q.answer, 30);
    q.intention = truncateWords(q.intention, 10);
  });

  report.skillGaps?.forEach((s) => {
    s.skill = truncateWords(s.skill, 5);
  });

  report.preparationPlan?.forEach((p) => {
    p.focus = truncateWords(p.focus, 15);
  });

  return report;
}

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Analyze the candidate profile and generate a concise interview preparation report.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Rules (follow strictly):
- title: a short 4-6 word title based on the job description (e.g. "Full Stack Developer at Google"
- matchScore: number between 0-100.
- summary: maximum 2 sentences, under 40 words total.
- Exactly 5 technicalQuestions, each with separate question, intention, and answer fields (answer under 30 words).
- Exactly 3 behavioralQuestions, each with separate question, intention, and answer fields (answer under 30 words).
- Maximum 3 skillGaps, each with separate skill and severity fields.
- preparationPlan: exactly 5 entries, each with a numeric day field (1-5) and a focus field (under 15 words).
- Every question/answer/intention must be a SEPARATE field, never combined into one string.
- Return valid JSON only, matching the schema exactly.
  `;

  const response = await retryWithBackoff(() =>
    genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: interviewReportSchema,
      },
    }),
  );

  let report = JSON.parse(response.text);
  report = enforceLimits(report);

  return report;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const prompt = `
You are a professional resume writer and HTML/CSS expert.

Based on the candidate's existing resume, self description, and the target job description, generate an ATS-optimized resume as a complete, self-contained HTML document.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

Rules (follow strictly):
- Return ONLY raw HTML — no markdown, no backticks, no explanation.
- Use only inline CSS — no external stylesheets, no Google Fonts CDN (use system fonts only: Arial, Georgia, Times New Roman).
- Font size minimum 11px for body text.
- Page width must be exactly 794px (A4).
- Use clean, minimal, professional design — single column or two column layout.
- Prioritize ATS compatibility: no tables for layout, no images, no icons, no colored backgrounds behind text.
- Rewrite bullet points to match keywords from the job description naturally.
- Include sections: Summary, Skills, Experience/Projects, Education.
- Do NOT include any <script> tags.
- Do NOT include placeholder text — use only real candidate data.
- Return a complete HTML document starting with <!DOCTYPE html>.
  `;

  // Step 1: AI se HTML generate karwao
  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  let html = response.text;

  html = html
    .replace(/^```html\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: "domcontentloaded",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px",
    },
  });

  await browser.close();

  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
