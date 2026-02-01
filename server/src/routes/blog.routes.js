const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const {
    getBlogSummary,
    getBlogNotes,
    processBlog,
    saveNote,
    getSavedNotes,
    getSavedNoteById,
    deleteSavedNote
} = require("../controllers/blog.controller");

router.post("/summary", authMiddleware, getBlogSummary);
router.post("/notes", authMiddleware, getBlogNotes);
router.post("/process", authMiddleware, processBlog);
router.post("/save", authMiddleware, saveNote);
router.get("/saved", authMiddleware, getSavedNotes);
router.get("/saved/:id", authMiddleware, getSavedNoteById);
router.delete("/saved/:id", authMiddleware, deleteSavedNote);

module.exports = router;
