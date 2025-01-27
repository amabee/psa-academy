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
import { createTopic, getTopicDetails } from "@/lib/actions/speaker/action";

// Register plugins
registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginPdfPreview,
  FilePondPluginMediaPreview
);

const AnimeLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <div className="relative">
        <div className="absolute inset-0 w-24 h-24 rounded-full animate-[spin_3s_linear_infinite] before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-pink-500 before:via-purple-500 before:to-cyan-500 before:animate-[spin_3s_linear_infinite] after:content-[''] after:absolute after:inset-1 after:rounded-full after:bg-gray-900"></div>

        <div className="relative w-24 h-24">
          <div className="absolute w-full h-full border-t-4 border-purple-500 rounded-full animate-[spin_1s_linear_infinite]"></div>
          <div className="absolute w-full h-full border-r-4 border-cyan-500 rounded-full animate-[spin_2s_linear_infinite]"></div>
          <div className="absolute w-full h-full border-b-4 border-pink-500 rounded-full animate-[spin_3s_linear_infinite]"></div>
        </div>

        <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2">
          <div className="w-full h-full bg-white rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="mt-4 text-xl font-medium text-white-100">
        <span className="inline-block animate-[pulse_2s_ease-in-out_infinite]">
          Loading Data
        </span>
        <span className="inline-block animate-[pulse_2s_ease-in-out_infinite] delay-100">
          .
        </span>
        <span className="inline-block animate-[pulse_2s_ease-in-out_infinite] delay-200">
          .
        </span>
        <span className="inline-block animate-[pulse_2s_ease-in-out_infinite] delay-300">
          .
        </span>
      </div>
    </div>
  );
};

