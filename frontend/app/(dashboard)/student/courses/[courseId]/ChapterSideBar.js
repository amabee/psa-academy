"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle,
  Trophy,
  FileVideo,
  ClipboardCheck,
  Award,
  Lock,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { cn, getFileType } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useUser } from "@/app/providers/UserProvider";
import { getCourseLessonContents } from "@/queries/student/student_course";
import { useNavigationStore } from "@/store/stateStore";
import { toast } from "sonner";
import {
  addToTopicProgress,
  updateTopicProgress,
  checkPreTestCompletion,
  getEvaluationStatus,
  getCourseTests,
} from "@/lib/actions/students/action";

const ChaptersSidebar = () => {
  const router = useRouter();
  const { setOpen } = useSidebar();
  const [expandedSections, setExpandedSections] = useState([]);
  const [hasAutoAddedFirstTopic, setHasAutoAddedFirstTopic] = useState(false);
  const [evaluationStatus, setEvaluationStatus] = useState(null);
  const [postTestStatus, setPostTestStatus] = useState(null);
  const [isPostTestCompleted, setIsPostTestCompleted] = useState(false);

  const params = useParams();
  const courseId = params.courseId;
  const topicId = params.topicId;
  const user = useUser();

  const {
    data: course,
    isLoading,
    isError,
    error,
    refetch,
  } = getCourseLessonContents(user?.user.user_id, courseId);

  const setIsNavigating = useNavigationStore((state) => state.setIsNavigating);

  const currentCourse = course?.course_id === courseId ? course?.course_id : "";

  const currentUserLessonProgress = course?.lessons?.reduce((found, lesson) => {
    if (found) return found;
    const topic = lesson.topics?.find((topic) => topic.topic_id === topicId);
    return topic?.progress || null;
  }, null);

  // Fetch evaluation status and post-test status
  useEffect(() => {
    const fetchStatuses = async () => {
      if (courseId && user?.user?.user_id) {
        try {
          // Fetch evaluation status
          const evalResult = await getEvaluationStatus(courseId, user.user.user_id);
          if (evalResult.success) {
            setEvaluationStatus(evalResult.data);
          }

          // Fetch course tests to check post-test completion
          const testsResult = await getCourseTests(courseId, user.user.user_id);
          if (testsResult.success) {
            const postTest = testsResult.data.find(test => test.test_type === 'post');
            if (postTest) {
              setPostTestStatus(postTest);
              // Check if post-test is completed (has results)
              const hasResults = postTest.answered_count > 0 && postTest.question_count > 0;
              setIsPostTestCompleted(hasResults);
            }
          }
        } catch (error) {
          console.error("Error fetching statuses:", error);
        }
      }
    };

    fetchStatuses();
  }, [courseId, user?.user?.user_id]);

  // Auto-add first topic to progress
  useEffect(() => {
    if (
      course &&
      !hasAutoAddedFirstTopic &&
      course.lessons &&
      course.lessons.length > 0 &&
      course.lessons[0].topics &&
      course.lessons[0].topics.length > 0 &&
      user?.user?.user_id
    ) {
      const firstTopic = course.lessons[0].topics[0];

      // Check if the current topicId is the first topic
      if (topicId === firstTopic.topic_id) {
        handleAddToTopicProgress(firstTopic.topic_id, user.user.user_id);
        setHasAutoAddedFirstTopic(true);
      }
    }
  }, [course, topicId, user?.user?.user_id, hasAutoAddedFirstTopic]);

  const handleUpdateTopicProgress = async (topicId) => {
    try {
      const currentTopic = course?.lessons
        ?.flatMap((lesson) => lesson.topics)
        .find((topic) => topic.topic_id === topicId);

      if (currentTopic?.progress?.is_completed) {
        return;
      }

      const { success, message } = await updateTopicProgress(topicId, user?.user.user_id);

      if (!success) {
        return toast.error(message);
      }

      refetch();
      console.log(message);
      return toast.success("Topic progress updated");
    } catch (error) {
      toast.error(error.message || "Failed to update progress");
    }
  };

  const handleAddToTopicProgress = async (topicId, userId) => {
    try {
      const { success, message } = await addToTopicProgress(topicId, userId);

      if (!success) {
        return toast.error(message);
      }

      refetch();
    } catch (error) {
      console.error("Error adding to topic progress:", error);
    }
  };

  const handleTestNavigation = (testType) => {
    if (!courseId) return;

    setIsNavigating(true);
    router.push(`/student/courses/${courseId}/tests`, {
      scroll: false,
    });
  };

  const handleEvaluationNavigation = () => {
    if (!courseId) return;

    // Check if post-test is completed
    if (!isPostTestCompleted) {
      toast.info("Please complete the post-test before accessing the evaluation");
      handleTestNavigation("post");
      return;
    }

    setIsNavigating(true);
    router.push(`/student/courses/${courseId}/evaluation`, {
      scroll: false,
    });
  };

  const sidebarRef = useRef(null);

  useEffect(() => {
    setOpen(false);
  }, []);

  if (isLoading) return null;
  if (!course) return <div>Error loading course content</div>;

  const toggleLesson = (lessonTitle) => {
    setExpandedSections((prevSections) =>
      prevSections.includes(lessonTitle)
        ? prevSections.filter((title) => title !== lessonTitle)
        : [...prevSections, lessonTitle]
    );
  };

  const handleTopicClick = async (courseId, topicId) => {
    if (params.topicId !== topicId) {
      try {
        // Check if pre-test is completed
        const preTestStatus = await checkPreTestCompletion(
          user?.user.user_id,
          courseId
        );
        
        if (preTestStatus.success) {
          // If pre-test exists and is not completed, redirect to tests page
          if (preTestStatus.data.pre_test_exists && !preTestStatus.data.pre_test_completed) {
            toast.info("Please complete the pre-test before accessing course content");
            setIsNavigating(true);
            router.push(`/student/courses/${courseId}/tests`, {
              scroll: false,
            });
            return;
          }
        }
        
        // If pre-test is completed or doesn't exist, proceed to topic
        setIsNavigating(true);
        router.push(`/student/courses/${courseId}/topic/${topicId}`, {
          scroll: false,
        });

        handleAddToTopicProgress(topicId, user?.user.user_id);
      } catch (error) {
        console.error("Error checking pre-test status:", error);
        // If there's an error, proceed to topic as fallback
        setIsNavigating(true);
        router.push(`/student/courses/${courseId}/topic/${topicId}`, {
          scroll: false,
        });

        handleAddToTopicProgress(topicId, user?.user.user_id);
      }
    }
  };

  // Check if evaluation is completed
  const isEvaluationCompleted = evaluationStatus && evaluationStatus.length > 0;

  return (
    <div ref={sidebarRef} className="chapters-sidebar">
      <div className="chapters-sidebar__header">
        <h2 className="chapters-sidebar__title">{course?.title}</h2>
        <hr className="chapters-sidebar__divider" />
      </div>
      <div>
        <div className="chapters-sidebar__section">
          <div
            className="chapters-sidebar__section-header cursor-pointer"
            onClick={() => handleTestNavigation("pre")}
          >
            <div className="chapters-sidebar__section-title-wrapper">
              <p className="text-lg flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5 text-primary-700" />
                PRE-TEST
              </p>
            </div>
            <h3 className="chapters-sidebar__section-title">
              How much do you know?
            </h3>
          </div>
          <hr className="chapters-sidebar__divider" />
        </div>
      </div>
      {course.lessons.map((lesson, index) => (
        <Lesson
          key={lesson.lesson_id}
          lesson={lesson}
          index={index}
          lessonProgress={currentUserLessonProgress}
          topicId={topicId}
          courseId={courseId}
          expandedLessons={expandedSections}
          toggleLesson={toggleLesson}
          handleTopicClick={handleTopicClick}
          updateTopicProgress={handleUpdateTopicProgress}
        />
      ))}

      <div>
        <div className="chapters-sidebar__section">
          <div
            className="chapters-sidebar__section-header cursor-pointer"
            onClick={() => handleTestNavigation("post")}
          >
            <div className="chapters-sidebar__section-title-wrapper">
              <p className="text-lg flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5 text-primary-700" />
                POST-TEST
              </p>
            </div>
            <h3 className="chapters-sidebar__section-title">
              Learning Evaluation
            </h3>
          </div>
          <hr className="chapters-sidebar__divider" />
        </div>
      </div>

      <div>
        <div className={cn(
          "chapters-sidebar__section",
          !isPostTestCompleted && "opacity-50"
        )}>
          <div
            className={cn(
              "chapters-sidebar__section-header",
              isPostTestCompleted ? "cursor-pointer" : "cursor-not-allowed"
            )}
            onClick={handleEvaluationNavigation}
          >
            <div className="chapters-sidebar__section-title-wrapper">
              <p className="text-lg flex items-center">
                {!isPostTestCompleted ? (
                  <Lock className="mr-2 h-5 w-5 text-gray-500" />
                ) : isEvaluationCompleted ? (
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                ) : (
                  <Award className="mr-2 h-5 w-5 text-primary-700" />
                )}
                EVALUATION
              </p>
            </div>
            <h3 className="chapters-sidebar__section-title">
              {!isPostTestCompleted 
                ? "Complete Post-Test First" 
                : isEvaluationCompleted 
                  ? "Course Feedback Submitted" 
                  : "Share Your Experience"
              }
            </h3>
          </div>
          <hr className="chapters-sidebar__divider" />
        </div>
      </div>
    </div>
  );
};

