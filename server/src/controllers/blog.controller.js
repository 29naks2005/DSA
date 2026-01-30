const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const cheerio = require("cheerio");
const prisma = require("../prismaClient");

/* ================= CONFIG ================= */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_NAME = "gemini-flash-latest";
const MAX_CHARS = 12000;

/* ================= UTILS ================= */

// Fetch webpage HTML
const fetchWebpage = async (url) => {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    timeout: 15000,
  });
  return data;
};

// Extract readable article content
const extractArticle = (html) => {
  const $ = cheerio.load(html);

  // Remove junk
  $("script, style, nav, footer, header, aside, iframe, noscript").remove();

  const title =
    $("h1").first().text().trim() ||
    $("title").text().trim() ||
    "Article";

  let content = "";

  // Try common article containers
  const selectors = [
    "article",
    ".article-content",
    ".post-content",
    ".entry-content",
    "main",
  ];

  for (const selector of selectors) {
    const text = $(selector).text().trim();
    if (text.length > 500) {
      content = text;
      break;
    }
  }

  // Fallback: paragraphs
  if (!content) {
    $("p").each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 40) content += text + "\n";
    });
  }

  content = content.replace(/\s+/g, " ").trim();

  if (content.length < 300) {
    throw new Error("Not enough readable content found");
  }

  return {
    title,
    content: content.slice(0, MAX_CHARS),
  };
};

/* ================= GEMINI ================= */

const runGemini = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

/* ================= PROMPTS ================= */

const summaryPrompt = (title, content) => `
You are a study assistant.

Create a CLEAN, WELL-STRUCTURED MARKDOWN summary.
Use simple language.
Do NOT add information that is not present in the article.

Formatting rules:
- Use Markdown headings (##)
- Use bullet points where appropriate
- Use **bold** only for important terms or concepts
- Keep it concise and readable

ARTICLE TITLE: "${title}"

ARTICLE CONTENT:
"""
${content}
"""

Write the summary in this exact structure:

## 📌 Overview
2–3 simple sentences explaining what this article is about.

## 🎯 Key Points
- Bullet points of the most important ideas
- Each point should be short and clear

## 💡 Main Takeaways
- What a learner should remember after reading this article
- Focus on understanding, not memorization

## 🧠 In Simple Words
Explain the topic in very easy language, as if teaching a beginner.
`;

const notesPrompt = (title, content) => `
You are a teacher creating BEAUTIFUL, EASY-TO-READ MARKDOWN study notes.

Goals:
- Make notes beginner-friendly
- Explain concepts clearly
- Avoid unnecessary details
- Use proper Markdown formatting
- Do NOT invent information

Formatting rules:
- Use Markdown headings (#, ##, ###)
- Each concept must have a heading and explanation
- Use **bold** only for key terms
- Use bullet points only when helpful
- No large paragraphs

ARTICLE TITLE: "${title}"

ARTICLE CONTENT:
"""
${content}
"""

Create notes in the following format:

# 📘 ${title}

## 🧠 Overview
Briefly explain what this topic is and why it is important.

## 📌 Key Concepts
For each major concept, use this format:

### 🔹 Concept Name
Explanation in simple language.
If needed, add 1–2 bullet points for clarity.

## 📝 Key Points
- Short bullet points of important ideas
- Easy to revise before exams or interviews

## 🔁 Quick Revision
- Very short bullets summarizing the whole topic
- Think "last-minute revision"

## ❓ Common Confusions
- Clarify things beginners often misunderstand (only if present in article)
`;

/* ================= CONTROLLERS ================= */

// Summary only
const getBlogSummary = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: "URL is required" });

    new URL(url); // validate

    const html = await fetchWebpage(url);
    const { title, content } = extractArticle(html);

    const summary = await runGemini(summaryPrompt(title, content));

    res.json({ title, url, summary });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Notes only
const getBlogNotes = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: "URL is required" });

    new URL(url);

    const html = await fetchWebpage(url);
    const { title, content } = extractArticle(html);

    const notes = await runGemini(notesPrompt(title, content));

    res.json({ title, url, notes });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Summary + Notes
const processBlog = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: "URL is required" });

    new URL(url);

    const html = await fetchWebpage(url);
    const { title, content } = extractArticle(html);

    const summary = await runGemini(summaryPrompt(title, content));
    const notes = await runGemini(notesPrompt(title, content));

    res.json({ title, url, summary, notes });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Save a note
const saveNote = async (req, res) => {
  try {
    const { articleUrl, articleTitle, content, type } = req.body;
    const userId = req.user.userId;

    if (!articleUrl || !content || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["summary", "notes"].includes(type)) {
      return res.status(400).json({ message: "Type must be 'summary' or 'notes'" });
    }

    const savedNote = await prisma.savedNote.create({
      data: {
        userId,
        articleUrl,
        articleTitle: articleTitle || "Untitled Article",
        content,
        type,
      },
    });

    res.json({ message: "Note saved successfully", data: savedNote });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all saved notes for user
const getSavedNotes = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notes = await prisma.savedNote.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        articleTitle: true,
        articleUrl: true,
        type: true,
        createdAt: true,
      },
    });

    res.json({ notes });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get single saved note by ID
const getSavedNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const note = await prisma.savedNote.findFirst({
      where: { id, userId },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ note });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a saved note
const deleteSavedNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const note = await prisma.savedNote.findFirst({
      where: { id, userId },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await prisma.savedNote.delete({ where: { id } });

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getBlogSummary,
  getBlogNotes,
  processBlog,
  saveNote,
  getSavedNotes,
  getSavedNoteById,
  deleteSavedNote,
};
