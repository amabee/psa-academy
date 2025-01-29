import CustomModal from "@/components/shared/custommodal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useLessonStore from "@/store/lessonStore";
import { X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

// FilePond imports
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginPdfPreview from "filepond-plugin-pdf-preview";
import FilePondPluginMediaPreview from "filepond-plugin-media-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond-plugin-pdf-preview/dist/filepond-plugin-pdf-preview.min.css";
import "filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css";

import { createTopic, getTopicDetails } from "@/lib/actions/speaker/action";
import { AnimeLoading } from "@/components/shared/animeloading";
import { useFileUpload } from "@/client/uploadProgress";

// Register FilePond plugins
registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginPdfPreview,
  FilePondPluginMediaPreview,
  FilePondPluginFileValidateSize
);

const TopicModal = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const { uploadFile, uploadProgress, isUploading } = useFileUpload();
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExistingFile, setIsExistingFile] = useState(false);
  const [formData, setFormData] = useState({
    topic_id: "",
    lesson_id: "",
    topic_title: "",
    topic_description: "",
    file: "",
  });

  const pondRef = useRef(null);

  // Zustand store hooks
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
      if (pondRef.current) {
        pondRef.current.removeFiles();
      }

      setFormData({
        topic_id: "",
        lesson_id: "",
        topic_title: "",
        topic_description: "",
        file: "",
      });
      setFiles([]);
      setUploadedFileName(null);
    }
  }, [isTopicModalOpen]);

  const isFileFromDatabase = (fileName) => {
    return fileName === formData.file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedLessonIndex === null) {
        throw new Error("No lesson selected");
      }

      const title = formData.topic_title;
      const content = formData.topic_description;

      const finalFileName = isExistingFile ? formData.file : uploadedFileName;

      if (!title || !content) {
        toast.error("Please fill in all required fields");
        return;
      }

      const sequence_number =
        selectedTopicIndex === null
          ? lessons[selectedLessonIndex].topics.length + 1
          : lessons[selectedLessonIndex].topics[selectedTopicIndex]
              .sequence_number;

      const { success, data, message } = await createTopic(
        generatedTopicID,
        lessons[selectedLessonIndex].lesson_id,
        title,
        content,
        sequence_number,
        finalFileName
      );

      if (!success) {
        throw new Error(message);
      }

      if (selectedTopicIndex === null) {
        addTopic({
          lessonIndex: selectedLessonIndex,
          topic: {
            topic_id: generatedTopicID,
            lesson_id: lessons[selectedLessonIndex].lesson_id,
            topic_title: title,
            topic_description: content,
            sequence_number,
            file_name: uploadedFileName,
          },
        });
        toast.success(data);
      } else {
        editTopic({
          lessonIndex: selectedLessonIndex,
          topicIndex: selectedTopicIndex,
          topic: {
            ...topicDetails,
            topic_title: title,
            topic_description: content,
            file_name: uploadedFileName,
          },
        });
        toast.success("Topic updated successfully");
      }

      closeTopicModal();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(error.message || "Failed to save topic");
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
        setUploadedFileName(null);
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

      if (data.file_name) {
        setUploadedFileName(data.file_name);
        setIsExistingFile(true);
      }

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
          setIsExistingFile(true);
        })
        .catch((error) => {
          setIsExistingFile(false);
          console.error("File loading error:", error);
        });
    }
  }, [formData?.file]);

  const onClose = () => {
    if (pondRef.current) {
      pondRef.current.removeFiles();
    }
    setFiles([]);
    setUploadedFileName(null);
    setFormData({
      topic_id: "",
      lesson_id: "",
      topic_title: "",
      topic_description: "",
      file: "",
    });

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

        {isUploading && (
          <div className="mt-2 mb-4 px-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Uploading: {Math.round(uploadProgress)}%
            </p>
          </div>
        )}

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
                ref={pondRef}
                files={files}
                onupdatefiles={(fileItems) => {
                  setFiles(fileItems);

                  if (!fileItems || fileItems.length === 0) {
                    setUploadedFileName(null);
                    setIsExistingFile(false);
                    return;
                  }

                  const currentFile = fileItems[0];
                  if (!currentFile) {
                    setIsExistingFile(false);
                    return;
                  }

                  if (
                    currentFile.source &&
                    formData?.file &&
                    currentFile.source ===
                      `${process.env.NEXT_PUBLIC_ROOT_URL}file_serve.php?file=${formData.file}`
                  ) {
                    setIsExistingFile(true);
                    setUploadedFileName(formData.file);
                  } else {
                    setIsExistingFile(false);
                  }
                }}
                allowMultiple={false}
                maxFiles={1}
                instantUpload={false}
                name="video"
                allowFileSizeValidation={true}
                maxFileSize="200mb"
                maxTotalFileSize="200mb"
                labelMaxFileSizeExceeded="File is too large. Limit is 200mb"
                labelMaxFileSize="Maximum file size is 200mb"
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
                allowFileTypeValidation={true}
                fileValidateTypeLabelExpectedTypes="Please upload a video or PDF file"
                beforePdfPreviewLoad={(file) => {
                  if (file && file.fileType === "application/pdf") {
                    return true;
                  }
                  return false;
                }}
                beforeAddFile={(file) => {
                  if (
                    file.fileType.includes("video/") ||
                    file.fileType === "application/pdf"
                  ) {
                    return true;
                  }
                  return false;
                }}
                onaddfile={async (error, fileItem) => {
                  if (error) {
                    toast.error("Error adding file");
                    return;
                  }

                  if (isFileFromDatabase(fileItem.filename)) {
                    setIsExistingFile(true);
                    return;
                  }

                  setIsExistingFile(false);
                  try {
                    const fileName = await uploadFile(fileItem.file);

                    setUploadedFileName(fileName);
                    toast.success("File uploaded successfully");
                  } catch (error) {
                    console.error("Upload failed:", error);
                    toast.error("Failed to upload file");
                  }
                }}
                onremovefile={() => {
                  setUploadedFileName(null);
                }}
                disabled={isUploading}
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

                        const newBlob = new Blob([blob], {
                          type: fileName.endsWith(".pdf")
                            ? "application/pdf"
                            : "video/*",
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
                  process: async (
                    fieldName,
                    file,
                    metadata,
                    load,
                    error,
                    progress,
                    abort
                  ) => {
                    try {
                      const fileName = await uploadFile(file);
                      const interval = setInterval(() => {
                        progress(true, uploadProgress, 100);
                        if (uploadProgress === 100) clearInterval(interval);
                      }, 500);

                      load(fileName);
                    } catch (err) {
                      error("Upload failed");
                    }
                  },
                }}
              />
              {uploadedFileName && (
                <div className="my-2 text-sm text-gray-600">
                  File uploaded: {uploadedFileName}
                </div>
              )}
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
                disabled={isSubmitting || isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary-700"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting || isUploading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </CustomModal>
  );
};

export default TopicModal;
