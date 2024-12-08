import { get_a_sign_prediction } from '@/utils/HoroscopeAgent';
import { getSignFromId } from '@/utils/Signs';


export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { id_sign } = req.query;

        if (!id_sign || id_sign.indexOf('undefined') > 0) {
            return res.status(400).json({ error: 'Sign id is required' });
        }
        console.log("sign" + id_sign)
        const sign = getSignFromId(id_sign);

        if (!sign) {
            return res.status(400).json({ error: 'Sign id is invalid!' });
        }

        try {
            const response = await get_a_sign_prediction(sign.name);

            return res.status(200).json({ response: response });
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Failed to generate content' });
        }
    }
    
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}