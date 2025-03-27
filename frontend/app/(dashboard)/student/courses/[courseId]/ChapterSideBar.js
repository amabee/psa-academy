import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle,
  Trophy,
  FileVideo,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { cn, getFileType } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useUser } from "@/app/providers/UserProvider";
import { getCourseLessonContents } from "@/queries/student/student_course";
import { useAppStore, useNavigationStore } from "@/store/stateStore";
import { toast } from "sonner";
import { updateTopicProgress } from "@/lib/actions/students/action";

const ChaptersSidebar = () => {
  const router = useRouter();
  const { setOpen } = useSidebar();
  const [expandedSections, setExpandedSections] = useState([]);

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

  const handleUpdateTopicProgress = async (topicId) => {
    try {
      const currentTopic = course?.lessons
        ?.flatMap((lesson) => lesson.topics)
        .find((topic) => topic.topic_id === topicId);

      if (currentTopic?.progress?.is_completed) {
        return;
      }

      const { success, message } = await updateTopicProgress(topicId);

      if (!success) {
        return toast.error(message);
      }

      refetch();
      return toast.success("Topic progress updated");
    } catch (error) {
      toast.error(error.message || "Failed to update progress");
    }
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

  const handleTopicClick = (courseId, topicId) => {
    if (params.topicId !== topicId) {
      setIsNavigating(true);
      router.push(`/student/courses/${courseId}/topic/${topicId}`, {
        scroll: false,
      });
    }
  };

  return (
    <div ref={sidebarRef} className="chapters-sidebar">
      <div className="chapters-sidebar__header">
        <h2 className="chapters-sidebar__title">{course?.title}</h2>
        <hr className="chapters-sidebar__divider" />
      </div>
      <div>
        <div className="chapters-sidebar__section">
          <div className="chapters-sidebar__section-header">
            <div className="chapters-sidebar__section-title-wrapper">
              <p className=" text-lg">PRE-TEST</p>
            </div>
            <h3 className="chapters-sidebar__section-title">
              How much do you know?
            </h3>
          </div>
          <hr className="chapters-sidebar__divider" />

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
          <div className="chapters-sidebar__section-header">
            <div className="chapters-sidebar__section-title-wrapper">
              <p className=" text-lg">POST-TEST</p>
            </div>
            <h3 className="chapters-sidebar__section-title">
              Learning Evaluation
            </h3>
          </div>
          <hr className="chapters-sidebar__divider" />

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
