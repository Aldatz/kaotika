import { NextApiRequest, NextApiResponse } from 'next';
import { SERVER_URL } from '@/constants/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	
	try {
		const response = await fetch(`${SERVER_URL}/players/hall/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		});
		const data = await response.json();
		if (response.status === 200) {
		return res.status(200).json(data);
		}
		if (response.status === 404) {
		return res.status(404).json(data);
		}
	} catch (error) {
		console.error('Server error on Fetching Hall of Fame:', error);
		res.status(500).json({ error: 'Server error on Fetching Hall of Fame' });
	}
}