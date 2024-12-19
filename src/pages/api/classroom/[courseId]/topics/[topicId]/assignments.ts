import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { courseId, topicId } = req.query;
    const session = await getSession({ req });
  
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });
  
    const classroom = google.classroom({ version: 'v1', auth });
  
    try {
      const { data } = await classroom.courses.courseWork.list({
        courseId: courseId as string,
        courseWorkStates: ['PUBLISHED'],
      });
  
      const assignments = data.courseWork?.filter((work) => work.topicId === topicId) || [];
      res.status(200).json(assignments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch assignments', error });
    }
  }
    