const Lesson = ({
  lesson,
  index,
  lessonProgress,
  topicId,
  courseId,
  expandedLessons,
  toggleLesson,
  handleTopicClick,
  updateTopicProgress,
}) => {
  const completedTopics = lesson?.topic_progress.completed;

  const totalTopics = lesson?.topic_progress.total;

  const isExpanded = expandedLessons.includes(lesson?.lesson_title);

  return (
    <div className="chapters-sidebar__section">
      <div
        onClick={() => toggleLesson(lesson.lesson_title)}
        className="chapters-sidebar__section-header"
      >
        <div className="chapters-sidebar__section-title-wrapper">
          <p className="chapters-sidebar__section-number">
            Lesson 0{index + 1}
          </p>
          {isExpanded ? (
            <ChevronUp className="chapters-sidebar__chevron" />
          ) : (
            <ChevronDown className="chapters-sidebar__chevron" />
          )}
        </div>
        <h3 className="chapters-sidebar__section-title">
          {lesson.lesson_title}
        </h3>
      </div>
      <hr className="chapters-sidebar__divider" />

      {isExpanded && (
        <div className="chapters-sidebar__section-content">
          <ProgressVisuals
            lesson={lesson}
            lessonProgress={lessonProgress}
            completedTopics={completedTopics}
            totalTopics={totalTopics}
          />
          <TopicsList
            lesson={lesson}
            lessonProgress={lessonProgress}
            topicId={topicId}
            courseId={courseId}
            handleTopicClick={handleTopicClick}
            updateTopicProgress={updateTopicProgress}
          />
        </div>
      )}
      <hr className="chapters-sidebar__divider" />
    </div>
  );
};

