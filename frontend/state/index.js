import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseEditor: {
    sections: [],
    isChapterModalOpen: false,
    isSectionModalOpen: false,
    selectedSectionIndex: null,
    selectedChapterIndex: null,
  },
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setSections: (state, action) => {
      state.courseEditor.sections = action.payload;
    },
    openChapterModal: (state, action) => {
      state.courseEditor.isChapterModalOpen = true;
      state.courseEditor.selectedSectionIndex = action.payload.sectionIndex;
      state.courseEditor.selectedChapterIndex = action.payload.chapterIndex;
    },
    closeChapterModal: (state) => {
      state.courseEditor.isChapterModalOpen = false;
      state.courseEditor.selectedSectionIndex = null;
      state.courseEditor.selectedChapterIndex = null;
    },

    openSectionModal: (state, action) => {
      state.courseEditor.isSectionModalOpen = true;
      state.courseEditor.selectedSectionIndex = action.payload.sectionIndex;
    },
    closeSectionModal: (state) => {
      state.courseEditor.isSectionModalOpen = false;
      state.courseEditor.selectedSectionIndex = null;
    },

    addSection: (state, action) => {
      state.courseEditor.sections.push(action.payload);
    },
    editSection: (state, action) => {
      state.courseEditor.sections[action.payload.index] = action.payload.section;
    },
    deleteSection: (state, action) => {
      state.courseEditor.sections.splice(action.payload, 1);
    },

    addChapter: (state, action) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters.push(
        action.payload.chapter
      );
    },
    editChapter: (state, action) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters[
        action.payload.chapterIndex
      ] = action.payload.chapter;
    },
    deleteChapter: (state, action) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters.splice(
        action.payload.chapterIndex,
        1
      );
    },
  },
});

export const {
  setSections,
  openChapterModal,
  closeChapterModal,
  openSectionModal,
  closeSectionModal,
  addSection,
  editSection,
  deleteSection,
  addChapter,
  editChapter,
  deleteChapter,
} = globalSlice.actions;

export default globalSlice.reducer;