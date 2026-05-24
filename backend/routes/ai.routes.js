const express = require("express");
const aiController = require("../controllers/ai.controller");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

router.post("/chat", aiController.chatWithAI);
router.post("/packing-suggestions", aiController.getPackingSuggestions);

module.exports = router;
