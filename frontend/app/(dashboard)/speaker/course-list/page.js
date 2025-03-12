"use client";

import Header from "@/components/shared/header";
import Loading from "@/components/shared/loading";
import TeacherCourseCard from "@/components/shared/teachercoursecard";
import Toolbar from "@/components//shared/toolbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useUser } from "@/app/providers/UserProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useCourses } from "@/queries/speaker/courses";

const Courses = () => {
  const router = useRouter();
  const user = useUser();

  const queryClient = useQueryClient();

  const { data: courses, isLoading, isError } = useCourses();

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

  const routeToStudentList = (course) => {
    router.push(`/speaker/course-list/${course.course_id}`, {
      scroll: false,
    });
  };

  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Error loading courses.</div>;

  return (
    <div className="teacher-courses">
      <Header title="My Courses" subtitle="Browse your courses" />
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />
      <div className="teacher-courses__grid">
        {filteredCourses.map((course) => (
          <TeacherCourseCard
            key={course.course_id}
            course={course}
            isViewStudents={true}
            onStudentLinkClick={routeToStudentList}
            isOwner={course.teacherId === user}
          />
        ))}
      </div>
    </div>
  );
};

export default Courses;
