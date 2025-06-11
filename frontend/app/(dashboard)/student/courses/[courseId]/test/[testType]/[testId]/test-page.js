"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  CheckCircle2,
  FileText,
} from "lucide-react";

// Mock data - replace with your actual data fetching logic
const fetchTestQuestions = async (courseId, testType) => {
  return {
    title: testType === "pre" ? "Pre-Test Assessment" : "Post-Test Evaluation",
    description:
      testType === "pre"
        ? "Let's see how much you know before starting the course."
        : "Test your knowledge after completing the course.",
    timeLimit: 30, // minutes
    questions: [
      {
        id: "q1",
        question: "What is the primary purpose of this course?",
        options: [
          { id: "a", text: "To teach programming basics" },
          { id: "b", text: "To improve critical thinking" },
          { id: "c", text: "To enhance problem-solving skills" },
          { id: "d", text: "All of the above" },
        ],
        correctAnswer: "d",
      },
      {
        id: "q2",
        question:
          "Which of the following is NOT a key concept covered in this course?",
        options: [
          { id: "a", text: "Data structures" },
          { id: "b", text: "Algorithms" },
          { id: "c", text: "Machine learning" },
          { id: "d", text: "Logic and reasoning" },
        ],
        correctAnswer: "c",
      },
      {
        id: "q3",
        question: "How many core modules are in this course?",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "5" },
          { id: "c", text: "7" },
          { id: "d", text: "10" },
        ],
        correctAnswer: "b",
      },
      {
        id: "q4",
        question: "What is the recommended prerequisite for this course?",
        options: [
          { id: "a", text: "Advanced mathematics" },
          { id: "b", text: "Basic computer literacy" },
          { id: "c", text: "Prior programming experience" },
          { id: "d", text: "None of the above" },
        ],
        correctAnswer: "b",
      },
      {
        id: "q5",
        question: "Which learning approach is emphasized in this course?",
        options: [
          { id: "a", text: "Theoretical learning only" },
          { id: "b", text: "Practical application only" },
          { id: "c", text: "Balanced theoretical and practical approach" },
          { id: "d", text: "Self-directed learning" },
        ],
        correctAnswer: "c",
      },
      {
        id: "q6",
        question: "What is the expected duration to complete this course?",
        options: [
          { id: "a", text: "2-4 weeks" },
          { id: "b", text: "1-2 months" },
          { id: "c", text: "3-6 months" },
          { id: "d", text: "6+ months" },
        ],
        correctAnswer: "b",
      },
      {
        id: "q7",
        question: "Which assessment method is primarily used in this course?",
        options: [
          { id: "a", text: "Multiple choice quizzes only" },
          { id: "b", text: "Project-based assessments" },
          { id: "c", text: "Peer reviews" },
          { id: "d", text: "Mixed assessment methods" },
        ],
        correctAnswer: "d",
      },
      {
        id: "q8",
        question: "What level of support is provided to students?",
        options: [
          { id: "a", text: "Self-study only" },
          { id: "b", text: "Email support" },
          { id: "c", text: "Live sessions and forums" },
          { id: "d", text: "One-on-one mentoring" },
        ],
        correctAnswer: "c",
      },
    ],
  };
};

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId, testType } = params;

  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTest = async () => {
      try {
        const testData = await fetchTestQuestions(courseId, testType);
        setTest(testData);
        setTimeRemaining(testData.timeLimit * 60);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load test questions");
        setLoading(false);
      }
    };

    loadTest();
  }, [courseId, testType]);

  useEffect(() => {
    if (!timeRemaining || testCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, testCompleted]);

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleQuestionNavigation = (questionIndex) => {
    setCurrentQuestion(questionIndex);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestion((prev) => Math.max(0, prev - 1));
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => Math.min(test.questions.length - 1, prev + 1));
  };

  const handleSubmitTest = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      let correctCount = 0;
      test.questions.forEach((question) => {
        if (answers[question.id] === question.correctAnswer) {
          correctCount++;
        }
      });

      const scorePercentage = Math.round(
        (correctCount / test.questions.length) * 100
      );

      setScore(scorePercentage);
      setTestCompleted(true);
      toast.success("Test submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit test");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const navigateToCourse = () => {
    router.push(`/student/courses/${courseId}`);
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading">
          <div className="loading__spinner" />
          <span className="loading__text">Loading test...</span>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="min-h-screen bg-customgreys-primarybg p-8">
        <Card className="max-w-4xl mx-auto bg-customgreys-secondarybg border-none">
          <CardHeader>
            <CardTitle className="text-3xl text-center font-bold">
              Test Completed
            </CardTitle>
            <CardDescription className="text-center text-lg mt-2">
              {testType === "pre"
                ? "Great job completing the pre-test! Now you're ready to start learning."
                : "Congratulations on completing the course and the post-test!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-customgreys-primarybg to-customgreys-darkerGrey flex items-center justify-center mb-8 shadow-lg">
              {score >= 70 ? (
                <CheckCircle className="w-20 h-20 text-green-400" />
              ) : (
                <AlertCircle className="w-20 h-20 text-yellow-400" />
              )}
            </div>
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              {score}%
            </h3>
            <p className="text-customgreys-dirtyGrey mb-8 text-center max-w-md">
              {score >= 70
                ? "Excellent work! You've demonstrated a strong understanding of the material."
                : "Keep learning! There's always room for improvement."}
            </p>
            <div className="w-full max-w-md mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span>Your Score</span>
                <span>{score}%</span>
              </div>
              <Progress value={score} className="h-4" />
            </div>
            <div className="grid grid-cols-2 gap-6 mb-8 text-center">
              <div className="bg-customgreys-primarybg p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary-500">
                  {getAnsweredCount()}
                </div>
                <div className="text-sm text-customgreys-dirtyGrey">
                  Questions Answered
                </div>
              </div>
              <div className="bg-customgreys-primarybg p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary-500">
                  {test?.questions.length}
                </div>
                <div className="text-sm text-customgreys-dirtyGrey">
                  Total Questions
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <Button
              onClick={navigateToCourse}
              className="bg-primary-700 hover:bg-primary-600 px-8 py-3 text-lg"
            >
              {testType === "pre" ? "Start Learning" : "Return to Course"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!test) return null;

  const question = test.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;
  const isLastQuestion = currentQuestion === test.questions.length - 1;
  const allQuestionsAnswered = test.questions.every((q) => answers[q.id]);

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
                  <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
                  <p className="text-customgreys-dirtyGrey text-lg">
                    {test.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-customgreys-secondarybg px-6 py-3 rounded-xl shadow-lg">
                  <Clock className="w-6 h-6 text-primary-700" />
                  <span className="font-mono text-xl font-semibold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-customgreys-secondarybg p-6 rounded-xl shadow-lg">
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-medium">
                    Question {currentQuestion + 1} of {test.questions.length}
                  </span>
                  <span className="font-medium">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between text-xs mt-2 text-customgreys-dirtyGrey">
                  <span>{getAnsweredCount()} answered</span>
                  <span>
                    {test.questions.length - getAnsweredCount()} remaining
                  </span>
                </div>
              </div>
            </div>

            {/* Question Card */}
            <Card className="bg-customgreys-secondarybg border-none shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center text-white font-bold">
                    {currentQuestion + 1}
                  </div>
                  <div className="h-px bg-customgreys-dirtyGrey flex-1" />
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) =>
                    handleAnswerChange(question.id, value)
                  }
                  className="space-y-4"
                >
                  {question.options.map((option, index) => (
                    <div
                      key={option.id}
                      className="group relative bg-customgreys-primarybg/50 hover:bg-customgreys-primarybg border border-transparent hover:border-primary-700/30 rounded-xl p-4 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-customgreys-secondarybg text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <RadioGroupItem
                          value={option.id}
                          id={`option-${option.id}`}
                          className="data-[state=checked]:bg-primary-700 data-[state=checked]:border-primary-700"
                        />
                        <Label
                          htmlFor={`option-${option.id}`}
                          className="flex-grow cursor-pointer text-base leading-relaxed"
                        >
                          {option.text}
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                  className="bg-customgreys-primarybg border-customgreys-dirtyGrey text-white-50 hover:bg-customgreys-darkerGrey px-6"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>

                {isLastQuestion ? (
                  <Button
                    onClick={handleSubmitTest}
                    disabled={!allQuestionsAnswered || isSubmitting}
                    className="bg-primary-700 hover:bg-primary-600 px-8"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Test"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
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
                <FileText className="w-5 h-5 text-primary-700" />
                Question Navigator
              </h3>
              <p className="text-sm text-customgreys-dirtyGrey">
                Click on any question to navigate directly to it
              </p>
            </div>

            <Separator className="mb-6" />

            {/* Question Grid */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {test.questions.map((q, index) => {
                const isAnswered = answers[q.id];
                const isCurrent = index === currentQuestion;

                return (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionNavigation(index)}
                    className={`
                      relative w-12 h-12 rounded-lg font-semibold text-sm transition-all duration-200 
                      ${
                        isCurrent
                          ? "bg-primary-700 text-white shadow-lg scale-105"
                          : isAnswered
                          ? "bg-green-600 text-white hover:bg-green-500"
                          : "bg-customgreys-primarybg text-customgreys-dirtyGrey hover:bg-customgreys-darkerGrey hover:text-white-50"
                      }
                    `}
                  >
                    {index + 1}
                    {isAnswered && !isCurrent && (
                      <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-green-400 bg-customgreys-secondarybg rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <Separator className="mb-6" />

            {/* Progress Summary */}
            <div className="space-y-4">
              <div className="bg-customgreys-primarybg p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-primary-500 font-semibold">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-customgreys-primarybg p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-400">
                    {getAnsweredCount()}
                  </div>
                  <div className="text-xs text-customgreys-dirtyGrey">
                    Answered
                  </div>
                </div>
                <div className="bg-customgreys-primarybg p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-yellow-400">
                    {test.questions.length - getAnsweredCount()}
                  </div>
                  <div className="text-xs text-customgreys-dirtyGrey">
                    Remaining
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary-700 rounded"></div>
                  <span>Current Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-customgreys-primarybg rounded border border-customgreys-dirtyGrey"></div>
                  <span>Not Answered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