const TopicModal = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    topic_id: "",
    lesson_id: "",
    topic_title: "",
    topic_description: "",
    file: "",
  });

  const [isLoading, setIsLoading] = useState(false);

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

  const generatedTopicID = useLessonStore(
    (state) => state.courseEditor.generatedTopicID
  );

  const topicDetails =
    selectedLessonIndex !== null && selectedTopicIndex !== null
      ? lessons[selectedLessonIndex].topics[selectedTopicIndex]
      : undefined;

  useEffect(() => {
    if (!isTopicModalOpen) {
      setFormData({
        topic_id: "",
        lesson_id: "",
        topic_title: "",
        topic_description: "",
        file: "",
      });
      setFiles([]);
    }
  }, [isTopicModalOpen]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedLessonIndex === null) {
        console.error("selectedLessonIndex is null");
        return;
      }

      const title = formData.topic_title;
      const content = formData.topic_description;
      const uploadedFile = files.length > 0 ? files[0].file : null;

      if (!title || !content) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (!lessons[selectedLessonIndex].topics) {
        lessons[selectedLessonIndex].topics = [];
      }

      const sequence_number =
        selectedTopicIndex === null
          ? lessons[selectedLessonIndex].topics.length + 1
          : lessons[selectedLessonIndex].topics[selectedTopicIndex]
              .sequence_number;

      const topicData = {
        topic_id: generatedTopicID,
        lesson_id: lessons[selectedLessonIndex].lesson_id,
        topic_title: title,
        topic_description: content,
        file: uploadedFile ? uploadedFile : formData.file,
      };

      if (selectedTopicIndex === null) {
        const { success, data, message } = await createTopic(
          topicData.topic_id,
          topicData.lesson_id,
          topicData.topic_title,
          topicData.topic_description,
          sequence_number,
          uploadedFile
        );

        console.log(topicData);

        addTopic({
          lessonIndex: selectedLessonIndex,
          topic: {
            ...topicData,
            sequence_number,
          },
        });
        toast.success("Topic added successfully");
      } else {
        editTopic({
          lessonIndex: selectedLessonIndex,
          topicIndex: selectedTopicIndex,
          topic: {
            ...topicData,
            sequence_number,
          },
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
    const fetchTopicDetail = async () => {
      if (!topicDetails?.topic_id) {
        setFormData({
          topic_id: "",
          lesson_id: "",
          topic_title: "",
          topic_description: "",
          file: "",
        });
        setFiles([]);
        return;
      }

      setIsLoading(true);
      const { success, data, message } = await getTopicDetails(
        topicDetails.topic_id
      );

      if (!success) {
        toast.error(message);
        setIsLoading(false);
        return;
      }

      setFormData({
        topic_id: data.topic_id || "",
        lesson_id: data.lesson_id || "",
        topic_title: data.topic_title || "",
        topic_description: data.topic_description || "",
        file: data.file_name || "",
      });

      setIsLoading(false);
    };

    fetchTopicDetail();
  }, [topicDetails]);

  useEffect(() => {
    if (formData?.file) {
      const fullFileUrl = `${process.env.NEXT_PUBLIC_ROOT_URL}file_serve.php?file=${formData.file}`;

      fetch(fullFileUrl, {
        mode: "cors",
        headers: {
          Origin: "http://localhost:3000",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("File fetch failed");
          }
          return response.blob();
        })
        .then((blob) => {
          setFiles([
            {
              source: fullFileUrl,
              options: {
                type: "local",
              },
            },
          ]);
        })
        .catch((error) => {
          console.error("File loading error:", error);
        });
    }
  }, [formData?.file]);

  const onClose = () => {
    closeTopicModal();
    setFiles([]);
    setFormData({
      topic_id: "",
      lesson_id: "",
      topic_title: "",
      topic_description: "",
      file: "",
    });
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

        {isLoading ? (
          <AnimeLoading />
        ) : (
          <form onSubmit={handleSubmit} className="chapter-modal__form">
            <div className="mb-4">
              <label className="text-customgreys-dirtyGrey text-sm">
                Topic Title
              </label>
              <Input
                name="title"
                value={formData.topic_title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    topic_title: e.target.value,
                  }))
                }
                placeholder="Write topic title here"
                className="mt-1"
              />
            </div>

            <div className="mb-4">
              <label className="text-customgreys-dirtyGrey text-sm">
                Topic Description / Content
              </label>
              <textarea
                name="content"
                value={formData.topic_description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    topic_description: e.target.value,
                  }))
                }
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
                server={{
                  load: (source, load, error, progress, abort, headers) => {
                    const controller = new AbortController();
                    fetch(source, {
                      mode: "cors",
                      headers: {
                        Origin: "http://localhost:3000",
                        "X-Requested-With": "XMLHttpRequest",
                        Accept: "application/pdf,video/*",
                      },
                      signal: controller.signal,
                      credentials: "same-origin",
                    })
                      .then(async (response) => {
                        const blob = await response.blob();
                        const fileName = source.includes("file_serve.php")
                          ? new URLSearchParams(new URL(source).search).get(
                              "file"
                            )
                          : source.split("/").pop();

                        // Create a new blob with specific type
                        const newBlob = new Blob([blob], {
                          type: fileName.endsWith(".pdf")
                            ? "application/pdf"
                            : "video/mp4",
                        });
                        newBlob.name = fileName;

                        load(newBlob);
                      })
                      .catch(error);

                    return {
                      abort: () => {
                        controller.abort();
                      },
                    };
                  },
                }}
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
                allowMediaPreview={true}
                mediaPreviewHeight={720}
                allowPdfPreview={true}
                pdfPreviewHeight={320}
                pdfComponentExtraParams="toolbar=0&view=fit&page=1"
                instantUpload={false}
                allowFileTypeValidation={true}
                fileValidateTypeLabelExpectedTypes="Please upload a video or PDF file"
                beforeAddFile={(file) => {
                  if (
                    file.fileType.includes("video/") ||
                    file.fileType === "application/pdf"
                  ) {
                    return true;
                  }
                  return false;
                }}
              />
              {formData?.file && !files.length && (
                <div className="my-2 text-sm text-gray-600">
                  Current file: {formData.file.split("/").pop()}
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
        )}
      </div>
    </CustomModal>
  );
};

export default TopicModal;
