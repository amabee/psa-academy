import CustomFormField from "@/components/shared/customformfield";
import CustomModal from "@/components/shared/custommodal";
import { Button } from "@/components/ui/button";
import useLessonStore from "@/store/lessonStore";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const LessonModal = () => {
  // Use separate selectors to minimize rerenders
  const isLessonModalOpen = useLessonStore(
    (state) => state.courseEditor.isLessonModalOpen
  );
  const selectedLessonIndex = useLessonStore(
    (state) => state.courseEditor.selectedLessonIndex
  );
  const lessons = useLessonStore((state) => state.courseEditor.lessons);

  // Get actions directly without useCallback
  const closeLessonModal = useLessonStore((state) => state.closeLessonModal);
  const addLesson = useLessonStore((state) => state.addLesson);
  const editLesson = useLessonStore((state) => state.editLesson);

  const lesson =
    selectedLessonIndex !== null ? lessons[selectedLessonIndex] : null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        description: lesson.description,
      });
    } else {
      setFormData({
        title: "",
        description: "",
      });
    }
  }, [lesson]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onClose = () => {
    setFormData({ title: "", description: "" });
    closeLessonModal();
  };

  const onSubmit = () => {
    try {
      const lessonData = {
        id: lesson?.lesson_id,
        title: formData.title,
        description: formData.description,
        topics: lesson?.topics || [],
      };

      if (selectedLessonIndex === null || selectedLessonIndex === undefined) {
        addLesson(lessonData);
        toast.success("Lesson added successfully!");
      } else {
        editLesson({ index: selectedLessonIndex, lesson: lessonData });
        toast.success("Lesson updated successfully!");
      }

      onClose();

    } catch (error) {
      console.error("Error submitting lesson:", error);
      toast.error("Failed to save lesson");
    }
  };



  return (
    <CustomModal isOpen={isLessonModalOpen} onClose={onClose}>
      <div className="section-modal">
        <div className="section-modal__header">
          <h2 className="section-modal__title">
            {selectedLessonIndex === null ? "Add Lesson" : "Edit Lesson"}
          </h2>
          <button onClick={onClose} className="section-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <CustomFormField
            name="title"
            label="Lesson Title"
            placeholder="Write lesson title here"
            value={formData.title}
            onChange={handleChange}
          />

          <CustomFormField
            name="description"
            label="Lesson Description"
            type="textarea"
            placeholder="Write lesson description here"
            value={formData.description}
            onChange={handleChange}
          />

          <div className="section-modal__actions">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary-700"
              disabled={!formData.title || !formData.description}
              onClick={onSubmit}
            >
              {selectedLessonIndex === null ? "Add Lesson" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default LessonModal;
