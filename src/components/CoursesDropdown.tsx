import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Loading from './Loading';

interface Course {
  id: string;
  name: string;
}

const CourseDropdown: React.FC = () => {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!session) return;
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/classroom/courses/');
        const data = await res.json();
        setCourses(data.courses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [session]);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
    router.push(`/dashboard/course/${courseId}`);
  };

  return (
    
    <div className="flex justify-center mt-8">
      {(loading) ? <Loading /> : null}
      <div className="relative inline-block w-1/2">
        <select
          className="block w-full bg-gray-800 text-white border border-gray-800 rounded-md py-4 pl-6 pr-10 text-4xl"
          onChange={(e) => handleCourseSelect(e.target.value)}
          value={selectedCourse || ''}
        >
          <option value="" disabled>
            {loading ? 'Loading courses...' : 'Select a course'}
          </option>
          {courses?.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CourseDropdown;