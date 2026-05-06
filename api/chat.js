export default async function handler(req, res) {
    try {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        if (req.method !== 'POST') {
            return res.status(200).json({ text: '⚠️ Erro: O pedido deve ser POST.' });
        }

        const { message } = req.body;

        if (!message) {
            return res.status(200).json({ text: '⚠️ Erro: Mensagem vazia.' });
        }

        const apiKey = process.env.GEMINI_API_KEY?.trim();

        if (!apiKey) {
            return res.status(200).json({ 
                text: "⚠️ ERRO DE CONFIGURAÇÃO NA VERCEL: A sua variável 'GEMINI_API_KEY' não existe." 
            });
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

        const combinedMessage = `INSTRUÇÕES OBRIGATÓRIAS DE COMPORTAMENTO:\n${systemPrompt}\n\nPERGUNTA DO CLIENTE:\n${message}`;

        // Link cravado na versão v1beta e modelo gemini-pro (suportado por todas as chaves)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: combinedMessage }] }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro na API da Google:", errorText);
            return res.status(200).json({ 
                text: `⚠️ A Google recusou a ligação. Detalhe técnico: ${errorText}`
            });
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Erro interno ao processar o texto da resposta.";

        return res.status(200).json({ text: aiResponse });

    } catch (error) {
        console.error("Erro Crítico Global no Servidor:", error);
        return res.status(200).json({ text: `⚠️ ERRO FATAL DE PLATAFORMA: O servidor Vercel crashou internamente. Detalhe: ${error.message}` });
    }
}
