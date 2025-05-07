import { create } from "zustand";

const useCourseStore = create((set) => ({
  courses: [],
  studentScores: {},
  activeSection: "courses",
  courseDetails: null,
  isEditing: false,

  setCourses: (courses) => set({ courses }),
  updateStudentScore: (studentId, test_id, score) =>
    set((state) => ({
      studentScores: {
        ...state.studentScores,
        [studentId]: {
          ...state.studentScores[studentId],
          [test_id]: score,
        },
      },
    })),
  setActiveSection: (section) => set({ activeSection: section }),
  setIsEditing: (editing) => set({ isEditing: editing }),
  setCourseDetails: (details) => set({ courseDetails: details }),
}));
