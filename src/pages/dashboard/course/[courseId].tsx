import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import Loading from '../../../components/Loading';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/table";
import { Player } from '@/_common/interfaces/Player';
import { Task } from '@/_common/interfaces/Task';
import KaotikaButton from '@/components/KaotikaButton';

interface Assignment {
  courseWorkName: string;
  maxPoints: number;
}

interface Student {
  classroom_Id: string;
  studentName: string;
  grade: number;
  state: string;
  courseWorkId: string;
  courseWorkName: string;
  maxPoints: number;
}


class Consolidated {
  classroomId;
  courseWorkName;
  selectedAssignment;
  grade;
  maxPoints;
  constructor(classroom_Id:string, courseWorkName:string, selectedAssignment:string, grade:number, maxPoints:number){
    this.classroomId = classroom_Id;
    this.courseWorkName = courseWorkName;
    this.selectedAssignment = selectedAssignment;
    this.grade = grade;
    this.maxPoints = maxPoints;
  }
}

const CoursePage: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { courseId } = router.query;
    const [course, setCourse] = useState<any>(null);
    const [topics, setTopics] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [studentsGrades, setStudentsGrades] = useState<any[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/'); 
      return;
    }

    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const [courseRes, topicsRes] = await Promise.all([
          fetch(`/api/classroom/courses/${courseId}`),
          fetch(`/api/classroom/courses/${courseId}/topics`)
        ]);

        const courseData = await courseRes.json();
        const topicsData = await topicsRes.json();

        setCourse(courseData.course);
        setTopics(topicsData.topics);
      } catch (error) {
        console.error('Failed to fetch course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [session, status, router, courseId]);

  const fetchConsolidatedGrades = async (consolidated: Consolidated[]) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/classroom/consolidated`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  
          consolidated     
        }),
      });
      const results = await response.json();
      console.log(results.data);
      setStateToDone(results.data)
      
    } catch (error) {
      console.error('Failed to fetch consolidated grades:', error);
    } finally {
      setLoading(false);
    }
  };
 
  const setStateToDone = (classroomIds: string[]) => {
    console.log(studentsGrades);
    const result = studentsGrades.map((student) =>
      classroomIds.includes(student.classroom_Id) ? { ...student, state: "DONE" } : student
    );
    console.log(result);
    setStudentsGrades(result);
  };
  
  const handleTopicSelect = async (topicId: string) => {
    setSelectedTopic(topicId);
    setLoading(true);
    try {
      const res = await fetch(`/api/classroom/courses/${courseId}/topics/${topicId}/assignments`);
      const assignments = await res.json();
      console.log('Assignments:', assignments);
      setAssignments(assignments);
      setSelectedAssignment(null);  // Clear selected assignment when topic changes
      setStudentsGrades([]);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentSelect = async (assignmentId: string) => {
    setSelectedAssignment(assignmentId);
    const currentAssignment = await assignments.filter(assignement => assignement.id === assignmentId)[0];
    setLoading(true);
    try {                       
      const currentTopicStudents = await fetch(`/api/classroom/courses/${courseId}/assignments/${assignmentId}/students`);
      const currentPlayers = await fetch('/api/player/players');
      const topicStudents = await currentTopicStudents.json();
      const topicPlayers = await currentPlayers.json();
      const pendingStudents = removeStudentsWithTaskEvaluated(topicStudents, topicPlayers.data, assignmentId);


      pendingStudents.forEach((student) => {
        student.courseWorkName = currentAssignment.title
        student.maxPoints = currentAssignment.maxPoints
      });
      console.log(pendingStudents);
      setStudentsGrades(pendingStudents);
    } catch (error) {
      console.error('Failed to fetch student grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeStudentsWithTaskEvaluated = (students: Student[], players: Player[], taskId: string): Student[] => {
    const classroomIdsToRemove: string[] = players
        .flatMap((player: Player) => 
            player.tasks
                .filter((task: Task) => task.selectedAssignment === taskId)
                .map((task: Task) => task.classroomId)
        );
    return students.filter(student => !classroomIdsToRemove.includes(student.classroom_Id));
  }

  const handleClick = (classroom_Id:string, courseWorkName:string, grade:number, maxPoints:number) => {
    const consolidated: Consolidated[] = [];
    consolidated.push(new Consolidated(classroom_Id, courseWorkName, selectedAssignment!, grade, maxPoints));
    fetchConsolidatedGrades(consolidated);
  } 

  const handleClickAllGrades = () => {
    
    const consolidated: Consolidated[] = [];
    studentsGrades.map(student => {
      if(student.state === 'RETURNED') {
        consolidated.push(new Consolidated(student.classroom_Id, student.courseWorkName, selectedAssignment!, student.grade, student.maxPoints));
      }
    });
    fetchConsolidatedGrades(consolidated);
  }

  if (!session || !course) return null;

  return (
    <Layout>
      {(loading) ? <Loading /> : null}
      <div className="mt-8 text-center">
        <h1 className="text-4xl mb-4">{course.name}</h1>
        <div className="flex">
          <div className="w-1/2 p-4">
            <h2 className="text-4xl mb-4">Topics</h2>        
                <select
                    className="block w-full bg-gray-800 text-white border py-4 pl-6 pr-10 text-3xl"
                    onChange={(e) => handleTopicSelect(e.target.value)}
                    value={selectedTopic || ''}
                >
                <option value="" disabled>
                    {loading ? 'Loading topics...' : 'Select a topic'}
                </option>
                {topics.map((topic) => (
                    <option key={topic.topicId} value={topic.topicId}>
                    {topic.name}
                    </option>
                ))}
                </select>
          </div>
          <div className="w-1/2 p-4">
            {selectedTopic && (
              <>
                <h2 className="text-4xl mb-4">Assignments</h2>
                <select
                    className="block w-full bg-gray-800 text-white border py-4 pl-6 pr-10 text-3xl"
                    onChange={(e) => handleAssignmentSelect(e.target.value)}
                    value={selectedAssignment || ''}
                >
                <option value="" disabled>
                    {loading ? 'Loading assignments...' : 'Select a assignment'}
                </option>
                {assignments
                  .filter((assignment) => assignment.maxPoints) 
                  .map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.title} - Max Points: {assignment.maxPoints}
                    </option>
                       
                  ))}
                </select> 
              </>
            )}
          </div>
        </div>
        <div className="flex">
          <div className="w-full p-4">
          {selectedAssignment &&  
            studentsGrades.length > 0 ?
              <>
                <h2 className="text-3xl mb-4">Student Grades</h2>
                <Table 
                  color="warning"
                  selectionMode="single" 
                  classNames={{
                    table: "text-xl",
                    td: "text-xl",
                    tr: "text-xl",
                    tbody: "text-xl"

                  }} 
                  aria-label="Kaotika Students">
                  <TableHeader>
                    <TableColumn className="mb-4 text-center">ID</TableColumn>
                    <TableColumn className="mb-4 text-center">NAME</TableColumn>
                    <TableColumn className="mb-4 text-center">TASK</TableColumn>
                    <TableColumn className="mb-4 text-center">POINTS</TableColumn>
                    <TableColumn className="mb-4 text-center">STATUS</TableColumn>
                    <TableColumn className="mb-4 text-center">PENDING</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {studentsGrades.map((grade,index) => (
                      <TableRow key={index}>
                        <TableCell >{grade.classroom_Id}</TableCell>
                        <TableCell ><span>{grade.studentName}</span></TableCell>
                        <TableCell className="text-center">{grade.courseWorkName}</TableCell>
                        <TableCell className="text-center">{grade.grade} / {grade.maxPoints}</TableCell>
                        <TableCell className="text-center"><span className="mb-4 text-center">{grade.state}</span></TableCell>
                        <TableCell className="text-center">{grade.state === "RETURNED" ? <KaotikaButton  handleClick={() => handleClick(grade.classroom_Id, grade.courseWorkName, grade.grade, grade.maxPoints)} text="SEND" /> : grade.state === "DONE" ? <span className="mb-4 text-green-500">NO</span> : <span className="mb-4 text-red-500">PENDING</span>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {studentsGrades.some((obj) => obj.state === "RETURNED") ? <KaotikaButton  handleClick={() => handleClickAllGrades()} text="SEND ALL" /> :null}
                 
              </>
              : <h2 className="text-3xl mb-4">All done.</h2> }
            
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoursePage;