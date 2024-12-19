import { useState, useEffect } from 'react';

interface Topic {
  topicId: string;
  name: string;
}

interface CourseTopicsProps {
  courseId: string;
  topics: Topic[],
  onAssignmentClick: (assignmentId: string) => void;
}

export default function CourseTopics({ courseId, topics, onAssignmentClick }: CourseTopicsProps) {
  
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);

  

  const handleTopicClick = (topicId: string) => {
    setSelectedTopic(topicId);
    fetch(`/api/classroom/${courseId}/topics/${topicId}/assignments`)
      .then((res) => res.json())
      .then((data) => setAssignments(data));
  };

  return (
    <div style={{display: 'flex'}}>
      <div> 
        <h1 className="text-4xl mb-8 text-yellow-500">TEMAS</h1>
        <ul className="max-h-96 overflow-y-scroll p-4 bg-gray-800 rounded-md scrollbar-hide">
          {topics?.map((topic) => (
            <li className="text-2xl mb-4 text-white cursor-pointer hover:text-yellow-500" key={topic.topicId} onClick={() => handleTopicClick(topic.topicId)}>
              {topic.name}
            </li>
          ))}
        </ul>
      </div>
      {selectedTopic && (
        <div>
          <h1 className="text-4xl mb-8 text-yellow-500">TAREAS</h1>
          <ul className="max-h-96 overflow-y-scroll p-4 bg-gray-800 rounded-md scrollbar-hide">
            {assignments.map((assignment) => (
              <li className="text-2xl mb-4 text-white cursor-pointer hover:text-yellow-500" key={assignment.id} onClick={() => onAssignmentClick(assignment.id)}>
                {assignment.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}