const ProgressVisuals = ({ lesson, completedTopics, totalTopics }) => {
  return (
    <>
      <div className="chapters-sidebar__progress">
        <div className="chapters-sidebar__progress-bars">
          {lesson.topics.map((topic) => {
            const isCompleted = topic.progress.is_completed;

            return (
              <div
                key={topic.topic_id}
                className={cn(
                  "chapters-sidebar__progress-bar",
                  isCompleted && "chapters-sidebar__progress-bar--completed"
                )}
              />
            );
          })}
        </div>
        <div
          className={cn(
            "chapters-sidebar__trophy",
            completedTopics === totalTopics &&
              "chapters-sidebar__trophy--completed"
          )}
        >
          <Trophy className="chapters-sidebar__trophy-icon" />
        </div>
      </div>
      <p className="chapters-sidebar__progress-text">
        {completedTopics}/{totalTopics} COMPLETED
      </p>
    </>
  );
};

const TopicsList = ({
  lesson,
  lessonProgress,
  topicId,
  courseId,
  handleTopicClick,
  updateTopicProgress,
}) => {
  return (
    <ul className="chapters-sidebar__chapters">
      {lesson.topics.map((topic, index) => (
        <Topics
          key={topic.topic_id}
          topic={topic}
          index={index}
          lessonId={lesson.lesson_id}
          lessonProgress={lessonProgress}
          chapterId={topic.topic_id}
          courseId={courseId}
          handleTopicClick={handleTopicClick}
          updateTopicProgress={updateTopicProgress}
        />
      ))}
    </ul>
  );
};

const Topics = ({
  topic,
  index,
  topicId,
  courseId,
  handleTopicClick,
  updateTopicProgress,
}) => {
  const isCompleted = topic.progress.is_completed;
  const isCurrentTopic = topicId === topic.topic_id;

  const handleToggleComplete = (e) => {
    e.stopPropagation();
    // alert(1);
  };

  return (
    <li
      className={cn("chapters-sidebar__chapter", {
        "chapters-sidebar__chapter--current": isCurrentTopic,
      })}
    >
      {isCompleted ? (
        <div
          className="chapters-sidebar__chapter-check"
          onClick={handleToggleComplete}
          title="Toggle completion status"
        >
          <CheckCircle className="chapters-sidebar__check-icon" />
        </div>
      ) : (
        <div
          className={cn("chapters-sidebar__chapter-number", {
            "chapters-sidebar__chapter-number--current": isCurrentTopic,
          })}
          // onClick={handleToggleComplete}
        >
          {index + 1}
        </div>
      )}

      <div
        className="flex-1 flex items-center cursor-pointer"
        onClick={() => handleTopicClick(courseId, topic.topic_id)}
      >
        <span
          className={cn("chapters-sidebar__chapter-title", {
            "chapters-sidebar__chapter-title--completed": isCompleted,
            "chapters-sidebar__chapter-title--current": isCurrentTopic,
          })}
        >
          {topic.topic_title}
        </span>
        {getFileType(topic?.materials?.[0]?.file_name) === "pdf" ? (
          <FileText className="chapters-sidebar__text-icon" />
        ) : (
          <FileVideo className="chapters-sidebar__text-icon" />
        )}
      </div>
    </li>
  );
};

export default ChaptersSidebar;
