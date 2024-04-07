// Import the necessary utilities for GPT-3 or your chosen LLM
import { GroqInstance, groqClientPromise } from "./groqClient";

function constructMotionPrompt(results: Array<any>, user: string): string {
  const failedQuestions = results.filter(question => question.passFail === "Fail");
  let prompt = "Generate legal analysis, intended to be copied and pasted into a motion document, based on the following interrogatory questions in violation of the rules:\n\n";
  failedQuestions.forEach((item, index) => {
    prompt += `Question ${index + 1}: ${item.question}\nAnalysis: ${item.analysis}\n\n`;
  });
  prompt += "Provide a detailed explanation of the rule violations and suggest corrections.";
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

async function generateMotionText(results: Array<any>, user: string): Promise<string> {
  const groq = await initGroqClient();

  // Construct the prompt for the motion generation
  const prompt = constructMotionPrompt(results);

  // Send the prompt to the LLM
  const response = await groq.chat.completions.create({
    model: "mixtral-8x7b-32768", // Adjust the model as per your setup
    messages: [{
      role: "system",
      content: prompt,
    }],
    max_tokens: 2048,
  });

  // Extract and return the generated motion text
  return response.choices[0].message.content.trim();
}

// Example usage
// Assuming `failedQuestions` is the filtered list of failed questions from your analysis
// generateMotionText(failedQuestions).then(motionText => console.log(motionText));
