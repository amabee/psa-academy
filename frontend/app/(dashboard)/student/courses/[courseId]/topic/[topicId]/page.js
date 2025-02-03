"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Loading from "@/components/shared/loading";
import dynamic from "next/dynamic";
import { useUser } from "@/app/providers/UserProvider";
import { getCourseLessonContents } from "@/queries/student/student_course";
import { getFileType } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const Course = () => {
  const params = useParams();
  const courseId = params.courseId;
  const topicId = params.topicId;

  const user = useUser();

  const {
    data: course,
    isLoading,
    isError,
    error,
  } = getCourseLessonContents(user?.user.user_id, courseId);

  const playerRef = useRef(null);

  const renderContent = () => {
    let currentTopic = null;
    let currentLesson = null;

    course?.lessons?.forEach((lesson) => {
      const foundTopic = lesson.topics?.find(
        (topic) => topic.topic_id === topicId
      );

      if (foundTopic) {
        currentTopic = foundTopic;
        currentLesson = lesson;
      }
    });

    // Get the file type and URL from the current topic's first material
    const fileType = getFileType(currentTopic?.materials?.[0]?.file_name);

    if (fileType === "video") {
      return (
        <ReactPlayer
          ref={playerRef}
          url={`${process.env.NEXT_PUBLIC_ROOT_URL}file_serve.php?file=${currentTopic?.materials?.[0]?.file_name}`}
          controls
          width="100%"
          height="100%"
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
              },
            },
          }}
        />
      );
    } else if (fileType === "pdf") {
      return (
        <PDFViewer
          url={`${process.env.NEXT_PUBLIC_ROOT_URL}file_serve.php?file=${currentTopic?.materials?.[0]?.file_name}`}
        />
      );
    } else {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No content available for this chapter.
        </div>
      );
    }
  };

  if (isLoading) return <Loading />;
  if (!user) return <div>Please sign in to view this course.</div>;
  if (!course) return <div>Error loading course</div>;

  // Find the current topic and lesson
  let currentTopic = null;
  let currentLesson = null;

  course.lessons.forEach((lesson) => {
    const foundTopic = lesson.topics?.find(
      (topic) => topic.topic_id === topicId
    );

    if (foundTopic) {
      currentTopic = foundTopic;
      currentLesson = lesson;
    }
  });

  return (
    <div className="course">
      <div className="course__container">
        <div className="course__breadcrumb">
          <div className="course__path">
            {course.title} / {currentLesson?.lesson_title} /{" "}
            <span className="course__current-chapter">
              {currentTopic?.topic_title}
            </span>
          </div>
          <h2 className="course__title">{currentTopic?.topic_title}</h2>
          <div className="course__header">
            <div className="course__instructor">
              <Avatar className="course__avatar">
                <AvatarImage
                  alt={course.teacherName}
                  src={`${process.env.NEXT_PUBLIC_ROOT_URL}profile_image_serve.php?image=${course.teacher_image}`}
                />
                <AvatarFallback className="course__avatar-fallback">
                  {course.teacher_firstname.charAt(0)}
                  {course.teacher_lastname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="course__instructor-name">
                {course.teacher_firstname} {course.teacher_middlename}{" "}
                {course.teacher_lastname}
              </span>
            </div>
          </div>
        </div>

        <Card className="course__video h-[500px]">
          <CardContent className="course__video-container">
            {renderContent()}
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
                  {currentTopic?.topic_description}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent className="course__tab-content" value="Resources">
              <Card className="course__tab-card">
                <CardHeader className="course__tab-header">
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent className="course__tab-body">
                  {currentTopic?.materials?.map((material) => (
                    <div key={material.material_id} className="mb-2">
                      <a
                        href={`${process.env.NEXT_PUBLIC_ROOT_URL}file_serve.php?file=${material.file_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {material.file_name}
                      </a>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent className="course__tab-content" value="Quiz">
              <Card className="course__tab-card">
                <CardHeader className="course__tab-header">
                  <CardTitle>Quiz Content</CardTitle>
                </CardHeader>
                <CardContent className="course__tab-body">
                  {/* Add quiz content here */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="course__instructor-card">
            <CardContent className="course__instructor-info">
              <div className="course__instructor-header">
                <Avatar className="course__instructor-avatar">
                  <AvatarImage
                    alt={course.teacherName}
                    src={`${process.env.NEXT_PUBLIC_ROOT_URL}profile_image_serve.php?image=${course.teacher_image}`}
                  />
                  <AvatarFallback className="course__instructor-avatar-fallback">
                    {course.teacher_firstname.charAt(0)}
                    {course.teacher_lastname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="course__instructor-details">
                  <h4 className="course__instructor-name">
                    {course.teacher_firstname} {course.teacher_lastname}
                  </h4>
                  <p className="course__instructor-title">Senior UX Designer</p>
                </div>
              </div>
              <div className="course__instructor-bio">
                <p>
                  {course.teacher_about || "No instructor biography available."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const PDFViewer = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(0.5);
  const [currentPage, setCurrentPage] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(2.0, prevScale + 0.1));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(0.1, prevScale - 0.1)); // Lowered minimum to 0.1
  };

  const handleScroll = (e) => {
    if (numPages) {
      const scrollTop = e.target.scrollTop;
      const scrollHeight = e.target.scrollHeight;
      const clientHeight = e.target.clientHeight;
      const scrollProgress = scrollTop / (scrollHeight - clientHeight);
      const estimatedCurrentPage = Math.ceil(scrollProgress * numPages) || 1;
      setCurrentPage(estimatedCurrentPage);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto h-[500]">
      <div className="flex items-center justify-center gap-4 p-4 bg-background border-b w-full">
        <div className="flex items-center gap-2">
          <span className="text-sm">
            Page {currentPage} of {numPages || "--"}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button variant="outline" size="icon" onClick={zoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={zoomIn}
            disabled={scale >= 2.0}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        className="flex-1 w-full max-w-4xl overflow-auto bg-muted/20"
        onScroll={handleScroll}
      >
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-full">
              Loading PDF...
            </div>
          }
          error={
            <div className="flex items-center justify-center h-full">
              Error loading PDF
            </div>
          }
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
              className="shadow-lg bg-white mb-4"
              renderAnnotationLayer={true}
              renderTextLayer={false}
              loading={
                <div className="flex items-center justify-center">
                  Loading page...
                </div>
              }
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default Course;
