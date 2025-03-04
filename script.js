const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Set EJS as the template engine
app.set("view engine", "ejs");

// Home routes
app.get("/", (req, res) => res.render("index"));

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Route to generate images
app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    console.log("Generating image for:", prompt);

    // Generate image using Gemini API
    const result = await model.generateContent(prompt);
    const imageUrl = result.response.text(); // Adjust this if Gemini returns image URLs differently

    if (imageUrl) {
      res.json({ imageUrl });
    } else {
      throw new Error("No image returned from API");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Error generating image" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
