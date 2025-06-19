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
import {
  getTestQuestions,
  submitTestResponses,
  getUserTestResults,
  checkPreTestCompletion,
} from "@/lib/actions/students/action";
import TestResults from "./test-results";
import { useUser } from "@/app/providers/UserProvider";

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId, testType, testId } = params;

  const user = useUser();

  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [preTestLocked, setPreTestLocked] = useState(false);
  const [preTestLockMessage, setPreTestLockMessage] = useState("");

  useEffect(() => {
    const loadTest = async () => {
      if (!testId || !user) return;

      try {
        setLoading(true);
        
        // If this is a post-test, check if pre-test is completed
        if (testType === "post") {
          const preTestStatus = await checkPreTestCompletion(user?.user?.user_id || user?.id, courseId);
          
          if (preTestStatus.success) {
            if (!preTestStatus.data.can_take_post_test) {
              setPreTestLocked(true);
              setPreTestLockMessage(
                preTestStatus.data.pre_test_exists 
                  ? "You must complete the pre-test before taking the post-test."
                  : "Pre-test is required before taking the post-test."
              );
              setLoading(false);
              return;
            }
          } else {
            toast.error("Failed to check pre-test status");
            setLoading(false);
            return;
          }
        }

        // Check if user has already taken this test
        try {
          const existingResults = await getUserTestResults(user?.user?.user_id || user?.id, testId);
          if (existingResults.success && existingResults.data) {
            setTestResults(existingResults.data);
            setTestCompleted(true);
            setScore(existingResults.data.summary.percentage_score);
            setShowResults(true);
            setLoading(false);
            return;
          }
        } catch (error) {
          // User hasn't taken this test yet, continue loading
        }

        const result = await getTestQuestions(testId);

        if (result.success) {
          setTest(result.data);
          // Set default time limit of 30 minutes if not specified
          setTimeRemaining(30 * 60);
          setLoading(false);
        } else {
          toast.error(result.message || "Failed to load test questions");
          setLoading(false);
        }
      } catch (error) {
        toast.error("Failed to load test questions");
        setLoading(false);
      }
    };

    loadTest();
  }, [testId, testType, courseId, user]);

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
    if (isSubmitting || !user) return;

    setIsSubmitting(true);

    try {
      // Convert answers to the format expected by the API
      const responses = test.questions.map((question) => {
        const answer = answers[question.question_id];
        const response = {
          question_id: question.question_id,
        };

        if (question.question_type === "multiple_choice" && answer) {
          // Find the choice ID based on the selected answer
          const selectedChoice = question.choices.find(
            (choice) => choice.choice_text === answer
          );
          response.answer_choice_id = selectedChoice
            ? selectedChoice.choice_id
            : null;
        } else if (
          question.question_type === "true_false" &&
          answer !== undefined
        ) {
          response.answer_boolean = answer ? 1 : 0;
        } else if (
          (question.question_type === "essay" ||
            question.question_type === "short_answer") &&
          answer
        ) {
          response.answer_text = answer;
        }

        return response;
      });

      const result = await submitTestResponses(testId, user?.user?.user_id || user?.id, responses);

      if (result.success) {
        setScore(result.data.percentage_score);
        setTestCompleted(true);

        // Fetch detailed results
        const resultsData = await getUserTestResults(user?.user?.user_id || user?.id, testId);
        if (resultsData.success) {
          setTestResults(resultsData.data);
        }

        setShowResults(true);
        toast.success("Test submitted successfully!");
      } else {
        toast.error(result.message || "Failed to submit test");
      }
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

  // Show results if test is completed
  if (showResults && testResults) {
    console.log("TEST RESULTS: ", testResults)
    return (
      <TestResults
        testData={testResults.test}
        userResponses={testResults.responses}
        scoreData={testResults.summary}
      />
    );
  }

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

  if (preTestLocked) {
    return (
      <div className="min-h-screen bg-customgreys-primarybg flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Post-Test Locked</CardTitle>
            <CardDescription className="text-lg mt-2">
              {preTestLockMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-customgreys-primarybg p-4 rounded-lg mb-6">
              <div className="text-sm text-customgreys-dirtyGrey">
                <p className="mb-2">To unlock the post-test, you need to:</p>
                <ol className="list-decimal list-inside space-y-1 text-left">
                  <li>Complete the pre-test first</li>
                  <li>Finish the course content</li>
                  <li>Then return to take the post-test</li>
                </ol>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={() => router.push(`/student/courses/${courseId}/tests`)}
              className="w-full bg-primary-700 hover:bg-primary-600"
            >
              <FileText className="mr-2 h-4 w-4" />
              Go to Tests Page
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/student/courses/${courseId}`)}
              className="w-full bg-customgreys-primarybg border-customgreys-dirtyGrey text-white-50 hover:bg-customgreys-darkerGrey"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (testCompleted && !showResults) {
    return (
      <div className="min-h-screen bg-customgreys-primarybg flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Test Completed!</CardTitle>
            <CardDescription>Your score: {score}%</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
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
  const allQuestionsAnswered = test.questions.every(
    (q) => answers[q.question_id]
  );

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
                  <h1 className="text-3xl font-bold mb-2">{test.test_title}</h1>
                  <p className="text-customgreys-dirtyGrey text-lg">
                    {testType === "pre"
                      ? "Let's see how much you know before starting the course."
                      : "Test your knowledge after completing the course."}
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
            <Card className="mb-8">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center text-white font-bold">
                    {currentQuestion + 1}
                  </div>
                  <div className="h-px bg-customgreys-dirtyGrey flex-1" />
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {question.question_text}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                {question.question_type === "multiple_choice" && (
                  <RadioGroup
                    value={answers[question.question_id] || ""}
                    onValueChange={(value) =>
                      handleAnswerChange(question.question_id, value)
                    }
                    className="space-y-4"
                  >
                    {question.choices.map((choice, index) => (
                      <div
                        key={choice.choice_id}
                        className="group relative bg-customgreys-primarybg/50 hover:bg-customgreys-primarybg border border-transparent hover:border-primary-700/30 rounded-xl p-4 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-customgreys-secondarybg text-sm font-medium">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <RadioGroupItem
                            value={choice.choice_text}
                            id={`option-${choice.choice_id}`}
                            className="data-[state=checked]:bg-primary-700 data-[state=checked]:border-primary-700"
                          />
                          <Label
                            htmlFor={`option-${choice.choice_id}`}
                            className="flex-grow cursor-pointer text-base leading-relaxed"
                          >
                            {choice.choice_text}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.question_type === "true_false" && (
                  <RadioGroup
                    value={answers[question.question_id] || ""}
                    onValueChange={(value) =>
                      handleAnswerChange(question.question_id, value === "true")
                    }
                    className="space-y-4"
                  >
                    <div className="group relative bg-customgreys-primarybg/50 hover:bg-customgreys-primarybg border border-transparent hover:border-primary-700/30 rounded-xl p-4 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-customgreys-secondarybg text-sm font-medium">
                          T
                        </div>
                        <RadioGroupItem
                          value="true"
                          id="option-true"
                          className="data-[state=checked]:bg-primary-700 data-[state=checked]:border-primary-700"
                        />
                        <Label
                          htmlFor="option-true"
                          className="flex-grow cursor-pointer text-base leading-relaxed"
                        >
                          True
                        </Label>
                      </div>
                    </div>
                    <div className="group relative bg-customgreys-primarybg/50 hover:bg-customgreys-primarybg border border-transparent hover:border-primary-700/30 rounded-xl p-4 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-customgreys-secondarybg text-sm font-medium">
                          F
                        </div>
                        <RadioGroupItem
                          value="false"
                          id="option-false"
                          className="data-[state=checked]:bg-primary-700 data-[state=checked]:border-primary-700"
                        />
                        <Label
                          htmlFor="option-false"
                          className="flex-grow cursor-pointer text-base leading-relaxed"
                        >
                          False
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                )}

                {(question.question_type === "essay" ||
                  question.question_type === "short_answer") && (
                  <div className="space-y-4">
                    <textarea
                      value={answers[question.question_id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.question_id, e.target.value)
                      }
                      placeholder={`Enter your ${
                        question.question_type === "essay"
                          ? "detailed answer"
                          : "answer"
                      } here...`}
                      className="w-full p-4 bg-customgreys-primarybg border border-customgreys-dirtyGrey rounded-lg resize-none min-h-[120px] focus:outline-none focus:border-primary-700"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
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
        <div className="w-80 bg-customgreys-secondarybg p-6 overflow-y-auto">
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
                const isAnswered = answers[q.question_id];
                const isCurrent = index === currentQuestion;

                return (
                  <button
                    key={q.question_id}
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
