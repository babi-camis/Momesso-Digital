export default async function handler(req, res) {
    // 1. CORS - Permite que o seu frontend comunique com este backend
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Resposta imediata ao preflight request do navegador
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(200).json({ text: '⚠️ Erro do Servidor: Método não permitido. O pedido deve ser POST.' });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(200).json({ text: '⚠️ Erro do Servidor: Mensagem vazia recebida no backend.' });
    }

    // 2. VERIFICAÇÃO CRÍTICA DA CHAVE DE API
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        // Em vez de um erro 500 silencioso, enviamos o aviso diretamente para o chat do utilizador
        console.error("ERRO FATAL: A variável GEMINI_API_KEY não foi encontrada na Vercel.");
        return res.status(200).json({ 
            text: "⚠️ ERRO DE CONFIGURAÇÃO NA VERCEL: A sua variável 'GEMINI_API_KEY' não existe. Vá ao painel da Vercel > Settings > Environment Variables, adicione a chave, e DEPOIS vá a Deployments e clique em 'Redeploy'." 
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

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: message }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("A API do Gemini recusou o pedido:", errorText);
            
            // Retorna o erro da Google diretamente no chat para facilitar o debug
            return res.status(200).json({ 
                text: `⚠️ A Google recusou a ligação. Certifique-se de que a sua GEMINI_API_KEY está correta e não tem espaços em branco. Detalhe técnico: ${errorText}`
            });
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Erro interno ao processar o texto da resposta.";

        return res.status(200).json({ text: aiResponse });

    } catch (error) {
        console.error("Erro no Try/Catch do fetch:", error);
        return res.status(200).json({ text: "⚠️ ERRO DE REDE: O servidor Vercel falhou ao tentar estabelecer ligação com a inteligência da Google." });
    }
}
