"use client";

import CustomFormField from "@/components/shared/customformfield";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  centsToDollars,
  createCourseFormData,
  uploadAllVideos,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import DroppableComponent from "./droppable";
import ChapterModal from "./chaptermodal";
import SectionModal from "./sectionmodal";
import * as z from "zod";
import useStore from "@/state";
import { useAppStore } from "@/store/stateStore";
import { useCategories } from "@/queries/speaker/courses";
import { Controller } from "react-hook-form";

const formSchema = z.object({
  courseTitle: z.string().min(1, "Course title is required"),
  courseDescription: z.string().min(1, "Course description is required"),
  courseCategory: z.string().min(1, "Course category is required"),
  coursePrice: z.string().min(1, "Course price is required"),
  courseStatus: z.boolean().default(false),
});

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

  const { data: categories, isLoading, isError } = useCategories();

  useEffect(() => {
    setIsCreating(false);
    setIsRedirecting(false);
  }, []);

  const {
    addSection,
    isChapterModalOpen,
    openChapterModal,
    openSectionModal,
    closeSectionModal,
    setSections,
  } = useStore();

  const course = [];

  const sections = useStore((state) => state.courseEditor.sections);

  console.log("CourseEditor rendering with sections:", sections);

  // Initialize form with React Hook Form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseTitle: "",
      courseDescription: "",
      courseCategory: "",
      coursePrice: "0",
      courseStatus: false,
    },
  });

  const updateCourse = () => {};

  const getUploadVideoUrl = () => {};

  const dispatch = () => {};

  // Update form values when course data is available

  // useEffect(() => {
  //   if (course) {
  //     form.reset({
  //       courseTitle: course.title || "",
  //       courseDescription: course.description || "",
  //       courseCategory: course.category || "",
  //       coursePrice: centsToDollars(course.price) || "0",
  //       courseStatus: course.status === "Published",
  //     });
  //     setSections(course.sections || []);
  //   }
  // }, [course, form.reset]);

  const onSubmit = async (data) => {
    try {
      const updatedSections = await uploadAllVideos(
        sections,
        id,
        getUploadVideoUrl
      );

      const formData = createCourseFormData(data, updatedSections);

      await updateCourse({
        courseId: id,
        formData,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-5 mb-5">
        <button
          className="flex items-center border border-customgreys-dirtyGrey rounded-lg p-2 gap-2 cursor-pointer hover:bg-customgreys-dirtyGrey hover:text-white-100 text-customgreys-dirtyGrey"
          onClick={() => router.push("/teacher/courses", { scroll: false })}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </button>
      </div>

      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    {form.watch("courseStatus")
                      ? "Update Published Course"
                      : "Save Material"}
                  </Button>
                </div>
              }
            />

            <div className="flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans">
              <div className="basis-1/2">
                <div className="space-y-4">
                  <CustomFormField
                    name="courseTitle"
                    label="Course Title"
                    type="text"
                    placeholder="Write course title here"
                    className="border-none"
                  />
                  <CustomFormField
                    name="courseDescription"
                    label="Course Description"
                    type="textarea"
                    placeholder="Write course description here"
                  />

                  <Controller
                    name="courseCategory"
                    control={form.control}
                    render={({ field }) => (
                      <CustomFormField
                        name={field.name}
                        placeholder={selectedCategoryLabel}
                        label="Select Category"
                        type="select"
                        options={
                          categories?.map((category) => ({
                            value: category.category_id,
                            label: category.category_name,
                          })) ?? []
                        }
                        value={field.value}
                        onChange={(e) => {
                          const selectedOption = categories.find(
                            (category) =>
                              category.category_id === e.target.value
                          );
                          setSelectedCategoryLabel(
                            selectedOption?.category_name || "Select a category"
                          );
                          field.onChange(e.target.value);
                        }}
                      />
                    )}
                  />

                  <CustomFormField
                    name="coursePrice"
                    label="Course Price"
                    type="image"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="bg-customgreys-darkGrey mt-4 md:mt-0 p-4 rounded-lg basis-1/2">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-semibold text-secondary-foreground">
                    Sections
                  </h2>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openSectionModal({ sectionIndex: 0 })}
                    className="border-none text-primary-700 group"
                  >
                    <Plus className="mr-1 h-4 w-4 text-primary-700 group-hover:white-100" />
                    <span className="text-primary-700 group-hover:white-100">
                      Add Section
                    </span>
                  </Button>
                </div>

                {isLoading ? (
                  <p>Loading course content...</p>
                ) : sections?.length > 0 ? (
                  <DroppableComponent />
                ) : (
                  <p>No sections available</p>
                )}
              </div>
            </div>
          </form>
        </Form>
      </FormProvider>

      {/* <ChapterModal /> */}
      <SectionModal />
    </div>
  );
};

export default CourseEditor;
