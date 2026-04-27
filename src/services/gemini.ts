import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface MaturityScore {
  area: string;
  score: number;
}

export interface AnalysisReport {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  roadmap: {
    month: string;
    actions: string[];
  }[];
  quickWins: string[];
}

export async function analyzeMaturity(scores: MaturityScore[], confidence: 'Low' | 'Medium' | 'High'): Promise<AnalysisReport> {
  const scoresText = scores.map(s => `${s.area}: ${s.score}/5`).join("\n");
  
  const sortedScores = [...scores].sort((a, b) => a.score - b.score);
  const bottom3 = sortedScores.slice(0, 3).map(s => s.area).join(", ");
  const top3 = sortedScores.slice(-3).reverse().map(s => s.area).join(", ");

  const prompt = `
    You are a Data Management Expert based on DAMA-DMBOK principles.
    Analyze the following organization's data maturity scores (on a scale of 1-5):
    
    ${scoresText}

    User's Reported Confidence in their assessment: ${confidence}

    SCORING INTERPRETATION GUIDELINES:
    1 = No formal processes (Ad Hoc)
    2 = Informal / inconsistent practices (Developing)
    3 = Defined and documented processes (Defined)
    4 = Measured and controlled processes (Managed)
    5 = Optimized, automated, continuously improving (Optimized)

    ANALYSIS RULES:
    - Interpret the scores based on the maturity levels above.
    - Check for inconsistencies between related domains (e.g., High Analytics but Low Data Quality).
    - If inconsistencies are detected, highlight them as potential misalignment or scoring inaccuracy risks.
    - Compare related domains:
       - Governance <-> Security
       - Quality <-> Analytics
       - Architecture <-> Integration
    - Use these relationships to identify critical gaps.
    - Adjust recommendations based on Confidence Level:
       - Low: Suggest validation steps, caution, and verify scoring accuracy.
       - Medium: Provide balanced, standard recommendations.
       - High: Provide more assertive, direct, and detailed strategy.

    PRIORITIZATION:
    - Top 3 Lowest Scoring Areas: ${bottom3} (Prioritize weaknesses and risks here)
    - Top 3 Highest Scoring Areas: ${top3} (Highlight strengths here)

    Please provide:
    1. Overall maturity summary (business-friendly, reflecting confidence level)
    2. Strengths (top 2-3 areas)
    3. Weaknesses (bottom 2-3 areas, prioritizing relationships/inconsistencies)
    4. Business risks (specifically referencing domain relationships)
    5. A 6-month improvement roadmap
    6. Quick wins (low effort, high impact)

    Guidelines:
    - Avoid generic recommendations.
    - Use actual score values and domain relationships.
    - Non-technical (business-friendly) tone.
    
    Respond in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                month: { type: Type.STRING },
                actions: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["month", "actions"]
            }
          },
          quickWins: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["summary", "strengths", "weaknesses", "risks", "roadmap", "quickWins"]
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to generate report. Please try again.");
  }
}
