"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { useAppStore, useNavigationStore } from "@/store/stateStore";
import { toast } from "sonner";
import { updateTopicProgress, addToTopicProgress, checkPreTestCompletion } from "@/lib/actions/students/action";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const Course = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId;
  const topicId = params.topicId;

  const isNavigating = useNavigationStore((state) => state.isNavigating);
  const setIsNavigating = useNavigationStore((state) => state.setIsNavigating);

  const [hasShownToast, setHasShownToast] = useState(false);
  const [isCheckingPreTest, setIsCheckingPreTest] = useState(true);

  const user = useUser();

  const {
    data: course,
    isLoading,
    isError,
    error,
    refetch,
  } = getCourseLessonContents(user?.user.user_id, courseId);

  const playerRef = useRef(null);

  const hasTopicProgress = course?.lessons?.reduce((found, lesson) => {
    if (found) return true;
    const topic = lesson.topics?.find((topic) => topic.topic_id === topicId);
    return !!topic?.progress;
  }, false);

  // Check pre-test completion when component mounts
  useEffect(() => {
    const checkPreTestAccess = async () => {
      if (!isLoading && course && user?.user?.user_id) {
        try {
          setIsCheckingPreTest(true);
          
          // Check if pre-test is completed
          const preTestStatus = await checkPreTestCompletion(
            user.user.user_id,
            courseId
          );
          
          if (preTestStatus.success) {
            // If pre-test exists and is not completed, redirect to tests page
            if (preTestStatus.data.pre_test_exists && !preTestStatus.data.pre_test_completed) {
              toast.info("Please complete the pre-test before accessing course content");
              router.push(`/student/courses/${courseId}/tests`, {
                scroll: false,
              });
              return;
            }
          }
        } catch (error) {
          console.error("Error checking pre-test status:", error);
          // If there's an error, allow access as fallback
        } finally {
          setIsCheckingPreTest(false);
        }
      }
    };

    checkPreTestAccess();
  }, [isLoading, course, user, courseId, router]);

  const handleProgress = (played) => {
    if (played >= 0.8) {
      markAsComplete(true);
    } else if (!hasTopicProgress) {
      markAsComplete(true);
    }
  };

  const markAsComplete = async (showToast = true) => {
    if (hasShownToast) return;

    try {
      // First, ensure topic progress exists for this user
      if (!hasTopicProgress) {
        const { success: addSuccess } = await addToTopicProgress(topicId, user?.user.user_id);
        if (!addSuccess) {
          return showToast ? toast.error("Failed to initialize topic progress") : null;
        }
      }

      const { success, message } = await updateTopicProgress(topicId);

      if (!success) {
        return showToast ? toast.error(message) : null;
      }

      setHasShownToast(true);
      refetch();
      console.log(message);
      return showToast ? toast.success("Topic Completed") : null;
    } catch (error) {
      return showToast ? toast.error(error.message || "Failed to mark as complete") : null;
    }
  };

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

    const fileType = getFileType(currentTopic?.materials?.[0]?.file_name);

    if (fileType === "video") {
      return (
        <ReactPlayer
          ref={playerRef}
          url={`${process.env.NEXT_PUBLIC_ROOT_URL}file.php?file=${currentTopic?.materials?.[0]?.file_name}`}
          controls
          width="100%"
          height="100%"
          onProgress={({ played }) => handleProgress(played)}
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
          url={`${process.env.NEXT_PUBLIC_ROOT_URL}file.php?file=${currentTopic?.materials?.[0]?.file_name}`}
          onProgress={handleProgress}
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

  useEffect(() => {
    if (course) setIsNavigating(false);
  }, []);

  // Auto-mark topic as complete when page loads (especially for first topic redirects)
  useEffect(() => {
    if (course && topicId && !hasTopicProgress) {
      // Check if this is the first topic of the first lesson (the one students are redirected to)
      const isFirstTopic = course.lessons && 
        course.lessons.length > 0 && 
        course.lessons[0].topics && 
        course.lessons[0].topics.length > 0 && 
        course.lessons[0].topics[0].topic_id === topicId;

      if (isFirstTopic) {
        // Add a small delay to ensure the page is fully loaded
        const timer = setTimeout(() => {
          markAsComplete(false); // Don't show toast for auto-completion
        }, 2000); // 2 second delay

        return () => clearTimeout(timer);
      } else {
        // For other topics, auto-complete after a longer delay to give students time to interact
        const timer = setTimeout(() => {
          markAsComplete(false); // Don't show toast for auto-completion
        }, 30000); // 30 second delay for other topics

        return () => clearTimeout(timer);
      }
    }
  }, [course, topicId, hasTopicProgress]);

  if (isLoading || isNavigating || isCheckingPreTest) return <Loading />;

  if (!user) return <div>Please sign in to view this course.</div>;
  if (!course) return <div>Error loading course</div>;

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
              <TabsTrigger className="course__tab" value="Comments">
               Comments
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
                        href={`${process.env.NEXT_PUBLIC_ROOT_URL}file.php?file=${material.file_name}`}
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

            <TabsContent className="course__tab-content" value="Comments">
              <Card className="course__tab-card">
                <CardHeader className="course__tab-header">
                  <CardTitle>Comments</CardTitle>
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
                  <p className="course__instructor-title">
                    {course.teacher_position}
                  </p>
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

const PDFViewer = ({ url, onProgress }) => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(0.8);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(2.0, prevScale + 0.1));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(0.1, prevScale - 0.1));
  };

  const handleScroll = (e) => {
    if (numPages) {
      const scrollTop = e.target.scrollTop;
      const scrollHeight = e.target.scrollHeight;
      const clientHeight = e.target.clientHeight;
      const scrollProgress = scrollTop / (scrollHeight - clientHeight);
      const estimatedCurrentPage = Math.ceil(scrollProgress * numPages) || 1;
      setCurrentPage(estimatedCurrentPage);

      if (scrollProgress >= 0.8 && !hasReachedEnd) {
        setHasReachedEnd(true);

        onProgress(0.8);
      }
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
