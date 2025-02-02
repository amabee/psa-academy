import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle,
  Trophy,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useUser } from "@/app/providers/UserProvider";
import { getCourseLessonContents } from "@/queries/student/student_course";

const ChaptersSidebar = () => {
  const router = useRouter();
  const { setOpen } = useSidebar();
  const [expandedSections, setExpandedSections] = useState([]);
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

  const userProgress = [];

  const currentCourse = course?.course_id === courseId ? course?.course_id : "";

  const currentUserLessonProgress = course?.progress.lesson_progress;

  const updateChapterProgress = () => {
    alert(1);
  };

  const sidebarRef = useRef(null);

  useEffect(() => {
    setOpen(false);
  }, []);

  if (isLoading) return <div>Loading</div>;
  if (!course || !userProgress) return <div>Error loading course content</div>;

  const toggleLesson = (lessonTitle) => {
    setExpandedSections((prevSections) =>
      prevSections.includes(lessonTitle)
        ? prevSections.filter((title) => title !== lessonTitle)
        : [...prevSections, lessonTitle]
    );
  };

  const handleChapterClick = (sectionId, chapterId) => {
    // router.push(`/student/courses/${courseId}/chapters/${chapterId}`, {
    //   scroll: false,
    // });
  };

  return (
    <div ref={sidebarRef} className="chapters-sidebar">
      <div className="chapters-sidebar__header">
        <h2 className="chapters-sidebar__title">{currentCourse.title}</h2>
        <hr className="chapters-sidebar__divider" />
      </div>
      {course.lessons.map((lesson, index) => (
        <Lesson
          key={lesson.lesson_id}
          lesson={lesson}
          index={index}
          lessonProgress={currentUserLessonProgress}
          topicId={lessonId}
          courseId={courseId}
          expandedLessons={expandedSections}
          toggleLesson={toggleLesson}
          // handleChapterClick={handleChapterClick}
          // updateChapterProgress={updateChapterProgress}
        />
      ))}
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
  handleChapterClick,
  updateChapterProgress,
}) => {
  const completedTopics = lesson?.topic_progress.completed;

  const totalTopics = lesson?.topic_progress.total;

  const isExpanded = expandedLessons.includes(lesson?.lesson_title);

  console.log("SHT!", lessonProgress);

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
            handleTopicClick={handleChapterClick}
            updateTopicProgress={updateChapterProgress}
          />
        </div>
      )}
      <hr className="chapters-sidebar__divider" />
    </div>
  );
};

const ProgressVisuals = ({
  lesson,
  lessonProgress,
  completedTopics,
  totalTopics,
}) => {
  return (
    <>
      <div className="chapters-sidebar__progress">
        <div className="chapters-sidebar__progress-bars">
          {lesson.topics.map((topic) => {
            const isCompleted =
              lesson?.topic_progress?.completed === 1 ? true : false;
            return (
              <div
                key={topic.topic_id}
                className={cn(
                  "chapters-sidebar__progress-bar",
                  isCompleted && "chapters-sidebar__progress-bar--completed"
                )}
              ></div>
            );
          })}
        </div>
        <div className="chapters-sidebar__trophy">
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
          // handleChapterClick={handleChapterClick}
          // updateChapterProgress={updateChapterProgress}
        />
      ))}
    </ul>
  );
};

const Topics = ({
  topic,
  index,
  lessonId,
  lessonProgress,
  topicId,
  courseId,
  handleTopicClick,
  updateTopicProgress,
}) => {
  const topicProgress = lessonProgress;

  console.log("Lesson Progress : ", lessonProgress);

  const isCompleted = topicProgress === 1 ? true : false;

  const isCurrentTopic = topicId === topic.topic_id;

  const handleToggleComplete = (e) => {
    // e.stopPropagation();
    // updateChapterProgress(sectionId, chapter.chapterId, !isCompleted);
  };

  return (
    <li
      className={cn("chapters-sidebar__chapter", {
        "chapters-sidebar__chapter--current": isCurrentTopic,
      })}
      // onClick={() => handleChapterClick(sectionId, chapter.chapterId)}
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
        >
          {index + 1}
        </div>
      )}
      <span
        className={cn("chapters-sidebar__chapter-title", {
          "chapters-sidebar__chapter-title--completed": isCompleted,
          "chapters-sidebar__chapter-title--current": isCurrentTopic,
        })}
      >
        {topic.topic_title}
      </span>
      {/* {topic.type === "Text" && (
        <FileText className="chapters-sidebar__text-icon" />
      )} */}
    </li>
  );
};

export default ChaptersSidebar;
