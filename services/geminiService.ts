import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates a technical construction description based on simple keywords.
 */
export const generateTechnicalDescription = async (item: string): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `
      Atue como um Engenheiro Civil Sénior em Portugal.
      Crie uma descrição técnica detalhada para um orçamento de construção civil (Caderno de Encargos) para o seguinte item: "${item}".
      
      Regras:
      1. Use terminologia técnica adequada ao mercado português (PT-PT).
      2. Inclua referência a normas aplicáveis (Eurocódigos ou NP) se relevante.
      3. Seja conciso mas completo (máximo 4 frases).
      4. Não inclua preços.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "Descrição não disponível.";
  } catch (error) {
    console.error("Erro ao gerar descrição:", error);
    return "Erro ao conectar com a IA. Por favor, tente novamente.";
  }
};

/**
 * Structures raw field notes into a formal site report.
 */
export const structureSiteReport = async (rawNotes: string): Promise<{ summary: string; issues: string[]; weather: string }> => {
  try {
    const ai = getClient();
    const prompt = `
      Analise as seguintes notas de campo de um gestor de obra e estruture um relatório diário.
      
      Notas Brutas: "${rawNotes}"
      
      Saída desejada (JSON):
      {
        "summary": "Resumo formal das atividades realizadas (PT-PT).",
        "issues": ["Lista de problemas ou impedimentos identificados."],
        "weather": "Condições climáticas inferidas ou 'Não mencionado'."
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");

    return JSON.parse(text);
  } catch (error) {
    console.error("Erro ao estruturar relatório:", error);
    return {
      summary: "Não foi possível processar as notas.",
      issues: [],
      weather: "Desconhecido"
    };
  }
};

/**
 * Generates a checklist/breakdown for a construction task.
 */
export const generateTaskChecklist = async (taskTitle: string): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `
      Para a tarefa de construção civil: "${taskTitle}", crie uma lista de verificação (checklist) curta e prática de 3 a 5 passos para a equipa de obra.
      Responda apenas com os passos em formato de lista (bullet points).
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Erro ao gerar checklist:", error);
    return "Não foi possível gerar a sugestão.";
  }
};
