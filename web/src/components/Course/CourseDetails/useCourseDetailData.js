import { create } from "zustand";

const useCourseDetailData = create((set) => ({
  students: [],
  setStudents: (students) => set(() => ({ students })),
}));

export { useCourseDetailData };
