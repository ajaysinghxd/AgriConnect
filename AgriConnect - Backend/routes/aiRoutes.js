const express = require("express");

const router = express.Router();

const {
    chatWithAI,
    getAIStatus
} = require(
    "../controllers/aiController"
);

router.get(
    "/status",
    getAIStatus
);

router.post(
    "/chat",
    chatWithAI
);

module.exports = router;
