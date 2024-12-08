import { listSigns } from '@/utils/Signs';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const allSigns = listSigns();
            return res.status(200).json({ data: { 'signs': allSigns} });
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Failed to get signs' });
        }
    }

    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}