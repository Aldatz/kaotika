import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useSession } from 'next-auth/react';
import Loading from '@/components/Loading';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, SliderValue} from "@nextui-org/react";
import {Slider} from "@nextui-org/react";
import KaotikaButton from '@/components/KaotikaButton';

interface Course {
  id: string;
  name: string;
}

interface Student {
	courseId: string;
	profile: {
		id: string;
		name: {
			familyName: string;
			fullName: string;
			givenName: string;
		}
	}
	userId: string;
}

const AcolytesPage = () => {
	const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
	const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
  const [gold, setGold] = useState<number | number[]>(0);
  const [experience, setExperience] = useState<number | number[]>(0);

  useEffect(() => {
    console.log("useEffect Fetching courses");
    if (!session) return;
    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log("Fetching courses");
        const res = await fetch('/api/classroom/courses/');
        const data = await res.json();
        console.log(data);
        setCourses(data.courses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

	useEffect(() => {
		if (!session || !selectedCourse) return;
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/classroom/courses/${selectedCourse}/students`);
        const data = await res.json();
        console.log(data.students)
        setStudents(data.students);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
	}, [selectedCourse])
	
  useEffect(() => {
    if(selectedStudent) onOpen();
  }, [selectedStudent])
  

	const handleCourseSelect = (courseId: string) => {
    console.log(courseId)
    setSelectedCourse(courseId);
  };

  const handleClick = (student: Student) => {
    setSelectedStudent(student);
  }

  const handleGold = (value: SliderValue) => {
    setGold(value)
  }

  const handleExperience = (value: SliderValue) => {
    setExperience(value)
  }

  const applyBonification = async() => {
    try {
      setLoading(true);
      console.log("update gold and experience");
      const response = await fetch(`/api/player/bonification?classroom_Id=${selectedStudent?.userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  
          gold,
          experience     
        }),
      });
      const results = await response.json();
      console.log(results);
    } catch (error) {
      console.error('Failed to patch player bonification:', error);
    } finally {
      onClose();
      setLoading(false);
    } 
  }

	if (loading) {
		return <Loading />;
	}

  return (
		<Layout>
      <div className="flex justify-center mt-8">
				{!selectedCourse && (
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
					</div>)}
				{selectedCourse && (
              <>
                <Table 
                  color="warning"
                  selectionMode="none" 
                  classNames={{
                    table: "text-xl",
                    td: "text-xl",
                    tr: "text-xl",
                    tbody: "text-xl"

                  }} 
                  aria-label="Kaotika Students">
                  <TableHeader>
                    <TableColumn className="text-center">ID</TableColumn>
                    <TableColumn className="text-center">NAME</TableColumn>
										<TableColumn className="text-center">VALIDATE</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.userId}>
                        <TableCell >{student.userId}</TableCell>
                        <TableCell className="text-center"><span>{student.profile.name.fullName}</span></TableCell>
												<TableCell className="text-center">
                          <button
                            onClick={() => handleClick(student)}
                            className="bg-medievalSepia text-black text-4xl py-2 px-4 mt-10 rounded  hover:bg-darkSepia transition"
                            >
                            Apply bonification 
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
    	</div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text text-center">{selectedStudent?.profile.name.fullName}</ModalHeader>
              <ModalBody>
                <h2 className="flex flex-col gap-1 text text-center text-xl">Apply this settings?</h2>
                <Slider 
                  size='md'
                  label="Gold" 
                  step={50} 
                  maxValue={500} 
                  minValue={-500} 
                  defaultValue={0}
                  color="foreground"
                  onChangeEnd={handleGold}
                  classNames={{
                    base: "max-w-md",
                    filler: "bg-gradient-to-r from-blackSepia to-medievalSepia",
                    label: "text-2xl",
                    value: "text-3xl"
                  }}
                />
                <Slider 
                  size='md'
                  label="Experience" 
                  step={100} 
                  maxValue={500} 
                  minValue={0} 
                  defaultValue={0}
                  color="foreground"
                  onChangeEnd={handleExperience}
                  classNames={{
                    base: "max-w-md",
                    filler: "bg-gradient-to-r from-blackSepia to-medievalSepia",
                    label: "text-2xl",
                    value: "text-3xl"
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <KaotikaButton text='ACCEPT' handleClick={applyBonification} /> 
                <KaotikaButton text='CANCEL' handleClick={onClose} /> 
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Layout>
  )
}

export default AcolytesPage