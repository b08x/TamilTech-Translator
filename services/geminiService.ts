
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

async function callGemini(prompt: string, systemInstruction: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { systemInstruction },
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error(`Gemini API call failed. Details: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function getPreliminaryTranslation(englishText: string): Promise<string> {
    const systemInstruction = `You are a specialized translation agent.
Domain: Radiology IT
Audience: India-based Tamil technicians
Register: Semi-formal spoken Tamil
Your task is to translate the provided English text into Tamil.
Rules:
1. Preserve technical English terms like "PACS", "DICOM", "RIS", etc. Do not translate them.
2. Break down complex English sentences into shorter, more digestible Tamil phrases.
3. Use practical, workplace connectors and phrasing common in a technical setting.
4. The output must be ONLY the translated Tamil text. Do not add any extra explanations, introductions, or formatting.`;
    return callGemini(englishText, systemInstruction);
}

export async function getFluencyReview(draft: string, original: string): Promise<string> {
    const systemInstruction = `You are a Fluency & Authenticity Expert. Your task is to review a Tamil translation of an English technical text.
Focus ONLY on naturalness, flow, and authenticity. 
Rewrite the text to match a professional workplace Tamil tone. Prioritize fluency over literal, word-for-word translation, but do not change the core meaning.
Output ONLY your suggested improvement. No explanations.`;
    const prompt = `Original English:\n---\n${original}\n---\n\nTamil Draft:\n---\n${draft}\n---\n\nYour fluent rewrite:`;
    return callGemini(prompt, systemInstruction);
}

export async function getAccuracyReview(draft: string, original: string): Promise<string> {
    const systemInstruction = `You are an Accuracy & Logic Expert. Your task is to fact-check a Tamil translation against the original English text.
Verify every fact and technical term. Ensure logical sequences are preserved.
Identify any mistranslated concepts or inaccuracies.
Output ONLY a list of corrections or state "No accuracy issues found." No explanations.`;
    const prompt = `Original English:\n---\n${original}\n---\n\nTamil Draft:\n---\n${draft}\n---\n\nYour accuracy corrections:`;
    return callGemini(prompt, systemInstruction);
}

export async function getStyleReview(draft: string, original: string): Promise<string> {
    const systemInstruction = `You are a Style & Audience Expert. Your task is to copy-edit a Tamil translation for a specific audience.
The audience is Tamil-speaking radiology technicians in India.
Check for stylistic consistency. Ensure the technical level and vocabulary are suitable for the audience. Assess clarity and impact.
Output ONLY your suggested stylistic improvements. No explanations.`;
    const prompt = `Original English:\n---\n${original}\n---\n\nTamil Draft:\n---\n${draft}\n---\n\nYour stylistic rewrite:`;
    return callGemini(prompt, systemInstruction);
}

export async function synthesizeReviews(original: string, draft: string, fluencyReview: string, accuracyReview: string, styleReview: string): Promise<string> {
    const systemInstruction = `You are an Editor-in-Chief, an experienced technical author and linguist.
Your task is to create a final, high-quality Tamil article by synthesizing an original draft and feedback from three expert reviewers.
Carefully weigh the (sometimes conflicting) recommendations. Integrate the strongest suggestions while discarding weaker ones.
Resolve conflicts between reviewers (e.g., a fluency suggestion that harms accuracy).
Your output must be the single, coherent, and polished final Tamil version. No explanations.`;

    const prompt = `
<sources>
  <original_english>
    ${original}
  </original_english>
  <initial_tamil_draft>
    ${draft}
  </initial_tamil_draft>
  <review_fluency_expert>
    ${fluencyReview}
  </review_fluency_expert>
  <review_accuracy_expert>
    ${accuracyReview}
  </review_accuracy_expert>
  <review_style_expert>
    ${styleReview}
  </review_style_expert>
</sources>

Based on all the provided sources, produce the final, synthesized Tamil article:`;
    return callGemini(prompt, systemInstruction);
}

export async function getFinalPolish(synthesizedText: string): Promise<string> {
    const systemInstruction = `You are a meticulous proofreader. Your task is to perform one final check on a Tamil technical article.
Correct any minor remaining grammatical errors, typos, or inconsistencies.
Ensure the final text is absolutely perfect and ready for publication.
Output ONLY the final, polished text. No explanations.`;
    const prompt = `Proofread this text for final publication:\n---\n${synthesizedText}`;
    return callGemini(prompt, systemInstruction);
}
