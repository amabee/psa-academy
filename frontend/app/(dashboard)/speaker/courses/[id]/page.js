"use client";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";

import { ArrowLeft, Edit, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DroppableComponent from "./droppable";
import TopicModal from "./topicmodal";
import LessonModal from "./lessonmodal";

import { useAppStore } from "@/store/stateStore";
import { useCategories, useCourseDetail } from "@/queries/speaker/courses";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/components/shared/loading";

import { registerPlugin } from "filepond";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

import { ACCEPTED_IMAGE_TYPES } from "@/lib/utils";
import useLessonStore from "@/store/lessonStore";
import { Separator } from "@radix-ui/react-context-menu";
import {
  generateLessonID,
  updateCourse,
  createTest,
  updateTest,
  deleteTest,
} from "@/lib/actions/speaker/action";
import { useUser } from "@/app/providers/UserProvider";
import { toast } from "sonner";
import TestModal from "../../components/TestModalComponent";
import TestDisplayComponent from "./testdisplay";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

const CourseEditor = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const user = useUser();

  const {
    data: course,
    isLoading: courseLoading,
    isError: courseError,
  } = useCourseDetail(id);

  const { data: categories, isLoading, isError } = useCategories();
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [editingTestId, setEditingTestId] = useState(null);

  const [files, setFiles] = useState(
    course?.course_image
      ? [
          {
            source: process.env.NEXT_PUBLIC_ROOT_URL + course.course_image,
            options: {
              type: "local",
            },
          },
        ]
      : []
  );

  const setIsCreating = useAppStore((state) => state.setIsCreating);
  const isCreating = useAppStore((state) => state.isCreating);
  const setIsRedirecting = useAppStore((state) => state.setIsRedirecting);

  const [selectedCategoryLabel, setSelectedCategoryLabel] =
    useState("Select a category");

  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isGeneratingLessonID, setIsGeneratingLessonID] = useState(false);

  // New state for tracking changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);

  const lessons = useLessonStore((state) => state.courseEditor.lessons);
  const tests = useLessonStore((state) => state.courseEditor.tests);
  const setTests = useLessonStore((state) => state.setTests);

  const [formData, setFormData] = useState({
    courseTitle: "",
    courseDescription: "",
    courseCategory: 0,
    courseStatus: 0,
  });

  useEffect(() => {
    if (course?.course_image) {
      const fullImageUrl = `${process.env.NEXT_PUBLIC_ROOT_URL}image_serve.php?image=${course.course_image}`;
      setFiles([
        {
          source: fullImageUrl,
          options: {
            type: "local",
          },
        },
      ]);
    }
  }, [course?.course_image]);

  useEffect(() => {
    if (course && categories && categories.length > 0) {
      const matchingCategory = categories.find(
        (category) => category.category_id === course.category_id
      );

      const initialData = {
        courseTitle: course.title,
        courseDescription: course.description,
        courseCategory: course?.category_id,
        courseStatus: course?.course_status,
      };

      setFormData(initialData);

      // Store original data for comparison if not already set
      if (!originalFormData) {
        setOriginalFormData(initialData);
      }

      if (course.lessons) {
        setLessons(course.lessons);
      }

      // Load tests if they exist in the course data
      if (course.tests) {
        setTests(course.tests);
      }

      if (matchingCategory) {
        setSelectedCategoryLabel(matchingCategory.category_name);
      }
    }
  }, [course, categories, originalFormData]);

  useEffect(() => {
    setIsCreating(false);
    setIsRedirecting(false);
  }, []);

  // Function to check if there are unsaved changes
  const checkForChanges = (newFormData = formData) => {
    if (!originalFormData) return false;

    return (
      newFormData.courseTitle !== originalFormData.courseTitle ||
      newFormData.courseDescription !== originalFormData.courseDescription ||
      newFormData.courseCategory !== originalFormData.courseCategory ||
      newFormData.courseStatus !== originalFormData.courseStatus ||
      isImageChanged
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };

      // Check if there are unsaved changes
      const hasChanges = checkForChanges(newData);
      setHasUnsavedChanges(hasChanges);

      return newData;
    });
  };

  // Handle course status toggle
  const handleStatusToggle = () => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        courseStatus: prev.courseStatus === "draft" ? "publish" : "draft",
      };

      // Check if there are unsaved changes
      const hasChanges = checkForChanges(newData);
      setHasUnsavedChanges(hasChanges);

      return newData;
    });
  };

  const {
    openTopicModal,
    isTopicModalOpen,
    openLessonModal,
    closeLessonModal,
    setLessons,
  } = useLessonStore();

  const onUpdate = async (e) => {
    e.preventDefault();

    // Check if there are any changes to save
    if (!hasUnsavedChanges) {
      toast.info("No changes to save");
      return;
    }

    try {
      setIsCreating(true);

      const courseImage = isImageChanged ? formData.courseImage?.file : null;

      const { success, data, message } = await updateCourse(
        id,
        user.user.user_id,
        formData.courseTitle,
        formData.courseDescription,
        formData.courseCategory,
        formData.courseStatus,
        courseImage
      );

      if (!success) {
        toast.error(message || "Failed to update course");
        return;
      }

      toast.success("Course updated successfully");

      // Update the original data to reflect the new saved state
      setOriginalFormData({
        courseTitle: formData.courseTitle,
        courseDescription: formData.courseDescription,
        courseCategory: formData.courseCategory,
        courseStatus: formData.courseStatus,
      });

      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error("An error occurred while updating the course");
    } finally {
      setIsImageChanged(false);
      setIsCreating(false);
    }
  };

  const handleGenerateLessonID = async (e) => {
    e.preventDefault();
    setIsGeneratingLessonID(true);

    try {
      const { success, data, message } = await generateLessonID();

      if (!success) {
        toast.error(message || "Failed to generate lesson ID");
        return;
      }

      useLessonStore.getState().setGeneratedLessonID(data);

      openLessonModal({ lessonIndex: null });
    } catch (error) {
      toast.error("Failed to generate lesson ID");
    } finally {
      setIsGeneratingLessonID(false);
    }
  };

  const handleSaveTest = async (testData) => {
    try {
      const apiTestData = {
        course_id: id,
        test_title: testData.test_title,
        test_type: testData.test_type,
        questions: testData.questions.map((question) => ({
          question_text: question.text,
          question_type: "multiple_choice",
          points: 1,
          choices: question.answers.map((answer) => ({
            choice_text: answer.text,
            is_correct: answer.id === question.correctAnswerId ? 1 : 0,
          })),
        })),
      };

      let result;
      if (editingTestId) {
        apiTestData.test_id = editingTestId;
        result = await updateTest(apiTestData);
      } else {
        result = await createTest(apiTestData);
      }

      if (result.success) {
        const currentTests = useLessonStore.getState().courseEditor.tests || [];

        const formattedTestData = {
          test_id: editingTestId || result.data.test_id || `test_${Date.now()}`,
          test_title: testData.test_title,
          test_type: testData.test_type,
          course_id: id,
          created_at: editingTestId
            ? currentTests.find((t) => t.test_id === editingTestId)?.created_at
            : new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // Store questions in the format your display component expects
          questions: testData.questions.map((question) => ({
            question_id: question.id,
            question_text: question.text,
            question_type: "multiple_choice",
            points: 1,
            choices: question.answers.map((answer) => ({
              choice_id: answer.id,
              choice_text: answer.text,
              is_correct: answer.id === question.correctAnswerId ? 1 : 0,
            })),
          })),
        };

        if (editingTestId) {
          // Update existing test
          const updatedTests = currentTests.map((test) =>
            test.test_id === editingTestId ? formattedTestData : test
          );
          setTests(updatedTests);
        } else {
          // Add new test
          setTests([...currentTests, formattedTestData]);
        }

        toast.success(
          `${testData.test_type === "pre" ? "Pre-Test" : "Post-Test"} ${
            editingTestId ? "updated" : "created"
          } successfully`
        );
      } else {
        console.log("TEST DATA: ", result);
        toast.error(result.message || "Failed to save test");
      }
    } catch (error) {
      console.error("Error saving test:", error);
      toast.error("An error occurred while saving the test");
    }

    // Reset editing states
    setEditingTest(null);
    setEditingTestId(null);
    setIsTestModalOpen(false);
  };

  const handleDeleteTest = async (testId) => {
    try {
      const result = await deleteTest(testId);

      if (result.success) {
        const currentTests = useLessonStore.getState().courseEditor.tests || [];
        const updatedTests = currentTests.filter(
          (test) => test.test_id !== testId
        );
        setTests(updatedTests);
        toast.success("Test deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete test");
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      toast.error("An error occurred while deleting the test");
    }
  };

  const handleEditTest = (testID) => {
    setEditingTestId(testID);
    setEditingTest(null);
    setIsTestModalOpen(true);
  };

  // Handle file upload changes
  const handleFileUpdate = (fileItems) => {
    setFiles(fileItems);
    const file = fileItems[0]?.file;
    const fileName = fileItems[0]?.filename;
    if (file) {
      const isActuallyChanged = course?.course_image !== fileName;
      setFormData((prev) => ({
        ...prev,
        courseImage: {
          file: file,
          fileName: fileName,
        },
      }));

      setIsImageChanged(isActuallyChanged);

      // Check for unsaved changes including image
      const hasChanges = checkForChanges() || isActuallyChanged;
      setHasUnsavedChanges(hasChanges);
    }
  };

  // Separate tests by type
  const preTests =
    tests?.filter(
      (test) => test.test_type === "pre-test" || test.test_type === "pre"
    ) || [];

  const postTests =
    tests?.filter(
      (test) => test.test_type === "post-test" || test.test_type === "post"
    ) || [];

  // Check if there are any tests
  const hasTests = tests && tests.length > 0;
  const hasPreTests = preTests.length > 0;
  const hasPostTests = postTests.length > 0;

  if (isError) return <p>Something went wrong</p>;
  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="flex items-center gap-5 mb-5">
        <button
          className="flex items-center border border-customgreys-dirtyGrey rounded-lg p-2 gap-2 cursor-pointer hover:bg-customgreys-dirtyGrey hover:text-white-100 text-customgreys-dirtyGrey"
          onClick={() => router.push("/speaker/courses", { scroll: false })}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </button>
      </div>

      <form
        onSubmit={(e) => {
          onUpdate(e);
        }}
      >
        <Header
          title="Course Setup"
          subtitle={`Complete all fields and save your course${
            hasUnsavedChanges ? " • Unsaved changes" : ""
          }`}
          rightElement={
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-300">
                  {formData.courseStatus === "publish" ? "Published" : "Draft"}
                </label>
                <div
                  className={`
                            w-14 h-8 rounded-full cursor-pointer relative transition-colors duration-300
                            ${
                              formData.courseStatus === "publish"
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }
                          `}
                  onClick={handleStatusToggle}
                >
                  <div
                    className={`
                    absolute top-1 w-6 h-6 bg-white-100 rounded-full shadow-md transition-transform duration-300
                    ${
                      formData.courseStatus === "publish"
                        ? "translate-x-7"
                        : "translate-x-1"
                    }
                  `}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className={`flex items-center justify-center ${
                  hasUnsavedChanges
                    ? "bg-primary-700 hover:bg-primary-600"
                    : "bg-gray-500 hover:bg-gray-400 cursor-not-allowed"
                }`}
                disabled={isCreating || !hasUnsavedChanges}
              >
                {isCreating ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C6.48 0 0 6.48 0 12h4zm2 5.291V16a8 8 0 018 8v-4c-2.21 0-4-1.79-4z"
                      ></path>
                    </svg>
                    Saving Changes...
                  </>
                ) : hasUnsavedChanges ? (
                  "Save Changes"
                ) : (
                  "No Changes to Save"
                )}
              </Button>
            </div>
          }
        />

        <div className="flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans">
          <div className="basis-1/2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="courseTitle"
                  className={`text-customgreys-dirtyGrey text-sm `}
                >
                  Course Title
                </Label>
              </div>

              <Input
                placeholder="Write course title here"
                name="courseTitle"
                className={`border-none text-white bg-customgreys-primarybg p-4 h-18`}
                value={formData.courseTitle}
                onChange={handleInputChange}
              />

              <div className="flex justify-between items-center">
                <Label
                  htmlFor="courseDescription"
                  className={`text-customgreys-dirtyGrey text-sm `}
                >
                  Course Description
                </Label>
              </div>

              <Textarea
                name="courseDescription"
                label="Course Description"
                type="textarea"
                placeholder="Write course description here"
                rows={3}
                className={`border-none bg-customgreys-darkGrey p-4`}
                value={formData.courseDescription}
                onChange={handleInputChange}
              />

              <div className="flex justify-between items-center">
                <Label
                  htmlFor="courseCategory"
                  className={`text-customgreys-dirtyGrey text-sm `}
                >
                  Course Category
                </Label>
              </div>

              {categories && categories.length > 0 ? (
                <Select
                  value={formData.courseCategory?.toString() || 99}
                  onValueChange={(value) => {
                    const newFormData = {
                      ...formData,
                      courseCategory: value
                        ? parseInt(value)
                        : course.category_id,
                    };

                    setFormData(newFormData);

                    const selectedCategory = categories.find(
                      (category) => category.category_id.toString() === value
                    );

                    if (selectedCategory) {
                      setSelectedCategoryLabel(selectedCategory.category_name);
                    } else {
                      const originalCategory = categories.find(
                        (category) =>
                          category.category_id === course.category_id
                      );
                      setSelectedCategoryLabel(
                        originalCategory
                          ? originalCategory.category_name
                          : "Select a category"
                      );
                    }

                    // Check for unsaved changes
                    const hasChanges = checkForChanges(newFormData);
                    setHasUnsavedChanges(hasChanges);
                  }}
                >
                  <SelectTrigger className="w-full h-10 border-none bg-customgreys-primarybg p-4">
                    <SelectValue placeholder={selectedCategoryLabel} />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-customgreys-primarybg border-customgreys-dirtyGrey shadow">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.category_id}
                        value={category.category_id.toString()}
                        className="cursor-pointer hover:!bg-gray-100 hover:!text-customgreys-darkGrey"
                      >
                        {category.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="bg-red-100 text-red-800 text-md font-medium me-2 mt-5 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                  No Categories found
                </span>
              )}
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="courseImage"
                  className={`text-customgreys-dirtyGrey text-sm `}
                >
                  Course Image
                </Label>
              </div>

              <FilePond
                files={files}
                onupdatefiles={handleFileUpdate}
                server={{
                  load: (source, load, error, progress, abort, headers) => {
                    progress(true, 0, 1);

                    return fetch(source, {
                      mode: "cors",
                      headers: {
                        Origin: "http://localhost:3000",
                      },
                    })
                      .then(async (response) => {
                        progress(true, 0.5, 1);

                        const imageFileName = source.includes("image_serve.php")
                          ? new URLSearchParams(new URL(source).search).get(
                              "image"
                            )
                          : source.split("/").pop();

                        const blob = await response.blob();

                        progress(true, 0.75, 1);
                        blob.name = imageFileName;
                        return blob;
                      })
                      .then((blob) => {
                        progress(true, 1, 1);
                        load(blob);
                      })
                      .catch(error);
                  },
                }}
                instantUpload={false}
                name="courseImage"
                allowMultiple={false}
                acceptedFileTypes={ACCEPTED_IMAGE_TYPES}
                labelFileTypeNotAllowed="Please upload an image file"
                fileValidateTypeLabelExpectedTypes="Accepts: JPG, JPEG, PNG, GIF, WEBP"
                dropValidation={true}
                labelIdle={`Drag & Drop your image or <span class="filepond--label-action">Browse</span>`}
                imagePreviewHeight={170}
                credits={false}
                stylePanelAspectRatio="16:9"
                dropOnPage
                fileSizeBase={2500}
              />
            </div>
          </div>
          <div className="bg-customgreys-darkGrey mt-4 md:mt-0 p-4 rounded-lg basis-1/2">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold text-white">
                Course Content
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleGenerateLessonID(e)}
                  className="border-none text-primary-700 group"
                  disabled={isGeneratingLessonID}
                >
                  {isGeneratingLessonID ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-t-transparent border-b-blue-500 border-l-green-500 border-r-red-500 rounded-full animate-spin"></div>

                        <span className="text-primary-700 group-hover:text-white">
                          Generating Lesson ID...
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <Plus className="mr-1 h-4 w-4 text-primary-700 group-hover:text-white" />{" "}
                      <span className="text-primary-700 group-hover:text-white">
                        Add Lesson
                      </span>
                    </>
                  )}
                </Button>
                <Separator
                  orientation="vertical"
                  className="h-6 w-[1px] bg-gray-300"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingTest(null);
                    setEditingTestId(null);
                    setIsTestModalOpen(true);
                  }}
                  className="border-none text-primary-700 group"
                >
                  <Plus className="mr-1 h-4 w-4 text-primary-700 group-hover:white-100" />
                  <span className="text-primary-700 group-hover:white-100">
                    Add Test
                  </span>
                </Button>
              </div>
            </div>

            {/* Content summary */}
            <div className="mb-4 text-sm text-gray-400">
              {hasPreTests && (
                <span className="mr-4">📝 Pre-test available</span>
              )}
              {lessons?.length > 0 && (
                <span className="mr-4">
                  📚 {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
                </span>
              )}
              {hasPostTests && <span>📝 Post-test available</span>}
            </div>

            {isLoading ? (
              <p>Loading course content...</p>
            ) : lessons?.length > 0 || hasTests ? (
              <div className="space-y-4">
                {/* Pre-Tests Section */}
                {hasPreTests && (
                  <div>
                    <div className="mb-2">
                      <h3 className="text-lg font-medium text-white mb-2">
                        Pre-Tests
                      </h3>
                    </div>
                    <TestDisplayComponent
                      tests={preTests}
                      onEditTest={handleEditTest}
                      onDeleteTest={handleDeleteTest}
                    />
                  </div>
                )}

                {/* Lessons Section */}
                {lessons?.length > 0 && (
                  <div>
                    <div className="mb-2">
                      <h3 className="text-lg font-medium text-white mb-2">
                        Lessons
                      </h3>
                    </div>
                    <DroppableComponent />
                  </div>
                )}

                {/* Post-Tests Section */}
                {hasPostTests && (
                  <div>
                    <div className="mb-2">
                      <h3 className="text-lg font-medium text-white mb-2">
                        Post-Tests
                      </h3>
                    </div>
                    <TestDisplayComponent
                      tests={postTests}
                      onEditTest={handleEditTest}
                      onDeleteTest={handleDeleteTest}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No content available</p>
                <p className="text-sm mt-2">Start by adding a lesson or test</p>
              </div>
            )}
          </div>
        </div>
      </form>

      <TopicModal />
      <LessonModal />
      <TestModal
        isOpen={isTestModalOpen}
        onClose={() => {
          setIsTestModalOpen(false);
          setEditingTest(null);
          setEditingTestId(null);
        }}
        onSave={handleSaveTest}
        editingTest={editingTest}
        testId={editingTestId}
      />
    </div>
  );
};

export default CourseEditor;
