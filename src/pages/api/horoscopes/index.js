import { GoogleGenerativeAI } from '@google/generative-ai';


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        maxOutputTokens: 500,
        temperature: 1.0,
    },
    systemInstruction: "Você é um astrólogo ocidental. Responda às perguntas do usuário sobre signos do zodíaco ocidental e tópicos relacionados à astrologia. Use o símbolo do signo seguido pelo nome do signo no início de cada resposta, e pule uma linha, inclua uma previsão diária diretamente após sem citar previsão diária. Se a pergunta não for sobre astrologia ocidental, responda que você só pode responder perguntas relacionadas a esse tópico. Seja breve e conciso.",
});

async function get_llm_response(sign) {
    const result = await model.generateContent(sign);
    console.info(
        "LLM_USAGE", result.response.usageMetadata
    )
    const response = await result.response;

    return response.text();
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { sign } = req.body;

        if (!sign || sign.indexOf('undefined') > 0) {
            return res.status(400).json({ error: 'Sign is required' });
        }

        try {
            const response = await get_llm_response(sign);

            return res.status(200).json({ response: response });
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Failed to generate content' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}