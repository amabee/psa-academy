import CustomModal from "@/components/shared/custommodal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useLessonStore from "@/store/lessonStore";
import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// FilePond imports
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginPdfPreview from "filepond-plugin-pdf-preview";
import FilePondPluginMediaPreview from "filepond-plugin-media-preview";

import "filepond-plugin-pdf-preview/dist/filepond-plugin-pdf-preview.min.css";

// Register plugins
registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginPdfPreview,
  FilePondPluginMediaPreview
);

const TopicModal = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);

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

      const uploadedFile = files.length > 0 ? files[0].file : null;

      if (!title || !content) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (!lessons[selectedLessonIndex].topics) {
        console.log("Initializing topics array for lesson");
        lessons[selectedLessonIndex].topics = [];
      }

      const topicData = {
        id: topic?.id || uuidv4(),
        title,
        content,

        video:
          uploadedFile && uploadedFile.type.startsWith("video/")
            ? URL.createObjectURL(uploadedFile)
            : topic?.video || null,
        pdf:
          uploadedFile && uploadedFile.type === "application/pdf"
            ? URL.createObjectURL(uploadedFile)
            : topic?.pdf || null,
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

  useEffect(() => {
    return () => {
    
      if (topic?.video && topic.video.startsWith("blob:")) {
        URL.revokeObjectURL(topic.video);
      }
      if (topic?.pdf && topic.pdf.startsWith("blob:")) {
        URL.revokeObjectURL(topic.pdf);
      }
    };
  }, [topic]);

  const onClose = () => {
    closeTopicModal();
    setFiles([]);
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
              Topic Video or PDF
            </label>
            <FilePond
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={false}
              maxFiles={1}
              name="video"
              labelIdle='Drag & Drop your video or PDF or <span class="filepond--label-action">Browse</span>'
              acceptedFileTypes={["video/*", "application/pdf"]}
              credits={false}
              styleClassNamePondRoot="custom-filepond"
              className="mt-1"
              // Media preview specific configuration
              allowMediaPreview={true}
              mediaPreviewHeight={720}
              // PDF preview specific configuration
              allowPdfPreview={true}
              pdfPreviewHeight={320}
              pdfComponentExtraParams="toolbar=0&view=fit&page=1"
            />
            {topic?.video && !files.length && (
              <div className="my-2 text-sm text-gray-600">
                Current file: {topic.video.split("/").pop()}
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
