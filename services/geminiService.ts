
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectParams, BudgetResult } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export async function generateAIBudget(params: ProjectParams): Promise<BudgetResult | null> {
  const ai = getAIClient();
  if (!ai) return null;

  try {
    const prompt = `
      Act as a Senior Quantity Surveyor and Construction Cost Estimator.
      Project: ${params.name}
      Location: ${params.location}
      
      CORE CALCULATION RULES:
      1. DEMOLITION COSTS: Must be calculated based ONLY on existing square footage (${params.existingSqft} SF building, ${params.existingSiteSqft} SF site). 
      2. NEW CONSTRUCTION: Must be calculated based on proposed square footage (${params.proposedSqft} SF building, ${params.siteSqft} SF site).
      
      SCOPE SELECTION (CRITICAL: ONLY include categories in the response for the items listed as TRUE below):
      - Demolition Selected: ${params.includeDemolition} (Types: ${params.demolitionTypes.join(', ')})
      - Site Prep Selected: ${params.includeSitePrep} (Types: ${params.sitePrepTypes.join(', ')})
      - Structural Shell Selected: ${params.includeStructure} (Standard: ${params.shellDelivery})
      - Interior Fit-out Selected: ${params.includeInterior}
      - Custom Scope/Details: ${params.includeCustomScope ? params.customScope : 'None'}
      
      Instructions for Output:
      1. ONLY return BudgetCategories for the scopes selected above.
      2. If 'Structural Shell' is FALSE, do NOT include a Shell Construction category.
      3. If 'Interior Fit-out' is FALSE, do NOT include an Interior Fit-out category.
      4. If 'Custom Scope' is provided, incorporate the costs for those specific items into the budget as appropriate categories or line items.
      5. Calculate costs based on local material/labor rates for ${params.location}.
      6. Use unique string IDs for all categories and items.
      7. Ensure every line item has an "included" property set to true by default.
      
      EXPERT ADVICE & ADDITIONAL SCOPES:
      - In the "expertAdvice" field, provide a high-level summary of the overall budget health.
      - In the "recommendedScopes" field, provide an array of 3-5 specific project components that are NOT currently in the budget but likely necessary. 
      - For each recommended scope, include:
        - name: Clear name of the scope item.
        - importance: Why it is critical for this project type and location.
        - suggestedCostRange: A placeholder estimate (e.g., "$5k - $15k" or "2-3% of Total").
      
      Return as strictly JSON matching the BudgetResult interface.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a professional estimator. Be precise. ONLY include categories that match the user's selected scope. If a scope is not selected, do not generate a category for it. Always return valid JSON. Ensure 'recommendedScopes' is populated with valuable additions relevant to the specific project parameters.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalCost: { type: Type.NUMBER },
            siteCostPerSqFt: { type: Type.NUMBER },
            shellCostPerSqFt: { type: Type.NUMBER },
            costIndex: { type: Type.NUMBER },
            categories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  percentage: { type: Type.NUMBER },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        amount: { type: Type.NUMBER },
                        included: { type: Type.BOOLEAN }
                      },
                      required: ["id", "name", "amount", "included"]
                    }
                  }
                },
                required: ["id", "name", "amount", "percentage", "items"]
              }
            },
            expertAdvice: { type: Type.STRING },
            recommendedScopes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  suggestedCostRange: { type: Type.STRING }
                },
                required: ["name", "importance", "suggestedCostRange"]
              }
            },
            riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            timelineWeeks: { type: Type.NUMBER },
            neededFiles: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["totalCost", "siteCostPerSqFt", "shellCostPerSqFt", "costIndex", "categories", "expertAdvice", "recommendedScopes", "riskFactors", "timelineWeeks"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Estimation Error:", error);
    return null;
  }
}
