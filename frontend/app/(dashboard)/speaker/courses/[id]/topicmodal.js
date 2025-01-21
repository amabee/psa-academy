import CustomModal from "@/components/shared/custommodal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useLessonStore from "@/store/lessonStore";
import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const TopicModal = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTopicModalOpen = useLessonStore(
    (state) => state.courseEditor.isTopicModalOpen
  );
  const closeTopicModal = useLessonStore((state) => state.closeTopicModal);

  const selectedLessonIndex = useLessonStore(
    (state) => state.courseEditor.selectedLessonIndex
  );
  const selectedTopicIndex = useLessonStore(
    (state) => state.courseEditor.selectedTopicIndex
  );
  const lessons = useLessonStore((state) => state.courseEditor.lessons);
  const addTopic = useLessonStore((state) => state.addTopic);
  const editTopic = useLessonStore((state) => state.editTopic);

  // Debug state changes
  useEffect(() => {
    if (isTopicModalOpen) {
      console.log("Modal opened with:", {
        selectedLessonIndex,
        selectedTopicIndex,
        currentLesson:
          selectedLessonIndex !== null ? lessons[selectedLessonIndex] : null,
      });
    }
  }, [isTopicModalOpen, selectedLessonIndex, selectedTopicIndex, lessons]);

  const topic =
    selectedLessonIndex !== null && selectedTopicIndex !== null
      ? lessons[selectedLessonIndex].topics[selectedTopicIndex]
      : undefined;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedLessonIndex === null) {
        console.error("selectedLessonIndex is null");
        return;
      }

      const formData = new FormData(e.target);
      const title = formData.get("title");
      const content = formData.get("content");
      const video = formData.get("video");

      if (!title || !content) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Ensure topics array exists
      if (!lessons[selectedLessonIndex].topics) {
        console.log("Initializing topics array for lesson");
        lessons[selectedLessonIndex].topics = [];
      }

      const topicData = {
        id: topic?.id || uuidv4(),
        title,
        content,
        video: video instanceof File ? URL.createObjectURL(video) : video,
      };

      console.log("Submitting topic data:", {
        lessonIndex: selectedLessonIndex,
        topicIndex: selectedTopicIndex,
        topicData,
      });

      if (selectedTopicIndex === null) {
        addTopic({
          lessonIndex: selectedLessonIndex,
          topic: topicData,
        });
        toast.success("Topic added successfully");
      } else {
        editTopic({
          lessonIndex: selectedLessonIndex,
          topicIndex: selectedTopicIndex,
          topic: topicData,
        });
        toast.success("Topic updated successfully");
      }

      closeTopicModal();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Failed to save topic");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onClose = () => {
    closeTopicModal();
  };

  return (
    <CustomModal isOpen={isTopicModalOpen} onClose={onClose}>
      <div className="chapter-modal">
        <div className="chapter-modal__header">
          <h2 className="chapter-modal__title">
            {selectedTopicIndex === null ? "Add Topic" : "Edit Topic"}
          </h2>
          <button onClick={onClose} className="chapter-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="chapter-modal__form">
          <div className="mb-4">
            <label className="text-customgreys-dirtyGrey text-sm">
              Topic Title
            </label>
            <Input
              name="title"
              defaultValue={topic?.title}
              placeholder="Write topic title here"
              className="mt-1"
            />
          </div>

          <div className="mb-4">
            <label className="text-customgreys-dirtyGrey text-sm">
              Topic Content
            </label>
            <textarea
              name="content"
              defaultValue={topic?.content}
              placeholder="Write topic content here"
              className="w-full mt-1 p-2 border rounded-md bg-customgreys-darkGrey"
              rows={4}
            />
          </div>

          <div className="mb-4">
            <label className="text-customgreys-dirtyGrey text-sm">
              Topic Video
            </label>
            <Input
              type="file"
              name="video"
              accept="video/*"
              className="border-none bg-customgreys-darkGrey py-2 cursor-pointer mt-1"
            />
            {topic?.video && (
              <div className="my-2 text-sm text-gray-600">
                Current video: {topic.video.split("/").pop()}
              </div>
            )}
          </div>

          <div className="chapter-modal__actions">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </CustomModal>
  );
};

export default TopicModal;
