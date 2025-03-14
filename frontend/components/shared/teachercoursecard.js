import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { GoPeople } from "react-icons/go";

const TeacherCourseCard = ({
  course,
  onEdit,
  onDelete,
  isOwner,
  isViewStudents,
  onStudentLinkClick,
}) => {
  return (
    <Card className="course-card-teacher group">
      <CardHeader className="course-card-teacher__header">
        <Image
          className="course-card-teacher__image"
          src={`${process.env.NEXT_PUBLIC_ROOT_URL}image_serve.php?image=${course.course_image}`}
          loading="eager"
          alt={course.title}
          width={370}
          height={150}
          quality={75}
        />
        {/* <img
          className="course-card-teacher__image"
          src={`${process.env.NEXT_PUBLIC_ROOT_URL}image_serve.php?image=${course.course_image}`}
          loading="priority"
          alt={course.title}
          width={370}
          height={150}
        /> */}
      </CardHeader>

      <CardContent className="course-card-teacher__content">
        <div className="flex flex-col">
          <CardTitle className="course-card-teacher__title">
            {course.title}
          </CardTitle>

          <CardDescription className="course-card-teacher__category">
            {course.category_name}
          </CardDescription>

          <p className="text-sm mb-2">
            Status:{" "}
            <span
              className={cn(
                "font-semibold px-2 py-1 rounded",
                course.course_status === "publish"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              )}
            >
              {course.course_status
                ? course.course_status.charAt(0).toUpperCase() +
                  course.course_status.slice(1)
                : course.course_status}
            </span>
          </p>
          <div className="flex items-center">
            <GoPeople className="w-4 h-4 mr-2" />
            <span className="font-semibold px-2 py-1 rounded">
              {course.enrollment_count}{" "}
              {course.enrollment_count > 1
                ? "Enrolled Students"
                : "Enrolled Student"}
            </span>
          </div>
        </div>

        <div className="w-full xl:flex space-y-2 xl:space-y-0 gap-2 mt-3">
          {isOwner && !isViewStudents ? (
            <>
              <div>
                <Button
                  className="course-card-teacher__edit-button hover:bg-[rgb(152,152,253)] hover:text-white-100"
                  onClick={() => onEdit(course)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div>
                <Button
                  className="course-card-teacher__delete-button hover:bg-red-700 hover:text-white-100"
                  onClick={() => onDelete(course)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </>
          ) : isViewStudents ? (
            <div className="mt-2">
              <Button
                className="rounded w-full bg-primary-700 border-none hover:bg-primary-600 hover:text-customgreys-primarybg text-white-100 cursor-pointer"
                onClick={() => onStudentLinkClick(course)}
              >
                <GoPeople className="w-4 h-4 mr-2" />
                View {course.enrollment_count} Enrolled Students
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">View Only</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherCourseCard;
