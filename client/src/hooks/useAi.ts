import { useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { useParams } from "react-router-dom";
import { useCustomer } from "./useCustomer";
import { useUpdateCustomerMemory } from "./useUpdateCustomerMemory";

type AiInsights = {
  preferences: string | null;
  objections: string | null;
  buyingSignals: string | null;
  confidence: number;
};

export const useAi = () => {
  const { id } = useParams<{ id: string }>();
  const { customer } = useCustomer(id!);
  const { updateCustomerMemory } = useUpdateCustomerMemory();

  const [insights, setInsights] = useState<AiInsights>({
    preferences: null,
    objections: null,
    buyingSignals: null,
    confidence: 1.0,
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [lastAnalyzedCount, setLastAnalyzedCount] = useState(0);

  useEffect(() => {
    if (!customer?.interactions || customer.interactions.length === 0) return;

    if (customer.interactions.length === lastAnalyzedCount) return;

    console.log(
      `Running AI analysis for ${customer.interactions.length} interactions (was ${lastAnalyzedCount})`
    );

    const ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    });

    const runAI = async () => {
      setAiLoading(true);
      setAiError(null);

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `
You are a sales CRM assistant. Analyze ALL customer interactions chronologically and provide comprehensive, up-to-date insights.

Customer Interactions (chronological order): ${JSON.stringify(
            customer.interactions
          )}

Analyze ALL interactions and provide current status. Focus on:
- Latest preferences and requirements
- Current objections or concerns
- Most recent buying signals and next steps
- Overall deal progression

Return a JSON object with concise and short current insights:
{
  "preferences": "Current preferences including latest requirements and plan details",
  "objections": "Current objections or blockers based on all interactions", 
  "buyingSignals": "Latest buying signals and immediate next steps",
  "confidence": number (0.0 - 1.0 based on deal progression)
}
`,
        });

        if (!response || !response.text) {
          throw new Error("No response from AI model");
        }

        const text = await response.text;
       
        let jsonStr = text.trim();

        
        if (jsonStr.startsWith("```json")) {
          jsonStr = jsonStr.replace(/```json\s*/, "").replace(/\s*```$/, "");
        } else if (jsonStr.startsWith("```")) {
          jsonStr = jsonStr.replace(/```\s*/, "").replace(/\s*```$/, "");
        }

        
        const jsonStart = jsonStr.indexOf("{");
        const jsonEnd = jsonStr.lastIndexOf("}") + 1;

        if (jsonStart === -1 || jsonEnd === 0) {
          throw new Error("No valid JSON found in AI response");
        }

        const json = JSON.parse(jsonStr.slice(jsonStart, jsonEnd));

        const newInsights = {
          preferences: json.preferences ?? null,
          objections: json.objections ?? null,
          buyingSignals: json.buyingSignals ?? null,
          confidence: parseFloat(json.confidence) || 1.0,
        };

        setInsights(newInsights);

        // Update the count to prevent re-analysis
        setLastAnalyzedCount(customer.interactions.length);

        
        try {
          const dataToSend = {
            preferences:
              newInsights.preferences && newInsights.preferences.trim() !== ""
                ? newInsights.preferences
                : undefined,
            objections:
              newInsights.objections && newInsights.objections.trim() !== ""
                ? newInsights.objections
                : undefined,
            buyingSignals:
              newInsights.buyingSignals &&
              newInsights.buyingSignals.trim() !== ""
                ? newInsights.buyingSignals
                : undefined,
            confidence: newInsights.confidence,
          };

         await updateCustomerMemory(customer.id, dataToSend);
        } catch (memoryError) {
          console.error("Failed to update customer memory:", memoryError);
        }
      } catch (err: any) {
        setAiError(err.message || "Failed to generate insights");
      } finally {
        setAiLoading(false);
      }
    };

    runAI();
  }, [customer?.interactions?.length, customer?.id, updateCustomerMemory]);

  return { insights, aiLoading, aiError };
};
