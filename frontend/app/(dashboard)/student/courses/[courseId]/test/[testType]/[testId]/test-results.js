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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Clock,
  Award,
  ArrowLeft,
  BookOpen,
  Target,
  TrendingUp,
} from "lucide-react";

export default function TestResults({ testData, userResponses, scoreData }) {
  const params = useParams();
  const router = useRouter();
  const { courseId, testType } = params;

  const [loading, setLoading] = useState(false);

  const navigateToCourse = () => {
    router.push(`/student/courses/${courseId}`);
  };

  const navigateToTest = () => {
    router.push(
      `/student/courses/${courseId}/test/${testType}/${params.testId}`
    );
  };

  const navigateToEvaluation = () => {
    router.push(`/student/courses/${courseId}/evaluation`);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return "text-green-500";
    if (percentage >= 80) return "text-blue-500";
    if (percentage >= 70) return "text-yellow-500";
    if (percentage >= 60) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreBadge = (percentage) => {
    if (percentage >= 90) return { text: "Excellent", color: "bg-green-500" };
    if (percentage >= 80) return { text: "Good", color: "bg-blue-500" };
    if (percentage >= 70) return { text: "Fair", color: "bg-yellow-500" };
    if (percentage >= 60) return { text: "Pass", color: "bg-orange-500" };
    return { text: "Needs Improvement", color: "bg-red-500" };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    console.log("Test Data: ", testData);
    console.log("User Responses: ", userResponses);
    console.log("Score Data: ", scoreData);
  }, [testData, userResponses, scoreData]);

  if (!testData || !userResponses || !scoreData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading">
          <div className="loading__spinner" />
          <span className="loading__text">Loading results...</span>
        </div>
      </div>
    );
  }

  const scoreBadge = getScoreBadge(scoreData.percentage_score);

  return (
    <div className="min-h-screen bg-customgreys-primarybg">
      <div className="max-w-4xl mx-auto p-8">
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
          <h1 className="text-3xl font-bold mb-2">Test Results</h1>
          <p className="text-customgreys-dirtyGrey text-lg">
            {testData.test_title} -{" "}
            {testType === "pre" ? "Pre-Test" : "Post-Test"}
          </p>
        </div>

        {/* Score Summary Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary-700 to-primary-600 text-white">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Award className="w-10 h-10" />
              </div>
            </div>
            <CardTitle className="text-2xl">Your Score</CardTitle>
            <CardDescription className="text-white/80">
              {testType === "pre"
                ? "Here's how you performed before starting the course"
                : "Here's how you performed after completing the course"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {scoreData.percentage_score}%
                </div>
                <div className="text-sm opacity-80">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {scoreData.correct_answers}/{scoreData.total_questions}
                </div>
                <div className="text-sm opacity-80">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {scoreData.total_score}
                </div>
                <div className="text-sm opacity-80">Total Points</div>
              </div>
            </div>
            <Badge
              className={`${scoreBadge.color} text-white text-lg px-4 py-2`}
            >
              {scoreBadge.text}
            </Badge>
          </CardContent>
        </Card>

        {/* Performance Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Question Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-700" />
                Question Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userResponses.map((response, index) => (
                  <div
                    key={response.response_id}
                    className="flex items-center justify-between p-3 bg-customgreys-primarybg rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          response.score > 0 ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm line-clamp-2">
                          {response.question_text}
                        </div>
                        <div className="text-xs text-customgreys-dirtyGrey mt-1">
                          {response.question_type.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {response.score > 0 ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="text-sm font-medium">
                        {response.score}/{response.points}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-700" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Score Distribution */}
                <div>
                  <h4 className="font-medium mb-3">Score Distribution</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Correct Answers</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (scoreData.correct_answers /
                                  scoreData.total_questions) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          {scoreData.correct_answers}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Incorrect Answers</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{
                              width: `${
                                ((scoreData.total_questions -
                                  scoreData.correct_answers) /
                                  scoreData.total_questions) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          {scoreData.total_questions -
                            scoreData.correct_answers}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Recommendations */}
                <div>
                  <h4 className="font-medium mb-3">Recommendations</h4>
                  <div className="space-y-2 text-sm">
                    {scoreData.percentage_score >= 90 && (
                      <div className="flex items-start gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          Excellent performance! You're ready to advance to more
                          challenging topics.
                        </span>
                      </div>
                    )}
                    {scoreData.percentage_score >= 70 &&
                      scoreData.percentage_score < 90 && (
                        <div className="flex items-start gap-2 text-blue-600">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>
                            Good work! Review the incorrect answers to
                            strengthen your understanding.
                          </span>
                        </div>
                      )}
                    {scoreData.percentage_score < 70 && (
                      <div className="flex items-start gap-2 text-orange-600">
                        <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          Consider reviewing the course materials and retaking
                          the test to improve your score.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Next Steps */}
                <div>
                  <h4 className="font-medium mb-3">Next Steps</h4>
                  <div className="space-y-2 text-sm">
                    {testType === "pre" ? (
                      <>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                          <span>
                            Start the course content to learn the material
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Focus on areas where you scored lower</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                          <span>
                            Take the post-test after completing the course
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                          <span>
                            Review your incorrect answers to understand the
                            concepts better
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                          <span>
                            Consider retaking the test if you want to improve
                            your score
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                          <span>
                            Explore additional resources to deepen your
                            knowledge
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="font-medium text-green-600">
                            Complete the course evaluation to provide valuable feedback
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Call-to-Action for Post-Tests */}
        {testType === "post" && (
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-800 mb-1">
                    Course Evaluation Available
                  </h3>
                  <p className="text-green-700 text-sm">
                    Help us improve our courses by completing a brief evaluation. 
                    Your feedback is valuable for enhancing the learning experience for future students.
                  </p>
                </div>
                <Button
                  onClick={navigateToEvaluation}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Award className="mr-2 h-4 w-4" />
                  Start Evaluation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Card className="border-none">
          <CardFooter className="flex justify-center gap-4">
            <Button
              onClick={navigateToCourse}
              className="bg-primary-700 hover:bg-primary-600 px-8"
            >
              Continue Learning
            </Button>
            {testType === "pre" && (
              <Button
                variant="outline"
                onClick={navigateToTest}
                className="bg-customgreys-primarybg border-customgreys-dirtyGrey text-white-50 hover:bg-customgreys-darkerGrey"
              >
                Retake Test
              </Button>
            )}
            {testType === "post" && (
              <Button
                variant="outline"
                onClick={navigateToEvaluation}
                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
              >
                <Award className="mr-2 h-4 w-4" />
                Complete Evaluation
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
