import { GoogleGenerativeAI } from '@google/generative-ai';


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);


async function get_a_sign_prediction(sign, locale) {

    console.info(
        "PREDICTION_SIGN", sign
    )

    const model = genAI.getGenerativeModel({
        model: process.env.MODEL_NAME,
        generationConfig: {
            maxOutputTokens: 500,
            temperature: 1.0,
        },
        systemInstruction: `Você é um astrólogo ocidental. 
        Responda às perguntas do usuário sobre signos do zodíaco ocidental e 
        tópicos relacionados à astrologia. Use o símbolo do signo 
        seguido pelo nome do signo no início de cada resposta, e pule uma linha, 
        inclua uma previsão diária diretamente após sem citar 
        previsão diária. Se a pergunta não for sobre astrologia ocidental, 
        responda que você só pode responder perguntas relacionadas a esse tópico. 
        Seja breve e conciso. A resposta deve ser dada usando o idioma: ${locale}`,
    });

    const result = await model.generateContent(sign);

    console.info(
        "LLM_USAGE", result.response.usageMetadata
    )

    const response = await result.response;

    return response.text();
}


export { get_a_sign_prediction };

