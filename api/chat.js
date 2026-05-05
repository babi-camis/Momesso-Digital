export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'A mensagem é obrigatória.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("ERRO CRÍTICO: GEMINI_API_KEY não foi configurada nas Environment Variables da Vercel.");
        return res.status(500).json({ error: "Erro interno de configuração do servidor." });
    }

    const systemPrompt = `Você é o Consultor Estratégico oficial da Momesso Digital. 
    Seu tom deve ser profissional, direto, sofisticado e focado em ROI (Retorno sobre Investimento).

    SOBRE A EMPRESA:
    - Fundada em 2023, sede no Brasil.
    - Especializada em Growth e Performance para empresas B2B e E-commerce.
    - Missão: Acabar com o marketing amador e gerar lucro real e previsível.

    SERVIÇOS QUE VOCÊ REPRESENTA:
    - Tráfego Pago: Gestão de Google, Meta e TikTok Ads focada em escala agressiva.
    - Desenvolvimento Web: Landing Pages de alta conversão, E-commerces e Sites Institucionais.
    - Branding Premium: Criação de identidades visuais que aumentam o valor percebido.
    - SEO e Posicionamento: Autoridade orgânica e Google Meu Negócio.
    - Social Media Estratégico: Gestão de conteúdo e comunidade.
    - Produção Audiovisual: Captação e edição estratégica de vídeos para anúncios e redes.

    DIRETRIZES DE RESPOSTA:
    - Responda sempre de forma curta e objetiva.
    - Se o cliente perguntar PREÇOS ou ORÇAMENTOS: Diga que cada estratégia é personalizada para o momento do negócio e que, para valores precisos, ele deve preencher o FORMULÁRIO no final da página para um diagnóstico gratuito.
    - Use gatilhos de prova social: Mencione que temos cases com ROI de 15.8x e escala de +410% em faturamento.
    - Se não souber responder algo técnico, recomende o diagnóstico via FORMULÁRIO.
    - Nunca prometa milagres; prometa performance baseada em dados (Data-Driven).`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: message }]
                }],
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                },
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro na API Gemini:", errorText);
            return res.status(500).json({ error: "Falha na comunicação com o motor de IA." });
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Lamento, não consegui processar a sua dúvida agora.";

        return res.status(200).json({ text: aiResponse });

    } catch (error) {
        console.error("Erro crítico no servidor de chat:", error);
        return res.status(500).json({ error: "Erro interno no processamento da mensagem." });
    }
}
