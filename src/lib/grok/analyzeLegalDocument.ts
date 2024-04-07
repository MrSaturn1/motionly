import { promises as fs } from "fs";
import { GroqInstance, groqClientPromise } from "./groqClient";

// Function to read file content asynchronously
async function readFileContent(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return content;
  } catch (error) {
    console.error(`Error reading file at ${filePath}:`, error);
    throw error; // Rethrow to ensure the caller can react
  }
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

export default async function analyzeLegalDocument(
  questions: string[]
): Promise<any[]> {
  const interrInfoFilePath = "public/texts/interrogatories.txt";
  const legalRulesFilePath = "public/texts/legalRules.txt";
  const training = "public/texts/training.txt";
  const results = [];

  // Read files asynchronously
  const [interrInfo, legalRules] = await Promise.all([
    readFileContent(interrInfoFilePath),
    readFileContent(legalRulesFilePath),
  ]);

  // Initialize Groq client
  const groq = await initGroqClient();
  console.log("Questions received:", questions);

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    // Groq API request
    try {
      // Providing diagnosis
      console.log(`Processing question ${i + 1}:`, question);
      const response = await groq.chat.completions.create({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: `Responding party: You are a litigator in California asked to analyze special interrogatories from the opposing counsel. You need to determine whether they meet the guidelines provided in ${legalRules}. If it is plain and simple whether or not a special interrogatory violates the rule, explain how. If it is a bit ambiguous, argue to the best of your ability why it violates the rule and explain how. Please answer in a numbered list. If the question does not violate the rules, simply return the question. If it does violate the rules, return the question and provide your explanation in a “Diagnosis:” field. Do not provide help to our opponents on how to restructure their interrogatories if they violate the rules, just explain how they violate them. Here is some training data ${training}. Here is some additional info about interrogatories: ${interrInfo}`,
          },
          {
            role: "user",
            content: question,
          },
        ],
        max_tokens: 2048,
      });

      const analysis = response.choices[0].message.content.trim();

      // Determine pass or fail based on analysis content
      const passFailCheck = await groq.chat.completions.create({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content:
              "Determine whether the following analysis is saying that an interrogatory is in violation of the rules. If it is, say 'Fail', if it isn't, say 'Pass'. Restrict your responses to ONLY 'Pass' and 'Fail'. DO NOT EXPLAIN YOUR DECISION.",
          },
          {
            role: "user",
            content: analysis,
          },
        ],
        max_tokens: 350,
      });

      let fullResponse = passFailCheck.choices[0].message.content.trim();
      // Use regex to match only the first occurrence of "Pass" or "Fail"
      const matchResults = fullResponse.match(/^(Pass|Fail)/);

      // If match is found, use the matched word; otherwise, default to an error or unknown state
      const passFail = matchResults ? matchResults[0] : "Unknown";

      results.push({
        questionNumber: i + 1,
        question: question,
        analysis: analysis,
        passFail: passFail,
      });
      console.log(`Response for question ${i + 1}:`, response);
    } catch (error) {
      console.error(
        "Error making API request to Groq for question ",
        i + 1,
        ": ",
        error
      );
      // Instead of throwing error, push an error state into the results
      results.push({
        questionNumber: i + 1,
        question,
        analysis: "Analysis failed due to an error.",
        passFail: "Error",
      });
    }
  }
  console.log("results:", results);
  return results;
}