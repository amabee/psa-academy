"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus, GripVertical, Loader2 } from "lucide-react";
import { useEffect } from "react";
import useLessonStore from "@/store/lessonStore";
import { updateLessonSequence } from "@/lib/actions/speaker/action";
import { toast } from "sonner";

const LessonHeader = ({ lesson, lessonIndex, dragHandleProps }) => {
  const openLessonModal = useLessonStore((state) => state.openLessonModal);
  const openDeletionModal = useLessonStore((state) => state.openDeletionModal);

  const isDeleting = useLessonStore((state) => state.courseEditor.isDeleting);

  return (
    <div
      className={`droppable-section__header relative ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
      {...dragHandleProps}
    >
      {isDeleting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
          <div className="bg-white px-4 py-2 rounded-md shadow-md flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm text-gray-700">Deleting...</span>
          </div>
        </div>
      )}
      <div className="droppable-section__title-wrapper">
        <div className="droppable-section__title-container">
          <div className="droppable-section__title">
            <GripVertical className="h-6 w-6 mb-1" />
            <h3 className="text-lg font-medium">{lesson.lesson_title}</h3>
          </div>
          <div className="droppable-chapter__actions">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-0"
              disabled={isDeleting}
              onClick={() => openLessonModal({ lessonIndex })}
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-0"
              onClick={() => openDeletionModal({ lessonIndex })}
              disabled={isDeleting}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {lesson.lesson_description && (
          <p className="droppable-section__description">
            {lesson.lesson_description}
          </p>
        )}
      </div>
    </div>
  );
};

const TopicItem = ({ topic, topicIndex, lessonIndex, draggableProvider }) => {
  const openTopicModal = useLessonStore((state) => state.openTopicModal);
  const deleteTopic = useLessonStore((state) => state.deleteTopic);

  return (
    <div
      ref={draggableProvider.innerRef}
      {...draggableProvider.draggableProps}
      {...draggableProvider.dragHandleProps}
      className={`droppable-chapter ${
        topicIndex % 2 === 1
          ? "droppable-chapter--odd"
          : "droppable-chapter--even"
      }`}
    >
      <div className="droppable-chapter__title">
        <GripVertical className="h-4 w-4 mb-[2px]" />
        <p className="text-sm">{`${topicIndex + 1}. ${topic.topic_title}`}</p>
      </div>
      <div className="droppable-chapter__actions">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="droppable-chapter__button"
          onClick={() => {
            openTopicModal({ lessonIndex, topicIndex });
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="droppable-chapter__button"
          onClick={() => deleteTopic({ lessonIndex, topicIndex })}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default function DroppableComponent() {
  const lessons = useLessonStore((state) => state.courseEditor.lessons);
  const setLessons = useLessonStore((state) => state.setLessons);
  const openTopicModal = useLessonStore((state) => state.openTopicModal);

  useEffect(() => {
    console.log("Lessons updated:", lessons);
  }, [lessons]);

  const handleLessonDragEnd = async (result) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const updatedLessons = [...lessons];
    const [reorderedLesson] = updatedLessons.splice(startIndex, 1);
    updatedLessons.splice(endIndex, 0, reorderedLesson);

    setLessons(updatedLessons);

    const lessonUpdates = updatedLessons.map((lesson, index) => ({
      lesson_id: lesson.lesson_id,
      sequence_number: index + 1,
    }));

    try {
      const { success, data, message } = await updateLessonSequence(
        lessonUpdates
      );

      if (!success) {
        setLessons(lessons);
        toast.error(message || "Failed to update lesson sequence");
      } else {
        toast.success("Lesson sequence updated successfully!");
      }
    } catch (error) {
      setLessons(lessons);
      toast.error(error.message || "An error occurred while updating sequence");
    }
  };

  const handleTopicDragEnd = (result, lessonIndex) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const updatedLessons = [...lessons];
    const updatedTopics = [...updatedLessons[lessonIndex].topics];
    const [reorderedTopic] = updatedTopics.splice(startIndex, 1);
    updatedTopics.splice(endIndex, 0, reorderedTopic);
    updatedLessons[lessonIndex].topics = updatedTopics;
    setLessons(updatedLessons);
  };

  const ensureTopicsArray = (lessons) => {
    return lessons.map((lesson) => ({
      ...lesson,
      topics: Array.isArray(lesson.topics) ? lesson.topics : [],
    }));
  };

  if (!lessons) return null;

  const lessonsWithTopics = ensureTopicsArray(lessons);

  return (
    <DragDropContext onDragEnd={handleLessonDragEnd}>
      <Droppable droppableId="lessons">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {lessonsWithTopics.map((lesson, lessonIndex) => (
              <Draggable
                key={lesson.lesson_id}
                draggableId={lesson.lesson_id}
                index={lessonIndex}
              >
                {(draggableProvider) => (
                  <div
                    ref={draggableProvider.innerRef}
                    {...draggableProvider.draggableProps}
                    className={`droppable-section ${
                      lessonIndex % 2 === 0
                        ? "droppable-section--even"
                        : "droppable-section--odd"
                    }`}
                  >
                    <LessonHeader
                      lesson={lesson}
                      lessonIndex={lessonIndex}
                      dragHandleProps={draggableProvider.dragHandleProps}
                    />

                    <DragDropContext
                      onDragEnd={(result) =>
                        handleTopicDragEnd(result, lessonIndex)
                      }
                    >
                      <Droppable droppableId={`topics-${lesson.id}`}>
                        {(droppableProvider) => (
                          <div
                            ref={droppableProvider.innerRef}
                            {...droppableProvider.droppableProps}
                            className="space-y-2"
                          >
                            {lesson.topics?.map((topic, topicIndex) => (
                              <Draggable
                                key={topic.topic_id}
                                draggableId={topic.topic_id}
                                index={topicIndex}
                              >
                                {(draggableProvider) => (
                                  <TopicItem
                                    topic={topic}
                                    topicIndex={topicIndex}
                                    lessonIndex={lessonIndex}
                                    draggableProvider={draggableProvider}
                                  />
                                )}
                              </Draggable>
                            ))}
                            {droppableProvider.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log("Opening topic modal for new topic:", {
                          lessonIndex,
                          topicIndex: null,
                        });
                        openTopicModal({ lessonIndex, topicIndex: null });
                      }}
                      className="add-chapter-button group mt-4"
                    >
                      <Plus className="add-chapter-button__icon" />
                      <span className="add-chapter-button__text">
                        Add Topic
                      </span>
                    </Button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
