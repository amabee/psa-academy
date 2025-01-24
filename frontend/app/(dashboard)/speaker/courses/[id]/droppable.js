"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus, GripVertical } from "lucide-react";
import { useEffect } from "react";
import useLessonStore from "@/store/lessonStore";

const LessonHeader = ({ lesson, lessonIndex, dragHandleProps }) => {
  const openLessonModal = useLessonStore((state) => state.openLessonModal);
  const deleteLesson = useLessonStore((state) => state.deleteLesson);

  return (
    <div className="droppable-section__header" {...dragHandleProps}>
      <div className="droppable-section__title-wrapper">
        <div className="droppable-section__title-container">
          <div className="droppable-section__title">
            <GripVertical className="h-6 w-6 mb-1" />
            <h3 className="text-lg font-medium">{lesson.title}</h3>
          </div>
          <div className="droppable-chapter__actions">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-0"
              onClick={() => openLessonModal({ lessonIndex })}
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-0"
              onClick={() => deleteLesson(lessonIndex)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {lesson.description && (
          <p className="droppable-section__description">{lesson.description}</p>
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
        <p className="text-sm">{`${topicIndex + 1}. ${topic.title}`}</p>
      </div>
      <div className="droppable-chapter__actions">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="droppable-chapter__button"
          onClick={() => {
            // console.log("Opening topic modal for edit:", {
            //   lessonIndex,
            //   topicIndex,
            // });
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

  // Debug lessons changes
  useEffect(() => {
    // console.log("Lessons updated:", lessons);
  }, [lessons]);

  const handleLessonDragEnd = (result) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const updatedLessons = [...lessons];
    const [reorderedLesson] = updatedLessons.splice(startIndex, 1);
    updatedLessons.splice(endIndex, 0, reorderedLesson);
    setLessons(updatedLessons);
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

  // Make sure lessons exists and has topics array
  const ensureTopicsArray = (lessons) => {
    return lessons.map((lesson) => ({
      ...lesson,
      topics: Array.isArray(lesson.topics) ? lesson.topics : [],
    }));
  };

  if (!lessons) return null;

  // Ensure all lessons have a topics array
  const lessonsWithTopics = ensureTopicsArray(lessons);

  return (
    <DragDropContext onDragEnd={handleLessonDragEnd}>
      <Droppable droppableId="lessons">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {lessonsWithTopics.map((lesson, lessonIndex) => (
              <Draggable
                key={lesson.id}
                draggableId={lesson.id}
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
                                key={topic.id}
                                draggableId={topic.id}
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
                        // console.log("Opening topic modal for new topic:", {
                        //   lessonIndex,
                        //   topicIndex: null,
                        // });
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
