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
  User,
  CheckCircle,
  Send,
  ArrowLeft,
  ArrowRight,
  Award,
  GraduationCap,
  Settings,
} from "lucide-react";
import {
  submitCourseEvaluation,
  getUserCourseDetails,
} from "@/lib/actions/students/action";
import { useUser } from "@/app/providers/UserProvider";

const hrdLdEvaluationSections = [
  {
    id: "level1_workshop",
    title: "HRD-L&D Evaluation Form (Level I)",
    subtitle: "For Workshop/Training Program",
    icon: Settings,
    parts: [
      {
        id: "part1",
        title: "I. Areas of Evaluation",
        instruction:
          "Please rate the training program with respect to the following attributes in relation to the 5-point scale indicated below. Check (✓) the space provided in each item that corresponds to your assessment. The highest possible rating for any item is 5 and the lowest is 1.",
        scale:
          "5 - Outstanding; 4 - Very Satisfactory; 3 - Satisfactory; 2 - Needs Improvement; 1 - Poor",
        questions: [
          {
            id: "l1w_q1",
            type: "rating",
            question:
              "The training program helped me develop my skills and enhanced my knowledge in my current work/assignment.",
            required: true,
          },
          {
            id: "l1w_q2",
            type: "rating",
            question: "My expectations in the training program were met.",
            required: true,
          },
          {
            id: "l1w_q3",
            type: "rating",
            question: "The information is accurate and very interesting.",
            required: true,
          },
          {
            id: "l1w_q4",
            type: "rating",
            question:
              "The program followed a logical build-up of learning. There was a smooth transition of topics.",
            required: true,
          },
          {
            id: "l1w_q5",
            type: "rating",
            question:
              "Objectives/purpose of the training program were achieved.",
            required: true,
          },
          {
            id: "l1w_q6",
            type: "rating",
            question:
              "The training program addressed the current needs/concerns of the office/service/division/unit.",
            required: true,
          },
          {
            id: "l1w_q7",
            type: "rating",
            question:
              "Usefulness of the power point presentation/handouts/training materials.",
            required: true,
          },
          {
            id: "l1w_q8",
            type: "rating",
            question: "Duration of the training program.",
            required: true,
          },
          {
            id: "l1w_q9",
            type: "rating",
            question:
              "Training materials such as laptops, internet connection, and others.",
            required: true,
          },
          {
            id: "l1w_q10",
            type: "rating",
            question: "Preparation/Coordination.",
            required: true,
          },
        ],
      },
      {
        id: "part2",
        title:
          "II. Check (✓) the space provided in each item that corresponds to your assessment.",
        questions: [
          {
            id: "l1w_q11",
            type: "radio",
            question:
              "Was the workshop/training program worth attending/taking?",
            options: [
              { id: "yes", text: "Yes" },
              { id: "no", text: "No" },
            ],
            required: true,
          },
          {
            id: "l1w_q12",
            type: "radio",
            question:
              "Was the online training using Zoom/Webex conducive for learning?",
            options: [
              { id: "yes", text: "Yes" },
              { id: "no", text: "No" },
            ],
            required: true,
          },
          {
            id: "l1w_q13",
            type: "radio",
            question:
              "Would you recommend this training program to other PSA employees?",
            options: [
              { id: "yes", text: "Yes" },
              { id: "no", text: "No" },
            ],
            required: true,
          },
        ],
      },
      {
        id: "part3",
        title: "III.",
        questions: [
          {
            id: "l1w_q14",
            type: "textarea",
            question:
              "What are the things that you appreciate most about this new mode of conducting workshop/training?",
            placeholder: "Your answer here...",
            required: false,
          },
          {
            id: "l1w_q15",
            type: "textarea",
            question:
              "What are the things that should be improved in this training program?",
            placeholder: "Your answer here...",
            required: false,
          },
          {
            id: "l1w_q16",
            type: "textarea",
            question:
              "Other comments/suggestions/reactions/recommendations regarding the training program.",
            placeholder: "Your answer here...",
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: "level1_trainer",
    title: "HRD-L&D Evaluation Form (Level I)",
    subtitle: "For Resource Person/Trainer",
    icon: User,
    parts: [
      {
        id: "part1",
        title: "I. Areas of Evaluation",
        instruction:
          "Please rate the resource person/trainer with respect to the following attributes in relation to the 5-point scale indicated below. Check (✓) the space provided in each item that corresponds to your assessment. The highest possible rating for any item is 5 and the lowest is 1.",
        scale:
          "5 - Excellent; 4 - Very Satisfactory; 3 - Satisfactory; 2 - Needs Improvement; 1 - Poor",
        questions: [
          {
            id: "l1t_q1",
            type: "rating",
            question:
              "The resource person/trainer displays a thorough knowledge of the subject matter and is able to provide insights.",
            required: true,
          },
          {
            id: "l1t_q2",
            type: "rating",
            question:
              "The resource person/trainer provides concrete examples and is able to relate the topics to the needs of the participants.",
            required: true,
          },
          {
            id: "l1t_q3",
            type: "rating",
            question:
              "The resource person/trainer's ideas are presented clearly, convincingly, and logically sequenced.",
            required: true,
          },
          {
            id: "l1t_q4",
            type: "rating",
            question:
              "The resource person/trainer took time to entertain questions and ensure understanding of the participants.",
            required: true,
          },
          {
            id: "l1t_q5",
            type: "rating",
            question:
              "The resource person/trainer interacts well with the participants and engages them effectively to inspire interest and enthusiasm.",
            required: true,
          },
          {
            id: "l1t_q6",
            type: "rating",
            question:
              "The resource person/trainer explains and processes the activities thoroughly.",
            required: true,
          },
          {
            id: "l1t_q7",
            type: "rating",
            question:
              "The resource person/trainer is sensitive to the needs and able to handle concerns/work issues of the participants.",
            required: true,
          },
          {
            id: "l1t_q8",
            type: "rating",
            question:
              "The resource person/trainer strictly observes schedules.",
            required: true,
          },
          {
            id: "l1t_q9",
            type: "rating",
            question:
              "The resource person/trainer conducts himself/herself with demeanor.",
            required: true,
          },
          {
            id: "l1t_q10",
            type: "rating",
            question:
              "The resource person/trainer observes gender sensitivity and gender fair language.",
            required: true,
          },
        ],
      },
      {
        id: "part2",
        title: "II.",
        questions: [
          {
            id: "l1t_q11",
            type: "textarea",
            question:
              "Other comments/suggestions/reactions/recommendations regarding the performance/presentation of the resource person/trainer and the new mode of conducting training.",
            placeholder: "Your answer here...",
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: "level2_learning",
    title: "HRD-L&D Evaluation Form (Level II)",
    subtitle: "For Personal Learning - ACTION PLAN AFTER TRAINING",
    icon: GraduationCap,
    parts: [
      {
        id: "part1",
        title: "*Please write legibly.",
        questions: [
          {
            id: "l2_q1",
            type: "textarea",
            question:
              "1. What significant learning/s did you gain from the training that you can apply to your current or future role in PSA and how? (Ano ang pinakamahalagang natutunan mo sa pagsasanay na ito na maaring magamit sa iyong kasalukuyan o hinaharap na tungkulin sa PSA at paano mo ito gagamitin?)",
            placeholder: "Your answer here...",
            required: true,
          },
          {
            id: "l2_q2",
            type: "textarea",
            question:
              "2. Among those learning/s, what are the things that you need to improve and how? (Sa mga natutunan mo, ano pa ang kailangan at paano mo ito pagbubutihin?)",
            placeholder: "Your answer here...",
            required: true,
          },
        ],
      },
    ],
  },
];

const StarRating = ({ value, onChange, size = "lg" }) => {
  const [hoverValue, setHoverValue] = useState(0);
  const starSize = size === "lg" ? "w-8 h-8" : "w-6 h-6";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          className="transition-colors duration-200"
        >
          <Star
            className={`${starSize} ${
              star <= (hoverValue || value)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const QuestionComponent = ({ question, value, onChange, scale }) => {
  switch (question.type) {
    case "rating":
      return (
        <div className="space-y-3">
          <Label className="text-base font-medium">
            {question.question}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <StarRating value={value || 0} onChange={onChange} size="lg" />
          {scale && (
            <div className="text-sm text-gray-500 bg-gray-100 p-2 rounded-md">
              <span className="font-semibold">Scale:</span> {scale}
            </div>
          )}
        </div>
      );

    case "radio":
      return (
        <div className="space-y-3">
          <Label className="text-base font-medium">
            {question.question}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <RadioGroup
            value={value || ""}
            onValueChange={onChange}
            className="flex gap-4"
          >
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.id}
                  id={question.id + option.id}
                />
                <Label htmlFor={question.id + option.id} className="text-sm">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-3">
          <Label className="text-base font-medium">
            {question.question}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            className="min-h-[120px]"
          />
        </div>
      );

    default:
      return null;
  }
};

export default function HRDLDEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const user = useUser();
  const { courseId } = params;

  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId || !user) return;

      try {
        const result = await getUserCourseDetails(user.user?.user_id, courseId);
        if (result.success) {
          setCourseData(result.data);
        } else {
          toast.error("Failed to load course data");
        }
      } catch (error) {
        toast.error("Failed to load course data");
      }
    };

    loadCourse();
  }, [courseId, user]);

  console.log(courseData);

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
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleNextSection = () => {
    if (currentSection < hrdLdEvaluationSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleSubmitEvaluation = async () => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setLoading(true);

    try {
      const allQuestions = hrdLdEvaluationSections.flatMap((section) =>
        section.parts.flatMap((part) => part.questions)
      );

      const missingRequired = allQuestions.filter(
        (q) => q.required && !answers[q.id]
      );

      if (missingRequired.length > 0) {
        toast.error(
          "Please answer all required questions before submitting. Missing " +
            missingRequired.length +
            " required questions."
        );
        setLoading(false);
        return;
      }

      const result = await submitCourseEvaluation(
        courseId,
        user.user.user_id,
        "hrd-ld",
        answers
      );

      if (result.success) {
        toast.success("Evaluation submitted successfully!");
        router.push(`/student/courses/${courseId}`);
      } else {
        toast.error(result.message || "Failed to submit evaluation");
      }
    } catch (error) {
      toast.error("Failed to submit evaluation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCompletionPercentage = () => {
    const totalQuestions = hrdLdEvaluationSections.flatMap((section) =>
      section.parts.flatMap((part) => part.questions)
    ).length;
    const answeredQuestions = Object.keys(answers).length;
    return totalQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;
  };

  const getSectionCompletion = (sectionIndex) => {
    const section = hrdLdEvaluationSections[sectionIndex];
    const requiredQuestions = section.parts
      .flatMap((part) => part.questions)
      .filter((q) => q.required);
    const answeredRequired = requiredQuestions.filter((q) => answers[q.id]);
    return requiredQuestions.length > 0
      ? Math.round((answeredRequired.length / requiredQuestions.length) * 100)
      : 100;
  };

  const navigateToCourse = () => {
    router.push(`/student/courses/${courseId}`);
  };

  if (!courseData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading">
          <div className="loading__spinner" />
          <span className="loading__text">Loading evaluation...</span>
        </div>
      </div>
    );
  }

  const currentSectionData = hrdLdEvaluationSections[currentSection];
  const SectionIcon = currentSectionData.icon;

  return (
    <div className="min-h-screen bg-customgreys-primarybg">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="outline"
              onClick={navigateToCourse}
              className="bg-customgreys-primarybg border-customgreys-dirtyGrey text-white-50 hover:bg-customgreys-darkerGrey"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Course
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">HRD-L&D Evaluation Form</h1>
              <p className="text-customgreys-dirtyGrey text-lg">
                Training Assessment
              </p>
            </div>
          </div>
          <Card className="mt-4 p-4 bg-customgreys-secondarybg border-none">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Training Program:</strong> {courseData.title}
              </div>
              <div>
                <strong>Resource Person/Trainer:</strong>{" "}
                {courseData.teacher_firstname} {courseData.teacher_middlename}{" "}
                {courseData.teacher_lastname}
              </div>
              <div>
                <strong>Date of Conduct:</strong>{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div>
                <strong>Venue:</strong> Online
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-customgreys-dirtyGrey">
                {getCompletionPercentage()}% Complete
              </span>
            </div>
            <Progress value={getCompletionPercentage()} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Section Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {hrdLdEvaluationSections.map((section, index) => {
                    const SectionNavIcon = section.icon;
                    const isActive = index === currentSection;
                    const completion = getSectionCompletion(index);

                    return (
                      <button
                        key={section.id}
                        onClick={() => handleSectionNavigation(index)}
                        className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "bg-primary-700 text-white"
                            : "hover:bg-customgreys-secondarybg"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <SectionNavIcon className="w-5 h-5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {section.title}
                            </div>
                            <div className="text-xs opacity-75">
                              {section.subtitle}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {completion === 100 && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <SectionIcon className="w-5 h-5 text-primary-700" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {currentSectionData.title}
                    </CardTitle>
                    <CardDescription>
                      {currentSectionData.subtitle}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {currentSectionData.parts.map((part) => (
                  <div key={part.id} className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">{part.title}</h3>
                    {part.instruction && (
                      <p className="text-sm text-customgreys-dirtyGrey mb-4">
                        {part.instruction}
                      </p>
                    )}
                    <div className="space-y-6">
                      {part.questions.map((question, index) => (
                        <div
                          key={question.id}
                          className="p-4 border rounded-lg"
                        >
                          <QuestionComponent
                            question={question}
                            value={answers[question.id]}
                            onChange={(value) =>
                              handleAnswerChange(question.id, value)
                            }
                            scale={part.scale}
                          />
                        </div>
                      ))}
                    </div>
                    <Separator className="my-6" />
                  </div>
                ))}
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevSection}
                  disabled={currentSection === 0}
                  className="bg-customgreys-primarybg border-customgreys-dirtyGrey text-white-50 hover:bg-customgreys-darkerGrey"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                <div className="flex gap-3">
                  {currentSection === hrdLdEvaluationSections.length - 1 ? (
                    <Button
                      onClick={handleSubmitEvaluation}
                      disabled={loading}
                      className="bg-primary-700 hover:bg-primary-600"
                    >
                      {loading ? (
                        <>
                          <div className="loading__spinner mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Evaluation
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextSection}
                      className="bg-primary-700 hover:bg-primary-600"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
