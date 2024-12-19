import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("Access Token on classroom file:", session.accessToken);

  const response = await fetch("https://classroom.googleapis.com/v1/courses", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: "Failed to fetch courses" });
  }

  const data = await response.json();
  console.log("Courses Data:", data);
  return res.status(200).json(data);
}