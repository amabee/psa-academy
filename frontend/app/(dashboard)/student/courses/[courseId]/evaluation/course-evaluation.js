"use client";

import { CardFooter } from "@/components/ui/card";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Star,
  BookOpen,
  User,
  Clock,
  Target,
  MessageSquare,
  CheckCircle,
  Send,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  submitCourseEvaluation,
  getUserCourseDetails,
} from "@/lib/actions/students/action";
import { useUser } from "@/app/providers/UserProvider";

const evaluationSections = [
  {
    id: "overall",
    title: "Overall Experience",
    icon: Star,
    questions: [
      {
        id: "overall_rating",
        type: "rating",
        question: "How would you rate this course overall?",
        required: true,
      },
      {
        id: "recommend",
        type: "radio",
        question: "Would you recommend this course to others?",
        options: [
          { id: "definitely", text: "Definitely" },
          { id: "probably", text: "Probably" },
          { id: "maybe", text: "Maybe" },
          { id: "probably_not", text: "Probably not" },
          { id: "definitely_not", text: "Definitely not" },
        ],
        required: true,
      },
    ],
  },
  {
    id: "content",
    title: "Course Content",
    icon: BookOpen,
    questions: [
      {
        id: "content_quality",
        type: "rating",
        question: "How would you rate the quality of the course content?",
        required: true,
      },
      {
        id: "content_relevance",
        type: "rating",
        question: "How relevant was the content to your learning goals?",
        required: true,
      },
      {
        id: "content_difficulty",
        type: "radio",
        question: "How would you describe the difficulty level?",
        options: [
          { id: "too_easy", text: "Too easy" },
          { id: "just_right", text: "Just right" },
          { id: "challenging", text: "Appropriately challenging" },
          { id: "too_difficult", text: "Too difficult" },
        ],
        required: true,
      },
    ],
  },
  {
    id: "instructor",
    title: "Instructor Performance",
    icon: User,
    questions: [
      {
        id: "instructor_knowledge",
        type: "rating",
        question: "How knowledgeable was the instructor?",
        required: true,
      },
      {
        id: "instructor_communication",
        type: "rating",
        question: "How clear was the instructor's communication?",
        required: true,
      },
      {
        id: "instructor_support",
        type: "rating",
        question: "How supportive was the instructor?",
        required: true,
      },
    ],
  },
  {
    id: "experience",
    title: "Learning Experience",
    icon: Target,
    questions: [
      {
        id: "learning_objectives",
        type: "radio",
        question: "Did the course meet your learning objectives?",
        options: [
          { id: "exceeded", text: "Exceeded expectations" },
          { id: "met", text: "Met expectations" },
          { id: "partially", text: "Partially met" },
          { id: "did_not_meet", text: "Did not meet" },
        ],
        required: true,
      },
      {
        id: "pace",
        type: "radio",
        question: "How was the pace of the course?",
        options: [
          { id: "too_slow", text: "Too slow" },
          { id: "just_right", text: "Just right" },
          { id: "too_fast", text: "Too fast" },
        ],
        required: true,
      },
      {
        id: "engagement",
        type: "rating",
        question: "How engaging was the course material?",
        required: true,
      },
    ],
  },
  {
    id: "feedback",
    title: "Additional Feedback",
    icon: MessageSquare,
    questions: [
      {
        id: "liked_most",
        type: "textarea",
        question: "What did you like most about this course?",
        placeholder:
          "Share what you enjoyed most about your learning experience...",
        required: false,
      },
      {
        id: "improvements",
        type: "textarea",
        question: "What could be improved?",
        placeholder: "Share your suggestions for improving this course...",
        required: false,
      },
      {
        id: "additional_comments",
        type: "textarea",
        question: "Any additional comments?",
        placeholder: "Share any other thoughts or feedback...",
        required: false,
      },
    ],
  },
];

