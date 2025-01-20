"use client";

import Header from "@/components/shared/header";
import Loading from "@/components/shared/loading";
import TeacherCourseCard from "@/components/shared/teachercoursecard";
import Toolbar from "@/components//shared/toolbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@/app/providers/UserProvider";
import Swal from "sweetalert2";
import { useCourses } from "@/queries/speaker/courses";
import { useAppStore } from "@/store/stateStore";
import { generateCourseID } from "@/lib/actions/speaker/action";
import LoadingOverlay from "@/components/shared/loadingoverlay";

const Courses = () => {
  const router = useRouter();
  const user = useUser();

  const { data: courses, isLoading, isError } = useCourses();

  const isGenerating = useAppStore((state) => state.isGenerating);
  const setIsGenerating = useAppStore((state) => state.setIsGenerating);
  const isCreating = useAppStore((state) => state.isCreating);
  const setIsCreating = useAppStore((state) => state.setIsCreating);
  const isRedirecting = useAppStore((state) => state.isRedirecting);
  const setIsRedirecting = useAppStore((state) => state.setIsRedirecting);

  const handleCreateCourse = async () => {
    setIsGenerating(true);

    try {
      const { success, data, message } = await generateCourseID();

      if (!success || !data) {
        Swal.fire({
          title: "Uh oh!",
          text: "Something went wrong while generating course id",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }

      if (!data) {
        Swal.fire({
          title: "Error",
          text: "Course ID was not generated properly",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }
      setIsCreating(true);
      setIsRedirecting(true);
      setIsCreating(false);
      router.push(`/speaker/courses/${data}`);
    } catch (error) {
      setIsCreating(false);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to create course",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteCourse = () => {
    throw new Error("Not Implemented");
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  // const filteredCourses = () => {
  //   return [];
  // };

  const handleEdit = (course) => {
    router.push(`/speaker/courses/${course.course_id}`, {
      scroll: false,
    });
  };

  const handleDelete = async (course) => {
    // if (window.confirm("Are you sure you want to delete this course?")) {
    //   await deleteCourse(course.courseId).unwrap();
    // }
  };

  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Error loading courses.</div>;
  if (isRedirecting) return <LoadingOverlay />;

  return (
    <div className="teacher-courses">
      <Header
        title="Courses"
        subtitle="Browse your courses"
        rightElement={
          <Button
            onClick={handleCreateCourse}
            disabled={isGenerating || isCreating}
            className="teacher-courses__header bg-primary-700 hover:bg-primary-600"
          >
            {isGenerating
              ? "Generating..."
              : isCreating
              ? "Creating..."
              : "Create Course"}
          </Button>
        }
      />
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />
      <div className="teacher-courses__grid">
        {filteredCourses.map((course) => (
          <TeacherCourseCard
            key={course.course_id}
            course={course}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isOwner={course.user_id === user.user.user_id}
          />
        ))}
      </div>
    </div>
  );
};

export default Courses;
