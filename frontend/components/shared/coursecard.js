import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "../ui/button";

const CourseCard = ({ course, onGoToCourse, onApplyCourse }) => {
  return (
    <Card className="course-card group" onClick={() => onGoToCourse(course)}>
      <CardHeader className="course-card__header">
        <Image
          src={`${process.env.NEXT_PUBLIC_ROOT_URL}/image_serve.php?image=${course.course_image}`}
          alt={course.title}
          width={400}
          height={350}
          className="course-card__image"
          priority
        />
      </CardHeader>
      <CardContent className="course-card__content">
        <CardTitle className="course-card__title">
          {course.title}: {course.description}
        </CardTitle>

        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_ROOT_URL}/profile_image_serve.php?image=${course.speaker_image}`}
              alt={`${course.speaker_firstname} ${course.speaker_middlename} ${course.speaker_lastname}`}
            />
            <AvatarFallback className="bg-secondary-700 text-black">
              {course.speaker_firstname.charAt(0)}
              {course.speaker_lastname.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <p className="text-sm text-customgreys-dirtyGrey">
            {course.speaker_firstname} {course.speaker_lastname}
          </p>
        </div>

        <CardFooter className="course-card__footer">
          <div className="course-card__category">{course.category_name}</div>
          <span
            className={`${
              course.enrolled === 1
                ? "text-green-600 font-bold text-md"
                : "course-card__price"
            } `}
          >
            {course.enrolled === 1 ? (
              "Enrolled"
            ) : (
              <Button
                className="text-white-100 bg-green-600 hover:bg-green-700 shadow-md shadow-gray-800"
                onClick={() => onApplyCourse(course)}
              >
                Apply
              </Button>
            )}
          </span>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
