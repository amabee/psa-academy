import { create } from "zustand";

const createActions = (set) => ({
  setLessons: (lessons) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        lessons,
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

  // Test Modal Actions
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

  addLesson: (lesson) => {
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        lessons: [...state.courseEditor.lessons, lesson],
      },
    }));
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

  deleteLesson: (index) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        lessons: state.courseEditor.lessons.filter((_, i) => i !== index),
      },
    })),

  addTopic: ({ lessonIndex, topic }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        lessons: state.courseEditor.lessons.map((lesson, index) => {
          if (index === lessonIndex) {
            return {
              ...lesson,
              topics: [...lesson.topics, topic],
            };
          }
          return lesson;
        }),
      },
    })),

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

  // Test CRUD Operations
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
});

const useLessonStore = create((set) => ({
  courseEditor: {
    lessons: [],
    isTopicModalOpen: false,
    isLessonModalOpen: false,
    isTestModalOpen: false,
    selectedLessonIndex: null,
    selectedTopicIndex: null,
    selectedTestIndex: null,
  },
  ...createActions(set),
}));

export default useLessonStore;
