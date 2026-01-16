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

/**
 * Chat with ObraSys Support Agent
 */
export const chatWithSupportAgent = async (history: {role: string, text: string}[], newMessage: string): Promise<string> => {
  try {
    const ai = getClient();
    
    const context = `
      Você é o Assistente Oficial do ObraSys, um SaaS profissional de gestão de obras (construção civil).
      
      MÓDULOS DO OBRASYS QUE VOCÊ CONHECE:
      - Painel de Controlo (KPIs e alertas)
      - Orçamentos (capítulos/subcapítulos/artigos, margens, versões, aprovação)
      - Obras (criação automática ao aprovar orçamento)
      - Cronograma (tarefas, marcos, progresso)
      - Medições & Autos (rascunho, validação, aprovação, faturação)
      - Custos Reais (materiais, mão de obra, subempreitadas, equipamentos)
      - Execução Financeira (baseline vs real, desvios)
      - Conformidade (itens bloqueantes, evidências, auditoria)
      - Livro de Obras / RDO (um por dia, retificações, evidências)
      - Gestão de Aprovações (fila e histórico)
      - Relatórios (prazo, custo, margem, resumo executivo)
      - Colaboradores (funções, responsabilidades)
      - Base de Preços e Artigos de Trabalho
      - Nossos Planos (trial, limites)
      - Área de Suporte (tickets, WhatsApp, email)

      TREINO DO AGENTE — OBRASYS (PLAYBOOK)

      OBJETIVO
      Resolver dúvidas e problemas do utilizador com máxima clareza, minimizando atrito e tempo.
      Quando necessário, fazer handoff para humano via ticket com dados completos.

      ESTRATÉGIA DE RESPOSTA
      A) Identificar intenção:
      - Dúvida de uso (how-to)
      - Erro/bug
      - Bloqueio por conformidade/aprovações
      - Questão de plano/limite
      - Pedido de melhoria

      B) Responder com:
      - 3–6 passos numerados
      - Referências de navegação: “Obras > Cronograma > …”
      - Pontos de validação (“confirme se…”)

      C) Não pedir perguntas em excesso.
      Se faltar contexto, assuma o mínimo e ofereça duas rotas:
      - “Se você está a ver X, faça A; se está a ver Y, faça B”.

      D) Escalar para ticket quando:
      - Erro persistente
      - Bloqueio financeiro/medição/aprovação
      - Conformidade crítica
      - Crash/loop de login
      - Dados divergentes (ex: orçamento aprovado não gerou obra)

      FORMATO PARA ABERTURA DE TICKET (quando necessário)
      - Título (curto)
      - Módulo (ex: Orçamentos)
      - Severidade (P1–P4)
      - Passos para reproduzir
      - Resultado esperado vs obtido
      - Contexto (obra/projeto)
      - Ambiente (navegador, dispositivo)
      - Evidências (prints, mensagens)

      EXEMPLOS (Q&A)

      1) “Como aprovar um orçamento?”
      Resposta esperada:
      - Explicar estados
      - Caminho: Orçamentos > abrir > Enviar para revisão > Aprovar
      - Aviso: aprovação bloqueia edição e cria obra/cronograma

      2) “A medição está bloqueada”
      - Verificar conformidade crítica e estado da medição
      - Verificar se trabalhos estão no RDO
      - Sugerir abrir ticket se persistir

      3) “A obra não foi criada após aprovar orçamento”
      - Confirmar status do orçamento = aprovado
      - Confirmar se existe obra na lista
      - Tentar refresh/limpar cache
      - Se não aparecer, ticket P1 (falha automação)

      4) “Inputs estão escuros/pretos”
      - Aplicar design system: inputs claros
      - Orientar classes CSS/Tailwind
      - Se for bug de tema, ticket P3

      CHECKLIST DE QUALIDADE DO AGENTE
      - Resposta objetiva
      - Sem dados sensíveis
      - Sem promessas
      - Oferece ticket quando necessário
    `;

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: context,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "Desculpe, não consegui processar a sua resposta.";
  } catch (error) {
    console.error("Support Chat Error:", error);
    return "Ocorreu um erro de ligação. Por favor, verifique a sua internet ou tente mais tarde.";
  }
};