import { create } from "zustand";

const useAppState = create((set) => ({
  students: [],
  setStudents: (students) => set(() => ({ students })),
  addStudent: (student) =>
    set((state) => ({ students: [...state.students, student] })),
}));

export { useAppState };
