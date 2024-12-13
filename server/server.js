const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const fs = require("fs");
const csv = require("csv-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const OpenAI = require("openai");
const openai = new OpenAI();

app.use(cors());
app.use(express.json());

const HF_API_KEY = process.env.HF_TOKEN;

if (!HF_API_KEY) {
    console.error("Hugging Face API token is not set in .env file.");
    process.exit(1);
}
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    console.error("OpenAI API token is not set in .env file.");
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

function build_prompt() {
    // Prepare class information for the prompt
    const classDetails = csvData
        .map(
            (row) =>
                `Class: ${row.class_name}, Professor: ${row.professor_name}, Tags: ${row.tags}`
        )
        .join("\n");

    const prompt = `Use the following professor data to create a sample 4 year schedule in a table format for a Computer 
                    Science major at UCSC. Each class should have a matching professor that teaches that class and in that 
                    quarter (Fall, Winter, or Spring) or say “TBD” if it is unknown. The schedule should contain which classes 
                    to take in each of the 12 total quarters. Do not repeat classes. Ensure all major requirements are met and 
                    take prerequisites into account. 
                    Take into account the following student preferences about the professors (avoid negative tags and emphasize 
                    positive tags when choosing classes): Respected, Caring, Extra Credit.

                    Here is an example schedule which includes all the required classes (including 3 elective classes and 1 capstone class) 
                    Example Schedule: Fall	['MATH 19A', 'CSE 20'] 
                    Winter	['MATH 19B', 'AM 10'] 
                    Spring	['MATH 23A', 'CSE 30'] 
                    Fall	['CSE 16', 'CSE 12'] 
                    Winter	['CSE 13S', 'ECE 30'] 
                    Spring	['CSE 40', 'CSE 101'] 
                    Fall	['CSE 107', 'CSE 120'] 
                    Winter	['CSE 130', 'CSE 101M'] 
                    Spring	['CSE 103', 'CSE 195'] 
                    Fall	['ELECTIVE', 'CSE 114A'] 
                    Winter	['ELECTIVE'] 
                    Spring	['ELECTIVE', 'CAPSTONE'] 
                    Generate a new schedule with exactly 12 quarters with all the required classes in a table format with the following columns: Quarter number (1-12), Class1, Professor (rating), Class2, Professor (rating)
                    Class and Professor Data: 

                    ${classDetails}
                    
                    
                    Generate a new schedule with exactly 12 quarters with all the required classes in a table format with the following columns: Quarter number (1-12), Class1, Professor (rating), Class2, Professor (rating)
                    New Schedule: `;

    console.log("------ class details ------ ");
    console.log(classDetails);
    return prompt;
    // return "Write a haiku about recursion in programming.";
}

// Text generation function
// async function generateText(prompt) {
//     try {
//         console.log("Generating text...");
//         const response = await axios.post(
//             "https://api-inference.huggingface.co/models/google/flan-t5-large",
//             {
//                 inputs: prompt,
//                 parameters: {
//                     max_new_tokens: 250,
//                     temperature: 1.2,
//                     top_p: 0.9,
//                     repetition_penalty: 3.2,
//                 },
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${HF_API_KEY}`,
//                 },
//             }
//         );
//         console.log("Generated text:", response.data);
//         return response.data || "No text generated.";
//     } catch (error) {
//         console.error(
//             "Error generating text:",
//             error.response?.data || error.message
//         );
//         return "Error in generation.";
//     }
// }

// Endpoint to recommend classes

// OpenAI text generation function
async function openai_generate() {
    const prompt = build_prompt();
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    return completion.choices[0].message.content;
}

// API ENDPOINT FOR SENDING BACK RECOMMENDED CLASSES
app.post("/recommend-classes", async (req, res) => {
    try {
        // Extract tags from the request body
        const { tags } = req.body;
        console.log("Selected tags:", tags);

        const generatedText = await openai_generate(tags);
        console.log("------------ GENERATION RESULT ------------");
        console.log(generatedText);

        // This helps me not get errors during this process.
        // const generatedText =
        //     "['MATH 19A', 'CSE20', 'MATH 19B', 'AM10', 'MATH 23A', 'CSE30', 'CSE16', 'CSE12', 'CSE13S','ECE30', 'CSE40', ' CSE101', 'CSE107', 'CSE120', 'CSE130', 'CSE101M', 'CSE120', 'CSE195','CSE114A', 'CSE140', ' CSE143', 'CSE185E', 'ELECTIVE', 'CAPSTONE']";
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
