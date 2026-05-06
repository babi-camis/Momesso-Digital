export default async function handler(req, res) {
    // 1. CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido.' });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Mensagem vazia.' });
    }

    // 2. VERIFICAÇÃO CRÍTICA DA CHAVE
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        // Se a chave não existir, ele vai avisar com um erro 500 claro
        console.error("ERRO FATAL: A variável GEMINI_API_KEY não foi encontrada na Vercel.");
        return res.status(500).json({ 
            error: "Erro de Configuração: A chave da API não está definida na Vercel." 
        });
    }

    const systemPrompt = `Você é o Consultor Estratégico da Momesso Digital...`;

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
            
            // Retornamos um erro 502 (Bad Gateway) para sabermos que a culpa foi da Google e não do nosso código
            return res.status(502).json({ 
                error: "A Google recusou a chave ou o pedido. Verifique os logs na Vercel.",
                details: errorText
            });
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Erro ao processar resposta.";

        return res.status(200).json({ text: aiResponse });

    } catch (error) {
        console.error("Erro no Try/Catch do fetch:", error);
        return res.status(500).json({ error: "O servidor crashou ao tentar falar com a Google." });
    }
}
