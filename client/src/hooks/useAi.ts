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
    
    console.log(`Running AI analysis for ${customer.interactions.length} interactions (was ${lastAnalyzedCount})`);

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
You are a sales CRM assistant. Analyze the following customer interactions and extract structured insights.

Interactions: ${JSON.stringify(customer.interactions)}

Return a JSON object with the following fields:
{
  "preferences": string,
  "objections": string,
  "buyingSignals": string,
  "confidence": number (0.0 - 1.0)
}
`,
        });

        if (!response || !response.text) {
          throw new Error("No response from AI model");
        }

        const text = await response.text;
        console.log("AI Response:", text);
        const jsonStart = text.indexOf("{");
        const json = JSON.parse(text.slice(jsonStart));
        console.log("AI Insights:", json);

        const newInsights = {
          preferences: json.preferences ?? null,
          objections: json.objections ?? null,
          buyingSignals: json.buyingSignals ?? null,
          confidence: parseFloat(json.confidence) || 1.0,
        };

        setInsights(newInsights);
        
        // Update the count to prevent re-analysis
        setLastAnalyzedCount(customer.interactions.length);

        // Automatically save insights to database
        try {          
          const dataToSend = {
            preferences: newInsights.preferences && newInsights.preferences.trim() !== '' ? newInsights.preferences : undefined,
            objections: newInsights.objections && newInsights.objections.trim() !== '' ? newInsights.objections : undefined,
            buyingSignals: newInsights.buyingSignals && newInsights.buyingSignals.trim() !== '' ? newInsights.buyingSignals : undefined,
            confidence: newInsights.confidence,
          };
          
          console.log('Data being sent to API:', dataToSend);
          
          const result = await updateCustomerMemory(customer.id, dataToSend);
          console.log("Customer memory updated successfully:", result);
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
  }, [customer?.interactions?.length, customer?.id]);

  return { insights, aiLoading, aiError };
};
