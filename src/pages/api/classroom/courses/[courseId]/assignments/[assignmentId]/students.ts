import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Handler start');

  const session = await getSession({ req });

  if (!session) {
    console.log('No session found');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { courseId, assignmentId } = req.query;

  if (!courseId || !assignmentId) {
    console.log('Missing parameters:', { courseId, assignmentId });
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });

  const classroom = google.classroom({ version: 'v1', auth });

  try {
    console.log('Fetching student submissions', { courseId, assignmentId }); 
    const submissionsRes = await classroom.courses.courseWork.studentSubmissions.list({
      courseId: courseId as string,
      courseWorkId: assignmentId as string
    });
    console.log('Submissions response:', submissionsRes.data);
    const submissions = submissionsRes.data.studentSubmissions || [];

    const grades = await Promise.all(
      submissions.map(async (submission) => {
        const studentRes = await classroom.userProfiles.get({
          userId: submission.userId as string
        });
        const student = studentRes.data;
        console.log('Student data', student);
        return {
          classroom_Id: student.id,
          studentName: `${student.name?.fullName}`,
          grade: submission.assignedGrade,
          state: submission.state,
          courseWorkId: submission.courseWorkId
        };
      })
    );
    
    res.status(200).json(grades);
  } catch (error) {
    console.error('Failed to fetch student grades:', error);
    res.status(500).json({ error: 'Failed to fetch student grades' });
  }
}