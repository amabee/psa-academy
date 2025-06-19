import { create } from "zustand";

const createActions = (set) => ({
  setLessons: (lessons) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        lessons,
      },
    })),

  // Add tests-related actions
  setTests: (tests) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        tests,
      },
    })),

  addTest: ({ lessonIndex, topicIndex, test }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        lessons: state.courseEditor.lessons.map((lesson, lIndex) => {
          if (lIndex === lessonIndex) {
            return {
              ...lesson,
              topics: lesson.topics.map((topic, tIndex) => {
                if (tIndex === topicIndex) {
                  return {
                    ...topic,
                    tests: [...(topic.tests || []), test],
                  };
                }
                return topic;
              }),
            };
          }
          return lesson;
        }),
      },
    })),

  // Add course-level test management
  addCourseTest: (test) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        tests: [...(state.courseEditor.tests || []), test],
      },
    })),

  updateCourseTest: (testId, updatedTest) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        tests: (state.courseEditor.tests || []).map((test) =>
          test.test_id === testId ? { ...test, ...updatedTest } : test
        ),
      },
    })),

  deleteCourseTest: (testId) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        tests: (state.courseEditor.tests || []).filter(
          (test) => test.test_id !== testId
        ),
      },
    })),

  openTopicModal: ({ lessonIndex, topicIndex }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        isTopicModalOpen: true,
        selectedLessonIndex: lessonIndex,
        selectedTopicIndex: topicIndex,
      },
    })),

  closeTopicModal: () =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        isTopicModalOpen: false,
        selectedLessonIndex: null,
        selectedTopicIndex: null,
      },
    })),

  openLessonModal: ({ lessonIndex }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        isLessonModalOpen: true,
        selectedLessonIndex: lessonIndex,
      },
    })),

  closeLessonModal: () =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        isLessonModalOpen: false,
        selectedLessonIndex: null,
      },
    })),

  openTestModal: ({ lessonIndex, topicIndex, testIndex }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        isTestModalOpen: true,
        selectedLessonIndex: lessonIndex,
        selectedTopicIndex: topicIndex,
        selectedTestIndex: testIndex,
      },
    })),

  closeTestModal: () =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        isTestModalOpen: false,
        selectedLessonIndex: null,
        selectedTopicIndex: null,
        selectedTestIndex: null,
      },
    })),

  openDeletionModal: ({ lessonIndex }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        isDeletionModalOpen: true,
        selectedLessonIndex: lessonIndex,
      },
    })),

  closeDeletionModal: () =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        isDeletionModalOpen: false,
        selectedLessonIndex: null,
      },
    })),

  setGeneratedLessonID: (lessonID) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        generatedLessonID: lessonID,
      },
    })),

  addLesson: (lesson) => {
    set((state) => {
      const finalLesson = lesson.lesson_id
        ? lesson
        : { ...lesson, lesson_id: state.courseEditor.generatedLessonID };

      return {
        courseEditor: {
          ...state.courseEditor,
          lessons: [...state.courseEditor.lessons, finalLesson],
          generatedLessonID: null,
        },
      };
    });
  },

  editLesson: ({ index, lesson }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        lessons: state.courseEditor.lessons.map((l, i) =>
          i === index ? lesson : l
        ),
      },
    })),

  deleteLesson: () =>
    set((state) => {
      const { selectedLessonIndex, lessons } = state.courseEditor;

      if (selectedLessonIndex === null) return state;

      return {
        courseEditor: {
          ...state.courseEditor,
          lessons: lessons.filter((_, i) => i !== selectedLessonIndex),
          isDeletionModalOpen: false,
          selectedLessonIndex: null,
          isDeleting: false,
        },
      };
    }),

  setGeneratedTopicID: (topicID) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        generatedTopicID: topicID,
      },
    })),

  addTopic: ({ lessonIndex, topic }) =>
    set((state) => {
      const finalTopic = topic.topic_id
        ? topic
        : { ...topic, topic_id: state.courseEditor.generatedTopicID };

      return {
        courseEditor: {
          ...state.courseEditor,
          lessons: state.courseEditor.lessons.map((lesson, index) => {
            if (index === lessonIndex) {
              return {
                ...lesson,
                topics: [...lesson.topics, finalTopic],
              };
            }
            return lesson;
          }),
          generatedTopicID: null,
        },
      };
    }),

  editTopic: ({ lessonIndex, topicIndex, topic }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        lessons: state.courseEditor.lessons.map((lesson, index) => {
          if (index === lessonIndex) {
            return {
              ...lesson,
              topics: lesson.topics.map((t, idx) =>
                idx === topicIndex ? topic : t
              ),
            };
          }
          return lesson;
        }),
      },
    })),

  deleteTopic: ({ lessonIndex, topicIndex }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        lessons: state.courseEditor.lessons.map((lesson, index) => {
          if (index === lessonIndex) {
            return {
              ...lesson,
              topics: lesson.topics.filter((_, idx) => idx !== topicIndex),
            };
          }
          return lesson;
        }),
      },
    })),

  editTest: ({ lessonIndex, topicIndex, testIndex, test }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        lessons: state.courseEditor.lessons.map((lesson, lIndex) => {
          if (lIndex === lessonIndex) {
            return {
              ...lesson,
              topics: lesson.topics.map((topic, tIndex) => {
                if (tIndex === topicIndex) {
                  return {
                    ...topic,
                    tests: topic.tests.map((t, idx) =>
                      idx === testIndex ? test : t
                    ),
                  };
                }
                return topic;
              }),
            };
          }
          return lesson;
        }),
      },
    })),

  deleteTest: ({ lessonIndex, topicIndex, testIndex }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        lessons: state.courseEditor.lessons.map((lesson, lIndex) => {
          if (lIndex === lessonIndex) {
            return {
              ...lesson,
              topics: lesson.topics.map((topic, tIndex) => {
                if (tIndex === topicIndex) {
                  return {
                    ...topic,
                    tests: topic.tests.filter((_, idx) => idx !== testIndex),
                  };
                }
                return topic;
              }),
            };
          }
          return lesson;
        }),
      },
    })),

  setIsDeleting: (isDeleting) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        isDeleting,
      },
    })),
});

const useLessonStore = create((set) => ({
  courseEditor: {
    lessons: [],
    tests: [],
    isTopicModalOpen: false,
    isLessonModalOpen: false,
    isTestModalOpen: false,
    isDeletionModalOpen: false,
    selectedLessonIndex: null,
    selectedTopicIndex: null,
    selectedTestIndex: null,
    generatedLessonID: null,
    generatedTopicID: null,
    isDeleting: false,
  },
  ...createActions(set),
}));

export default useLessonStore;
