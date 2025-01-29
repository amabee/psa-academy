import CustomFormField from "@/components/shared/customformfield";
import CustomModal from "@/components/shared/custommodal";
import { Button } from "@/components/ui/button";
import {
  createLesson,
  deleteLesson,
  updateLesson,
} from "@/lib/actions/speaker/action";
import useLessonStore from "@/store/lessonStore";
import { useAppStore } from "@/store/stateStore";

import { X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";

const LessonModal = () => {
  const params = useParams();
  const id = params.id;
  const queryClient = useQueryClient();

  const isLessonModalOpen = useLessonStore(
    (state) => state.courseEditor.isLessonModalOpen
  );
  const selectedLessonIndex = useLessonStore(
    (state) => state.courseEditor.selectedLessonIndex
  );

  const isDeletionModalOpen = useLessonStore(
    (state) => state.courseEditor.isDeletionModalOpen
  );

  const setIsDeleting = useLessonStore((state) => state.setIsDeleting);

  const lessons = useLessonStore((state) => state.courseEditor.lessons);

  const closeLessonModal = useLessonStore((state) => state.closeLessonModal);
  const addLesson = useLessonStore((state) => state.addLesson);
  const editLesson = useLessonStore((state) => state.editLesson);
  const isCreating = useAppStore((state) => state.isCreating);
  const setIsCreating = useAppStore((state) => state.setIsCreating);

  const lesson =
    selectedLessonIndex !== null ? lessons[selectedLessonIndex] : null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    resources: "",
    sequence_number: 0,
  });

  useEffect(() => {
    setFormData({
      title: lesson?.lesson_title || "",
      description: lesson?.lesson_description || "",
      resources: lesson?.resources || "",
      sequence_number: lesson?.sequence_number || 0,
    });
  }, [lesson]);

  useEffect(() => {
    if (isDeletionModalOpen) {
      handleDelete();
    }
  }, [isDeletionModalOpen]);

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

  const onSubmit = async () => {
    try {
      const lessonData = {
        lesson_id: lesson?.lesson_id
          ? lesson.lesson_id
          : useLessonStore.getState().courseEditor.generatedLessonID,
        lesson_title: formData.title,
        lesson_description: formData.description,
        resources: formData.resources,
        sequence_number: lesson?.sequence_number,
        topics: lesson?.topics || [],
      };

      setIsCreating(true);

      if (selectedLessonIndex === null || selectedLessonIndex === undefined) {
        const { success, data, message } = await createLesson(
          lessonData.lesson_id,
          id,
          lessonData.lesson_title,
          lessonData.lesson_description,
          lessonData.resources,
          lessons.length + 1
        );

        if (!success) {
          toast.error(message);
          return;
        }

        addLesson(lessonData);
        toast.success("Lesson added successfully!");
      } else {
        const { success, data, message } = await updateLesson(
          lessonData.lesson_id,
          id,
          lessonData.lesson_title,
          lessonData.lesson_description,
          lessonData.resources,
          lessonData.sequence_number
        );

        if (!success) {
          toast.error(message);
          return;
        }

        editLesson({ index: selectedLessonIndex, lesson: lessonData });
        toast.success("Lesson updated successfully!");
      }

      console.log(lessonData);
    } catch (error) {
      console.error("Error submitting lesson:", error);
      toast.error("Failed to save lesson");
    } finally {
      setIsCreating(false);
      onClose();
    }
  };

  const handleDeleteLesson = async (lesson_id) => {
    try {
      const { success, data, message } = await deleteLesson(lesson_id);

      if (!success) {
        toast.error(message);
        return;
      }

      useLessonStore.getState().deleteLesson(selectedLessonIndex);
      toast.success("Lesson deleted successfully!");
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Failed to delete lesson");
    } finally {
      onClose();
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title:
        '<div style="font-size:18px;">Are you sure you want to delete this lesson?</div>',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      try {
        setIsDeleting(true);
        if (result.isConfirmed) {
          await handleDeleteLesson(lesson.lesson_id);
          await queryClient.invalidateQueries(["lessons"]);
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.message || "Failed to delete lesson",
          icon: "error",
          confirmButtonText: "Ok",
        });
      } finally {
        setIsDeleting(false);
      }
    });
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

          <CustomFormField
            name="resources"
            label="Lesson Resources"
            type="textarea"
            placeholder="Write lesson resources here"
            value={formData.resources}
            onChange={handleChange}
            className={"text-xl"}
          />

          <div className="section-modal__actions">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary-700"
              disabled={!formData.title || !formData.description || isCreating}
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
