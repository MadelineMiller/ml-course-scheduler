const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const fs = require("fs");
const csv = require("csv-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const HF_API_KEY = process.env.HF_TOKEN;

if (!HF_API_KEY) {
    console.error("Hugging Face API token is not set in .env file.");
    process.exit(1);
}

// Variable to store CSV data in memory
let csvData = [];

// Load CSV data into memory on server startup
function loadCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (error) => reject(error));
    });
}

// Text generation function
async function generateText(prompt) {
    try {
        console.log("Generating text...");
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/google/flan-t5-large",
            {
                inputs: prompt,
                parameters: {
                    max_new_tokens: 250,
                    temperature: 1.2,
                    top_p: 0.9,
                    repetition_penalty: 3.2,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                },
            }
        );
        console.log("Generated text:", response.data);
        return response.data || "No text generated.";
    } catch (error) {
        console.error(
            "Error generating text:",
            error.response?.data || error.message
        );
        return "Error in generation.";
    }
}

// Endpoint to recommend classes
app.post("/recommend-classes", async (req, res) => {
    try {
        // Extract tags from the request body
        const { tags } = req.body; 
        console.log("Selected tags:", tags);

        // Prepare class information for the prompt
        const classDetails = csvData
            .map(
                (row, index) =>
                    `${index + 1}. ${row.class_name} by ${
                        row.professor_name
                    } - Tags: ${row.tags}`
            )
            .slice(0, 20) // Include the first 20 rows as an example
            .join("\n");

        const prompt = `
Recommend a set of 12 unique classes for a student at UC Santa Cruz based on the following criteria:
1. Ensure diversity in subjects.
2. Prioritize classes taught by professors with high ratings.
3. Select a mix of introductory, intermediate, and advanced-level courses.

Here is the list of available classes:
${classDetails}

Respond with a list of 12 classes, each on a new line. Use the class code. For example:AM100, AM112.
        `;

        console.log("Generated Prompt:", prompt);

        const generatedText = await generateText(prompt);
        res.send(generatedText);
    } catch (error) {
        console.error("Error processing recommendation:", error.message);
        res.status(500).send("Error generating recommendations.");
    }
});

// Load CSV data before starting the server
const csvFilePath = "./data/professors_with_ids_and_tags.csv";

loadCSV(csvFilePath)
    .then((data) => {
        csvData = data; // Store the data in memory
        console.log("CSV data loaded successfully.");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error loading CSV file:", error.message);
        process.exit(1);
    });
