import { useEffect } from "react";
import { useCourseDetailData } from "./useCourseDetailData";

export function CourseDetails() {
  const setStudents = useCourseDetailData((state) => state.setStudents);

  useEffect(() => {
    // todo: fetch students
    setStudents([]);
  }, [setStudents]);

  return "Course Details";
}
