"use client";

import { useRef } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Loading from "@/components/shared/loading";
import { useCourseProgressData } from "@/hooks/useCourProgressData";
import dynamic from "next/dynamic";
import { current } from "@reduxjs/toolkit";
import { useUser } from "@/app/providers/UserProvider";
import { getCourseLessonContents } from "@/queries/student/student_course";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const Course = () => {
  const params = useParams();
  const courseId = params.courseId;
  const lessonId = params.lessonId;

  const user = useUser();

  const {
    data: course,
    isLoading,
    isError,
    error,
  } = getCourseLessonContents(user?.user.user_id, courseId);

  const playerRef = useRef(null);

  const handleProgress = ({ played }) => {
    // if (
    //   played >= 0.8 &&
    //   !hasMarkedComplete &&
    //   currentChapter &&
    //   currentSection &&
    //   userProgress?.sections &&
    //   !isChapterCompleted()
    // ) {
    //   setHasMarkedComplete(true);
    //   updateChapterProgress(
    //     currentSection.sectionId,
    //     currentChapter.chapterId,
    //     true
    //   );
    // }
  };

  if (isLoading) return <Loading />;
  if (!user) return <div>Please sign in to view this course.</div>;
  if (!course) return <div>Error loading course</div>;

  return (
    <div className="course">
      <div className="course__container">
        <div className="course__breadcrumb">
          <div className="course__path">
            {course.title} / {course?.lessons?.lesson_title} / Course Title
            <span className="course__current-chapter">
              {/* {currentChapter?.title} */}
            </span>
          </div>
          <h2 className="course__title">
            {/* {currentChapter?.title} - {currentChapter?.type} */} current
            chapter
          </h2>
          <div className="course__header">
            <div className="course__instructor">
              <Avatar className="course__avatar">
                <AvatarImage alt={course.teacherName} />
                <AvatarFallback className="course__avatar-fallback">
                  {/* {course.teacherName[0]} */} Teacher Name
                </AvatarFallback>
              </Avatar>
              <span className="course__instructor-name">
                {/* {course.teacherName} */}
              </span>
            </div>
          </div>
        </div>

        <Card className="course__video">
          {/* <h1> {currentChapter.type} </h1> */}
          <h1>Current Chapter Type</h1>
          <CardContent className="course__video-container">
            {/* {currentChapter.type.toLowerCase() === "video" &&
            currentChapter?.video ? (
              <ReactPlayer
                ref={playerRef}
                url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                controls
                width="100%"
                height="100%"
                onProgress={handleProgress}
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                    },
                  },
                }}
              />
            ) : currentChapter.type.toLowerCase() === "text" ? (
              <iframe
                src="https://www.aeee.in/wp-content/uploads/2020/08/Sample-pdf.pdf"
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title={`PDF for ${currentChapter.title}`}
              />
            ) : (
              <div className="course__no-video">
                No content available for this chapter.
              </div>
            )} */}
          </CardContent>
        </Card>

        <div className="course__content">
          <Tabs defaultValue="Notes" className="course__tabs">
            <TabsList className="course__tabs-list">
              <TabsTrigger className="course__tab" value="Notes">
                Notes
              </TabsTrigger>
              <TabsTrigger className="course__tab" value="Resources">
                Resources
              </TabsTrigger>
              <TabsTrigger className="course__tab" value="Quiz">
                Quiz
              </TabsTrigger>
            </TabsList>

            <TabsContent className="course__tab-content" value="Notes">
              <Card className="course__tab-card">
                <CardHeader className="course__tab-header">
                  <CardTitle>Notes Content</CardTitle>
                </CardHeader>
                <CardContent className="course__tab-body">
                  {/* {currentChapter?.content} */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent className="course__tab-content" value="Resources">
              <Card className="course__tab-card">
                <CardHeader className="course__tab-header">
                  <CardTitle>Resources Content</CardTitle>
                </CardHeader>
                <CardContent className="course__tab-body">
                  {/* Add resources content here */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent className="course__tab-content" value="Quiz">
              <Card className="course__tab-card">
                <CardHeader className="course__tab-header">
                  <CardTitle>Quiz Content</CardTitle>
                </CardHeader>
                <CardContent className="course__tab-body">
                  {/* {currentChapter?.quiz} */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="course__instructor-card">
            <CardContent className="course__instructor-info">
              <div className="course__instructor-header">
                <Avatar className="course__instructor-avatar">
                  <AvatarImage alt={course.teacherName} />
                  <AvatarFallback className="course__instructor-avatar-fallback">
                    {/* {course.teacherName[0]} */}
                  </AvatarFallback>
                </Avatar>
                <div className="course__instructor-details">
                  <h4 className="course__instructor-name">
                    {course.teacherName}
                  </h4>
                  <p className="course__instructor-title">Senior UX Designer</p>
                </div>
              </div>
              <div className="course__instructor-bio">
                <p>
                  A seasoned Senior UX Designer with over 15 years of experience
                  in creating intuitive and engaging digital experiences.
                  Expertise in leading UX design projects.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Course;
