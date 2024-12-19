import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { accessToken } = req.body;
  
  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const classroom = google.classroom({ version: 'v1', auth });

  try {
    const userProfile = await classroom.userProfiles.get({
      userId: 'me',
    });

    res.status(200).json(userProfile.data);
  } catch (error) {
    console.error('Error fetching Classroom user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
}