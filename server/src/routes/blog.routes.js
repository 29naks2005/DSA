const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const {
    getBlogSummary,
    getBlogNotes,
    processBlog
} = require("../controllers/blog.controller");

router.post("/summary", authMiddleware, getBlogSummary);
router.post("/notes", authMiddleware, getBlogNotes);
router.post("/process", authMiddleware, processBlog);

module.exports = router;
