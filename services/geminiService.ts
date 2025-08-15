
import { GoogleGenAI } from "@google/genai";
import type { ContactInsert } from '../types';

const API_KEY = process.env.API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!ai) {
  console.warn("API_KEY environment variable is not set. AI features will be disabled.");
}

/**
 * Extracts contacts from a given block of text, enriches them with Google Search,
 * and returns them in a structured format.
 * @param text The user-provided text block.
 * @returns A promise that resolves to an array of new contact objects.
 */
export const extractContactsFromText = async (text: string): Promise<ContactInsert[]> => {
    if (!ai) {
        throw new Error("Sorry, the AI service is not configured. Please set the API key.");
    }
    
    const prompt = `Your role is to extract contacts from text and prioritize the user's notes.

Strict rules to follow:
1.  Identify **ONLY** the people and organizations whose names are highlighted (e.g., **Person's Name**).
2.  For each highlighted entity, **capture ALL surrounding un-highlighted text** that relates to that person. This text constitutes the user's personal notes and is the absolute priority.
3.  Use Google Search **as a supplement** to find a **VERY CONCISE** professional summary (a single sentence) and **ONE or TWO key points** (current role, company). The search is secondary to the user's notes.
4.  The source text provided by the user is: """${text}"""

Output format:
Return the result **ONLY** as a valid JSON array. Each object must correspond to a highlighted entity and have EXACTLY the following structure, filling the "notes" field with the user's annotations:
{ "name": "string", "summary": "string", "key_points": ["string"], "notes": "string" }

Do not return anything other than this JSON array. No explanatory text, no \`\`\`json. Just the raw JSON.`;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { tools: [{ googleSearch: {} }], temperature: 0.1 }
        });

        // Clean the response to ensure it's valid JSON
        let jsonString = result.text.trim();
        if (jsonString.startsWith('```json')) {
            jsonString = jsonString.substring(7);
        }
        if (jsonString.endsWith('```')) {
            jsonString = jsonString.substring(0, jsonString.length - 3);
        }

        const data = JSON.parse(jsonString);

        if (!Array.isArray(data)) {
            throw new Error("The AI response was not a valid JSON array.");
        }

        // Map the parsed data to the ContactInsert structure
        const newContacts: ContactInsert[] = data.map((item: any) => ({
            name: item.name || 'Missing Name',
            summary: item.summary || 'No summary found.',
            key_points: item.key_points || [],
            priority: null,
            action_tag: null,
            notes: item.notes || null,
            contact_info: {}
        }));

        return newContacts;

    } catch (e) {
        console.error("Error processing AI response:", e);
        if (e instanceof SyntaxError) {
             throw new Error("The AI returned a malformed response. Please try again.");
        }
        throw new Error(`An error occurred while communicating with the AI: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
};