const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// Home route
app.get("/", (req, res) => res.render("index"));

// DeepAI Image Generation
app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await axios.post(
      "https://api.deepai.org/api/text2img",
      { text: prompt },
      { headers: { "api-key": process.env.deepseek_API_KEY } }
    );

    const imageUrl = response.data.output_url;

    if (imageUrl) {
      res.json({ imageUrl });
    } else {
      throw new Error("Failed to generate image");
    }
  } catch (error) {
    console.error("DeepAI Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Error generating image: " + error.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
