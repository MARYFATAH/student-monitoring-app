import { useCourseDetailData } from "./useCourseDetailData";

export function ScoreAssignment() {
  const students = useCourseDetailData((state) => state.students);
  console.log(students);
  return "Score Assignment";
}
