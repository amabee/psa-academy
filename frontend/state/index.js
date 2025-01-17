import { create } from "zustand";

const initialState = {
  courseEditor: {
    sections: [],
    isChapterModalOpen: false,
    isSectionModalOpen: false,
    selectedSectionIndex: null,
    selectedChapterIndex: null,
  },
};

const useStore = create((set) => ({
  ...initialState,

  setSections: (sections) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        sections,
      },
    })),

  openChapterModal: ({ sectionIndex, chapterIndex }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        isChapterModalOpen: true,
        selectedSectionIndex: sectionIndex,
        selectedChapterIndex: chapterIndex,
      },
    })),

  closeChapterModal: () =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        isChapterModalOpen: false,
        selectedSectionIndex: null,
        selectedChapterIndex: null,
      },
    })),

  openSectionModal: ({ sectionIndex }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        isSectionModalOpen: true,
        selectedSectionIndex: sectionIndex,
      },
    })),

  closeSectionModal: () =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        isSectionModalOpen: false,
        selectedSectionIndex: null,
      },
    })),

  addSection: (section) => {
    set((state) => {
      const newState = {
        courseEditor: {
          ...state.courseEditor,
          sections: [...state.courseEditor.sections, section],
        },
      };
      return newState;
    });
  },

  editSection: ({ index, section }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        sections: state.courseEditor.sections.map((s, i) =>
          i === index ? section : s
        ),
      },
    })),

  deleteSection: (index) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        sections: state.courseEditor.sections.filter((_, i) => i !== index),
      },
    })),

  addChapter: ({ sectionIndex, chapter }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        sections: state.courseEditor.sections.map((section, index) => {
          if (index === sectionIndex) {
            return {
              ...section,
              chapters: [...section.chapters, chapter],
            };
          }
          return section;
        }),
      },
    })),

  editChapter: ({ sectionIndex, chapterIndex, chapter }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        sections: state.courseEditor.sections.map((section, index) => {
          if (index === sectionIndex) {
            return {
              ...section,
              chapters: section.chapters.map((ch, idx) =>
                idx === chapterIndex ? chapter : ch
              ),
            };
          }
          return section;
        }),
      },
    })),

  deleteChapter: ({ sectionIndex, chapterIndex }) =>
    set((state) => ({
      courseEditor: {
        ...state.courseEditor,
        sections: state.courseEditor.sections.map((section, index) => {
          if (index === sectionIndex) {
            return {
              ...section,
              chapters: section.chapters.filter(
                (_, idx) => idx !== chapterIndex
              ),
            };
          }
          return section;
        }),
      },
    })),
}));

export default useStore;