const StarRating = ({ value, onChange, size = "lg" }) => {
  const [hoverValue, setHoverValue] = useState(0);
  const starSize = size === "lg" ? "w-8 h-8" : "w-6 h-6";

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${starSize} transition-all duration-200 hover:scale-110`}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          onClick={() => onChange(star)}
        >
          <Star
            className={`w-full h-full ${
              star <= (hoverValue || value)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-customgreys-dirtyGrey hover:text-yellow-400"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default function CourseEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const user = useUser();
  const { courseId } = params;

  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationCompleted, setEvaluationCompleted] = useState(false);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId || !user) return;

      try {
        setLoading(true);
        const result = await getUserCourseDetails(user.user.user_id, courseId);

        if (result.success) {
          setCourse(result.data);
        } else {
          toast.error("Failed to load course data");
        }
      } catch (error) {
        toast.error("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId, user]);

  console.log("COURSE TO BE RATED: ", course);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSectionNavigation = (sectionIndex) => {
    setCurrentSection(sectionIndex);
  };

  const handlePrevSection = () => {
    setCurrentSection((prev) => Math.max(0, prev - 1));
  };

  const handleNextSection = () => {
    setCurrentSection((prev) =>
      Math.min(evaluationSections.length - 1, prev + 1)
    );
  };

  const handleSubmitEvaluation = async () => {
    if (isSubmitting || !user) return;

    // Check required fields
    const requiredQuestions = evaluationSections.flatMap((section) =>
      section.questions.filter((q) => q.required).map((q) => q.id)
    );

    const missingAnswers = requiredQuestions.filter((qId) => !answers[qId]);

    if (missingAnswers.length > 0) {
      toast.error("Please complete all required fields before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitCourseEvaluation(
        courseId,
        user.user.user_id,
        "course",
        answers
      );

      if (result.success) {
        setEvaluationCompleted(true);
        toast.success("Evaluation submitted successfully!");
      } else {
        toast.error(result.message || "Failed to submit evaluation");
      }
    } catch (error) {
      toast.error("Failed to submit evaluation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCompletionPercentage = () => {
    const totalQuestions = evaluationSections.flatMap(
      (section) => section.questions
    ).length;
    const answeredQuestions = Object.keys(answers).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const getSectionCompletion = (sectionIndex) => {
    const section = evaluationSections[sectionIndex];
    const sectionQuestions = section.questions.map((q) => q.id);
    const answeredInSection = sectionQuestions.filter(
      (qId) => answers[qId]
    ).length;
    return answeredInSection / sectionQuestions.length;
  };

  const navigateToCourse = () => {
    router.push(`/student/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading">
          <div className="loading__spinner" />
          <span className="loading__text">Loading evaluation...</span>
        </div>
      </div>
    );
  }

  if (evaluationCompleted) {
    return (
      <div className="min-h-screen bg-customgreys-primarybg p-8">
        <Card className="max-w-4xl mx-auto bg-customgreys-secondarybg border-none">
          <CardHeader>
            <CardTitle className="text-3xl text-center font-bold">
              Thank You!
            </CardTitle>
            <CardDescription className="text-center text-lg mt-2">
              Your evaluation has been submitted successfully. Your feedback
              helps us improve the learning experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-8 shadow-lg">
              <CheckCircle className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Evaluation Complete</h3>
            <p className="text-customgreys-dirtyGrey mb-8 text-center max-w-md">
              Thank you for taking the time to evaluate "{course?.title}". Your
              feedback is valuable and will help us enhance future learning
              experiences.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-2xl">
              <div className="bg-customgreys-primarybg p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary-500">
                  {getCompletionPercentage()}%
                </div>
                <div className="text-sm text-customgreys-dirtyGrey">
                  Completion Rate
                </div>
              </div>
              <div className="bg-customgreys-primarybg p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary-500">
                  {Object.keys(answers).length}
                </div>
                <div className="text-sm text-customgreys-dirtyGrey">
                  Questions Answered
                </div>
              </div>
              <div className="bg-customgreys-primarybg p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary-500">
                  {evaluationSections.length}
                </div>
                <div className="text-sm text-customgreys-dirtyGrey">
                  Sections Completed
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <Button
              onClick={navigateToCourse}
              className="bg-primary-700 hover:bg-primary-600 px-8 py-3 text-lg"
            >
              Return to Course
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!course) return null;

  const currentSectionData = evaluationSections[currentSection];
  const isLastSection = currentSection === evaluationSections.length - 1;

  return (
    <div className="min-h-screen bg-customgreys-primarybg">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Course Evaluation</h1>
                  <p className="text-customgreys-dirtyGrey text-lg">
                    Help us improve by sharing your experience with "
                    {course.title}"
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-primary-700 text-white px-4 py-2"
                >
                  {currentSection + 1} of {evaluationSections.length}
                </Badge>
              </div>

              {/* Course Info */}
              <Card className="bg-customgreys-secondarybg border-none shadow-lg mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-customgreys-dirtyGrey">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {course.teacher_firstname} {course.teacher_lastname}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.progress?.completed_topics || 0}/
                          {course.progress?.total_topics || 0} topics
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-500">
                        {course.progress && course.progress.total_topics > 0
                          ? Math.round(
                              (course.progress.completed_topics /
                                course.progress.total_topics) *
                                100
                            )
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-customgreys-dirtyGrey">
                        Complete
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Bar */}
              <div className="bg-customgreys-secondarybg p-6 rounded-xl shadow-lg">
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-medium">Evaluation Progress</span>
                  <span className="font-medium text-primary-500">
                    {getCompletionPercentage()}% Complete
                  </span>
                </div>
                <Progress value={getCompletionPercentage()} className="h-3" />
              </div>
            </div>

            {/* Section Content */}
            <Card className="bg-customgreys-secondarybg border-none shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center">
                    <currentSectionData.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {currentSectionData.title}
                    </CardTitle>
                    <CardDescription>
                      Section {currentSection + 1} of{" "}
                      {evaluationSections.length}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {currentSectionData.questions.map((question, index) => (
                  <div key={question.id} className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-customgreys-primarybg rounded-full flex items-center justify-center text-sm font-medium mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <Label className="text-base font-medium leading-relaxed">
                          {question.question}
                          {question.required && (
                            <span className="text-red-400 ml-1">*</span>
                          )}
                        </Label>

                        <div className="mt-4">
                          {question.type === "rating" && (
                            <div className="flex items-center gap-4">
                              <StarRating
                                value={answers[question.id] || 0}
                                onChange={(value) =>
                                  handleAnswerChange(question.id, value)
                                }
                              />
                              {answers[question.id] && (
                                <span className="text-sm text-customgreys-dirtyGrey">
                                  {answers[question.id]} out of 5 stars
                                </span>
                              )}
                            </div>
                          )}

                          {question.type === "radio" && (
                            <RadioGroup
                              value={answers[question.id] || ""}
                              onValueChange={(value) =>
                                handleAnswerChange(question.id, value)
                              }
                              className="space-y-3"
                            >
                              {question.options.map((option) => (
                                <div
                                  key={option.id}
                                  className="flex items-center space-x-3 bg-customgreys-primarybg/50 hover:bg-customgreys-primarybg p-3 rounded-lg transition-colors"
                                >
                                  <RadioGroupItem
                                    value={option.id}
                                    id={`${question.id}-${option.id}`}
                                    className="data-[state=checked]:bg-primary-700 data-[state=checked]:border-primary-700"
                                  />
                                  <Label
                                    htmlFor={`${question.id}-${option.id}`}
                                    className="flex-grow cursor-pointer"
                                  >
                                    {option.text}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          )}

                          {question.type === "textarea" && (
                            <Textarea
                              value={answers[question.id] || ""}
                              onChange={(e) =>
                                handleAnswerChange(question.id, e.target.value)
                              }
                              placeholder={question.placeholder}
                              className="min-h-[120px] bg-customgreys-primarybg border-customgreys-dirtyGrey/30 focus:border-primary-700"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {index < currentSectionData.questions.length - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevSection}
                  disabled={currentSection === 0}
                  className="bg-customgreys-primarybg border-customgreys-dirtyGrey text-white-50 hover:bg-customgreys-darkerGrey px-6"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>

                {isLastSection ? (
                  <Button
                    onClick={handleSubmitEvaluation}
                    disabled={isSubmitting}
                    className="bg-primary-700 hover:bg-primary-600 px-8"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Submitting..." : "Submit Evaluation"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextSection}
                    className="bg-primary-700 hover:bg-primary-600 px-6"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-customgreys-secondarybg border-l border-customgreys-dirtyGrey/20 p-6 overflow-y-auto">
          <div className="sticky top-0">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-700" />
                Evaluation Sections
              </h3>
              <p className="text-sm text-customgreys-dirtyGrey">
                Track your progress through each section
              </p>
            </div>

            <Separator className="mb-6" />

            {/* Section Navigation */}
            <div className="space-y-3 mb-6">
              {evaluationSections.map((section, index) => {
                const completion = getSectionCompletion(index);
                const isCurrent = index === currentSection;
                const isCompleted = completion === 1;

                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionNavigation(index)}
                    className={`
                      w-full p-4 rounded-lg text-left transition-all duration-200 
                      ${
                        isCurrent
                          ? "bg-primary-700 text-white shadow-lg"
                          : isCompleted
                          ? "bg-green-600/20 border border-green-600/30 hover:bg-green-600/30"
                          : "bg-customgreys-primarybg hover:bg-customgreys-darkerGrey"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <section.icon
                        className={`w-5 h-5 ${
                          isCurrent ? "text-white" : "text-primary-700"
                        }`}
                      />
                      <span className="font-medium text-sm">
                        {section.title}
                      </span>
                      {isCompleted && !isCurrent && (
                        <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-black/20 rounded-full h-1.5">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isCurrent ? "bg-white" : "bg-primary-500"
                          }`}
                          style={{ width: `${completion * 100}%` }}
                        />
                      </div>
                      <span className="text-xs opacity-75">
                        {Math.round(completion * 100)}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <Separator className="mb-6" />

            {/* Overall Progress */}
            <div className="space-y-4">
              <div className="bg-customgreys-primarybg p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-primary-500 font-semibold">
                    {getCompletionPercentage()}%
                  </span>
                </div>
                <Progress value={getCompletionPercentage()} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-customgreys-primarybg p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-400">
                    {Object.keys(answers).length}
                  </div>
                  <div className="text-xs text-customgreys-dirtyGrey">
                    Answered
                  </div>
                </div>
                <div className="bg-customgreys-primarybg p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-yellow-400">
                    {evaluationSections.flatMap((s) => s.questions).length -
                      Object.keys(answers).length}
                  </div>
                  <div className="text-xs text-customgreys-dirtyGrey">
                    Remaining
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
