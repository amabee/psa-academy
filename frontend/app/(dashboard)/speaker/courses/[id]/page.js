"use client";

import CustomFormField from "@/components/shared/customformfield";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";

import { ArrowLeft, Edit, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DroppableComponent from "./droppable";
import TopicModal from "./topicmodal";
import LessonModal from "./lessonmodal";

import { useAppStore } from "@/store/stateStore";
import { useCategories } from "@/queries/speaker/courses";
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

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

const CourseEditor = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const isCreating = useAppStore((state) => state.isCreating);
  const setIsCreating = useAppStore((state) => state.setIsCreating);
  const isRedirecting = useAppStore((state) => state.isRedirecting);
  const setIsRedirecting = useAppStore((state) => state.setIsRedirecting);

  const [selectedCategoryLabel, setSelectedCategoryLabel] =
    useState("Select a category");

  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: categories, isLoading, isError } = useCategories();
  const lessons = useLessonStore((state) => state.courseEditor.lessons);

  useEffect(() => {
    setIsCreating(false);
    setIsRedirecting(false);
  }, []);

  const [formData, setFormData] = useState({
    courseTitle: "",
    courseDescription: "",
    courseCategory: "",
    courseImage: "",
  });

  const [files, setFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const {
    openTopicModal,
    isTopicModalOpen,
    openLessonModal,
    closeLessonModal,
    setLessons,
  } = useLessonStore();

  const course = [];

  const onSubmit = async (data) => {};

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

      <form onSubmit={() => {}}>
        <Header
          title="Course Setup"
          subtitle="Complete all fields and save your course"
          rightElement={
            <div className="flex items-center space-x-4">
              <CustomFormField
                name="courseStatus"
                label="Course Status"
                type="switch"
                className="flex items-center space-x-2"
                inputClassName=" data-[state=checked]:bg-green-500"
                onChange={() => alert("Saving as Draft")}
              />
              <Button
                type="submit"
                className="bg-primary-700 hover:bg-primary-600"
              >
                Save Material
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
                  value={formData.courseCategory}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      courseCategory: value,
                    }));
                    setSelectedCategory(value);
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
              ) : null}
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="courseImage"
                  className={`text-customgreys-dirtyGrey text-sm `}
                >
                  Course Category
                </Label>
              </div>

              <FilePond
                files={files}
                onupdatefiles={(fileItems) => {
                  setFiles(fileItems);
                  const file = fileItems[0]?.file;
                  const fileName = fileItems[0]?.filename;
                  if (file) {
                    setFormData((prev) => ({
                      ...prev,
                      courseImage: {
                        file: file,
                        fileName: fileName,
                      },
                    }));
                    console.log("Updated file:", file);
                  }
                }}
                server={null}
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
              <h2 className="text-2xl font-semibold text-white">Lesson</h2>

              <Select
                onValueChange={(value) => {
                  if (value === "lesson") {
                    openLessonModal({ sectionIndex: 0 });
                  } else if (value === "test") {
                    alert("Test");
                  }
                }}
              >
                <SelectTrigger className="border-none text-primary-700 group w-auto">
                  <div className="flex items-center">
                    <Plus className="mr-1 h-4 w-4 text-primary-700 group-hover:white-100" />
                    <span className="text-primary-700 group-hover:white-100">
                      Add Section
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-customgreys-darkGrey border-customgreys-dirtyGrey shadow">
                  <SelectItem value="lesson">Add Lesson</SelectItem>
                  <SelectItem value="test">Add Test</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <p>Loading course content...</p>
            ) : lessons?.length > 0 ? (
              <DroppableComponent />
            ) : (
              <p>No sections available</p>
            )}
          </div>
        </div>
      </form>

      <TopicModal />
      <LessonModal />
    </div>
  );
};

export default CourseEditor;
