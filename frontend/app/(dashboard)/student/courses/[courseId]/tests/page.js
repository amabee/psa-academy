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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  Play,
  Award,
  BookOpen,
  Target,
  AlertCircle,
} from "lucide-react";
import {
  getCourseTests,
  getUserTestResults,
  checkPreTestCompletion,
} from "@/lib/actions/students/action";
import { useUser } from "@/app/providers/UserProvider";

export default function TestsPage() {
  const params = useParams();
  const router = useRouter();
  const user = useUser();
  const { courseId } = params;

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userResults, setUserResults] = useState({});
  const [preTestStatus, setPreTestStatus] = useState(null);

  useEffect(() => {
    const loadTests = async () => {
      if (!courseId || !user) return;

      try {
        setLoading(true);
        const result = await getCourseTests(courseId, user.user.user_id);

        if (result.success) {
          setTests(result.data);

          // Load user results for each test and check pre-test status
          if (user) {
            const results = {};
            for (const test of result.data) {
              try {
                const resultData = await getUserTestResults(
                  user.user.user_id,
                  test.test_id
                );
                if (resultData.success) {
                  results[test.test_id] = resultData.data;
                }
              } catch (error) {
                // User hasn't taken this test yet
                results[test.test_id] = null;
              }
            }
            setUserResults(results);

            // Check pre-test completion status
            const preTestCheck = await checkPreTestCompletion(
              user.user.user_id,
              courseId
            );
            if (preTestCheck.success) {
              setPreTestStatus(preTestCheck.data);
            }
          }
        } else {
          toast.error(result.message || "Failed to load tests");
        }
      } catch (error) {
        toast.error("Failed to load tests");
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, [courseId, user]);

  const navigateToCourse = () => {
    router.push(`/student/courses/${courseId}`);
  };

  const navigateToTest = (testId, testType) => {
    router.push(`/student/courses/${courseId}/test/${testType}/${testId}`);
  };

  const navigateToEvaluation = () => {
    router.push(`/student/courses/${courseId}/evaluation`);
  };

  const getTestTypeInfo = (testType) => {
    switch (testType) {
      case "pre":
        return {
          title: "Pre-Test",
          description: "Assess your knowledge before starting the course",
          icon: BookOpen,
          color: "bg-blue-500",
          badgeColor: "bg-blue-100 text-blue-800",
        };
      case "post":
        return {
          title: "Post-Test",
          description: "Evaluate your learning after completing the course",
          icon: Award,
          color: "bg-green-500",
          badgeColor: "bg-green-100 text-green-800",
        };
      default:
        return {
          title: "Test",
          description: "Course assessment",
          icon: FileText,
          color: "bg-gray-500",
          badgeColor: "bg-gray-100 text-gray-800",
        };
    }
  };

  const getTestStatus = (test) => {
    const result = userResults[test.test_id];
    // Check if post-test is locked due to incomplete pre-test
    if (test.test_type === "post" && preTestStatus) {
      if (!preTestStatus.can_take_post_test) {
        return {
          status: "locked",
          text: "Locked",
          color: "bg-gray-100 text-gray-800",
          icon: AlertCircle,
          locked: true,
          lockReason: "Complete pre-test first",
        };
      }
    }

    if (!result) {
      return {
        status: "not_taken",
        text: "Not Taken",
        color: "bg-gray-100 text-gray-800",
        icon: Play,
      };
    }

    const score = result.summary.percentage_score;
    if (score >= 90) {
      return {
        status: "excellent",
        text: "Excellent",
        color: "bg-green-100 text-green-800",
        icon: Award,
      };
    } else if (score >= 70) {
      return {
        status: "good",
        text: "Good",
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
      };
    } else {
      return {
        status: "needs_improvement",
        text: "Needs Improvement",
        color: "bg-orange-100 text-orange-800",
        icon: Target,
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading">
          <div className="loading__spinner" />
          <span className="loading__text">Loading tests...</span>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold mb-2">Course Tests</h1>
          <p className="text-customgreys-dirtyGrey text-lg">
            Take assessments to track your learning progress
          </p>
        </div>

        {tests.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-customgreys-secondarybg rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-customgreys-dirtyGrey" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Tests Available</h3>
              <p className="text-customgreys-dirtyGrey">
                This course doesn't have any tests yet. Check back later!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test) => {
              const typeInfo = getTestTypeInfo(test.test_type);
              const status = getTestStatus(test);
              const result = userResults[test.test_id];
              const TestTypeIcon = typeInfo.icon;
              const StatusIcon = status.icon;

              return (
                <Card
                  key={test.test_id}
                  className={`${status.locked ? "opacity-75" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${typeInfo.color}`}
                        >
                          <TestTypeIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {test.test_title}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {typeInfo.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={typeInfo.badgeColor}>
                        {typeInfo.title}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Test Info */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-customgreys-dirtyGrey">
                          Questions:
                        </span>
                        <span className="font-medium">
                          {test.question_count}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-customgreys-dirtyGrey">
                          Status:
                        </span>
                        <Badge className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.text}
                        </Badge>
                      </div>

                      {/* Lock Reason */}
                      {status.locked && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-orange-700">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {status.lockReason}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Score (if taken) */}
                      {result && (
                        <>
                          <Separator />
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-customgreys-dirtyGrey">
                                Your Score:
                              </span>
                              <span className="font-bold text-lg">
                                {result.summary.percentage_score}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-customgreys-dirtyGrey">
                                Correct Answers:
                              </span>
                              <span>
                                {result.summary.correct_answers}/
                                {result.summary.total_questions}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-700 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${result.summary.percentage_score}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <div className="w-full space-y-2">
                      <Button
                        onClick={() =>
                          navigateToTest(test.test_id, test.test_type)
                        }
                        className="w-full bg-primary-700 hover:bg-primary-600"
                        disabled={
                          status.locked ||
                          (status.status === "excellent" &&
                            test.test_type === "pre")
                        }
                      >
                        {status.locked ? (
                          <>
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Test Locked
                          </>
                        ) : status.status === "not_taken" ? (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Start Test
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 h-4 w-4" />
                            {test.test_type === "pre"
                              ? "Retake Test"
                              : "View Results"}
                          </>
                        )}
                      </Button>
                      
                      {/* Evaluation button for completed post-tests */}
                      {test.test_type === "post" && result && (
                        <Button
                          onClick={navigateToEvaluation}
                          variant="outline"
                          className="w-full bg-green-600 hover:bg-green-700 text-white border-green-600"
                        >
                          <Award className="mr-2 h-4 w-4" />
                          Complete Evaluation
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* Test Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-700" />
              Test Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-primary-700">Pre-Test</h4>
                <ul className="space-y-2 text-sm text-customgreys-dirtyGrey">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Assess your current knowledge before starting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Helps identify areas to focus on during learning
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Can be retaken if needed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="font-medium text-orange-600">
                      Required before taking post-test
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-primary-700">Post-Test</h4>
                <ul className="space-y-2 text-sm text-customgreys-dirtyGrey">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Evaluate your learning after completing the course
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Measures knowledge retention and understanding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provides detailed feedback on your performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="font-medium text-orange-600">
                      Only available after completing pre-test
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="font-medium text-green-600">
                      Course evaluation available after completion
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
