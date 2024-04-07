// Import the necessary utilities for GPT-3 or your chosen LLM
import { readFile } from "fs/promises";
import { GroqInstance, groqClientPromise } from "./groqClient";

// Function to read file content asynchronously
async function readFileContent(filePath: string): Promise<string> {
  try {
    const content = await readFile(filePath, "utf8");
    return content;
  } catch (error) {
    console.error(`Error reading file at ${filePath}:`, error);
    throw error; // Rethrow to ensure the caller can react
  }
}

async function constructMotionPrompt(
  results: Array<any>,
  user: string
): Promise<string> {
  const legalRulesFilePath = "public/data/legalRules.txt";
  const legalRules = await readFileContent(legalRulesFilePath);
  const failedQuestions = results.filter(
    (question) => question.passFail === "Fail"
  );

  let prompt: string;
  if (user === "respond") {
    prompt = `Responding: Generate legal analysis, intended to be copied and pasted into a motion document, based on the following interrogatory questions in violation of the rules:The analysis should reference ${legalRules}, specify what violation it is, cite case laws that also talk about that violation, and then explain how the same line of logic applies to the interrogatory questions at hand. \n\n. `;
  } else {
    prompt = `Propounding: Generate legal analysis, intended to be copied and pasted into a motion document, based on the following interrogatory questions which are purported to be in violation of the rules: If the question’s violation can be argued to be ambiguous, argue why it doesn’t violate ${legalRules} and should be accepted. The analysis should reference ${legalRules}, specify what violation it is, cite case laws that also talk about that violation, and then explain how the same line of logic applies to the interrogatory questions at hand. If the question is in clear violation and cannot be argued to be accepted, do not provide any analysis and move on to the next question. \n\n.`;
  }
  failedQuestions.forEach((item, index) => {
    prompt += `Question ${index + 1}: ${item.question}\nAnalysis: ${
      item.analysis
    }\n\n`;
  });
  prompt +=
    "Provide a detailed explanation of the rule violations. Do not suggest corrections.";
  return prompt;
}

// Initialize Groq Client
async function initGroqClient(): Promise<GroqInstance> {
  try {
    console.log("Initializing Groq client...");
    const groq = await groqClientPromise;
    console.log("Groq client initialized successfully.");
    return groq;
  } catch (error) {
    console.error("Error initializing OpenAI client:", error);
    throw error;
  }
}

export async function generateMotionText(
  results: Array<any>,
  user: string
): Promise<string> {
  const groq = await initGroqClient();

  // Construct the prompt for the motion generation
  const prompt = await constructMotionPrompt(results, user);

  // Send the prompt to the LLM
  const response = await groq.chat.completions.create({
    model: "mixtral-8x7b-32768", // Adjust the model as per your setup
    messages: [
      {
        role: "system",
        content: prompt,
      },
    ],
    max_tokens: 2048,
  });

  // Extract and return the generated motion text
  return response.choices[0].message.content.trim();
}

// Example usage
// Assuming `failedQuestions` is the filtered list of failed questions from your analysis
// generateMotionText(failedQuestions).then(motionText => console.log(motionText));
