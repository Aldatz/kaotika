import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { courseId, topicId } = req.query;

    if (!courseId || !topicId) {
      console.error('Missing required parameters:', { courseId, topicId });
      return res.status(400).json({ error: 'Missing required parameters: courseId or topicId' });
    }

    const session = await getSession({ req });
  
    if (!session) {
      console.error('Unauthorized: No session found');
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });
  
    const classroom = google.classroom({ version: 'v1', auth });
  
    try {
      console.log(`Fetching coursework for courseId: ${courseId}, topicId: ${topicId}`);
      const response = await classroom.courses.courseWork.list({
        courseId: courseId as string,
        orderBy: 'dueDate asc',
      });
      console.log('Coursework response:', response.data);

      if (!response.data.courseWork) {
        console.error('No coursework found');
        return res.status(404).json({ error: 'No coursework found' });
      }

      const assignments = response.data.courseWork?.filter((work) => work.topicId === topicId) || [];

      console.log('Filtered assignments:', assignments);

      res.status(200).json(assignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      res.status(500).json({ message: 'Failed to fetch assignments', error });
    }
  }
    