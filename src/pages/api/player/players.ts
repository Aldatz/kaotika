import { SERVER_URL } from '@/constants/constants';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const response = await fetch(`${SERVER_URL}/players`);

		if (!response.ok) {
			throw new Error('Failed to get players');
		}

		const result = await response.json();
		console.log(result);
		res.status(200).json(result);
	} catch (error) {
		console.error('Failed to get players:', error);
		res.status(500).json({ error: 'Failed to get players' });
	}
}