"use client";

import Header from "@/components/shared/header";
import Loading from "@/components/shared/loading";
import TeacherCourseCard from "@/components/shared/teachercoursecard";
import Toolbar from "@/components//shared/toolbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@/app/providers/UserProvider";
import { getCourses } from "@/lib/actions/speaker/action";
import { useErrorStore, useLoadingStore } from "@/store/stateStore";
import Swal from "sweetalert2";

const Courses = () => {
  const router = useRouter();
  const user = useUser();

  const [courses, setCourses] = useState([]);

  // const isLoading = useLoadingStore((state) => state.isLoading);
  // const setIsLoading = useLoadingStore((state) => state.setIsLoading);

  // const isError = useErrorStore((state) => state.isError);
  // const setError = useErrorStore((state) => state.setIsError);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);

  const fetchCourse = useCallback(async () => {
    try {
      setIsLoading(true);
      const { success, data, message } = await getCourses();

      if (!success) {
        Swal.fire({
          title: "Error Fetching Courses",
          text: message,
          icon: "error",
        });
        setError(true);
        return;
      }

      setCourses(data);
      alert(message);
    } catch (error) {
      setError(true);
      setCourses([]);
      Swal.fire({
        title: "Error Fetching Courses",
        text: error.message,
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  console.log(courses);

  useEffect(() => {
    fetchCourse();
  }, []);

  const createCourse = () => {
    // return {
    //   unwrap: () =>
    //     Promise.resolve({
    //       courseId: "course_123",
    //       teacherId: "user_7kFh92JkCpQw3N8M5L4xRzVtYs",
    //       teacherName: "John Dee",
    //     }),
    // };
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

  const handleEdit = (course) => {
    // router.push(`/teacher/courses/${course.courseId}`, {
    //   scroll: false,
    // });
  };

  const handleDelete = async (course) => {
    // if (window.confirm("Are you sure you want to delete this course?")) {
    //   await deleteCourse(course.courseId).unwrap();
    // }
  };

  const handleCreateCourse = async () => {
    // if (!user) return;
    // const result = await createCourse({
    //   teacherId: user.id,
    //   teacherName: user.fullName || "Unknown Teacher",
    // }).unwrap();
    // router.push(`/speaker/courses/${result.courseId}`, {
    //   scroll: false,
    // });
  };

  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Error loading courses.</div>;

  return (
    <div className="teacher-courses">
      <Header
        title="Courses"
        subtitle="Browse your courses"
        rightElement={
          <Button
            onClick={handleCreateCourse}
            className="teacher-courses__header"
          >
            Create Course
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
            key={course.courseId}
            course={course}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isOwner={course.teacherId === user}
          />
        ))}
      </div>
    </div>
  );
};

export default Courses;
