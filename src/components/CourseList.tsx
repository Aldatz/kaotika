import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
interface Course {
  id: string;
  name: string;
}
interface CourseListProps {
  onSelectCourse: (courseId: string) => void;
}

export default function CourseList({ onSelectCourse }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/classroom/courses')
        const data = await response.json();
        setCourses(data.courses);
      } catch (err) {
        console.error(`Course list error: ${err}`);
      } finally {
        setLoading(false);
      }  
    })();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h2 className="text-center text-4xl mb-8 text-white">Classroom Courses</h2>
      <ul className="grid grid-cols-1 gap-4">
        {courses.map((course) => (
          <li key={course.id} className="border rounded-lg p-4" onClick={() => onSelectCourse(course.id)}>
            <div className="flex justify-between items-center">
              <span className="text-3xl mb-8 text-white">{course.name}</span> 
            </div> 
          </li>
        ))}
      </ul>
    </div>
  );
}