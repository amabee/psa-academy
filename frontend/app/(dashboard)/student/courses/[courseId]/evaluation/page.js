"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Award, Star, FileText, CheckCircle } from "lucide-react";
import CourseEvaluationPage from "./course-evaluation";
import HRDLDEvaluationPage from "./hrd-ld-evaluation";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { courseId } = params;
  
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  const navigateToCourse = () => {
    router.push(`/student/courses/${courseId}`);
  };

  const evaluationOptions = [
    {
      id: "course",
      title: "Course Evaluation",
      description: "General course feedback and satisfaction survey",
      icon: Star,
      color: "bg-blue-500",
      badgeColor: "bg-blue-100 text-blue-800",
      features: [
        "Overall course satisfaction",
        "Content quality assessment",
        "Instructor performance",
        "Learning experience feedback",
        "General recommendations"
      ]
    },
    {
      id: "hrd-ld",
      title: "HRD-LD Evaluation Form",
      description: "Comprehensive Level I-II training assessment",
      icon: Award,
      color: "bg-green-500",
      badgeColor: "bg-green-100 text-green-800",
      features: [
        "Reaction Level (Level I) - Satisfaction",
        "Learning Level (Level II) - Knowledge & Skills",
        "Instructor performance evaluation",
        "Course design assessment",
        "Impact assessment & implementation"
      ]
    }
  ];

  if (selectedEvaluation) {
    if (selectedEvaluation === "course") {
      return <CourseEvaluationPage />;
    } else if (selectedEvaluation === "hrd-ld") {
      return <HRDLDEvaluationPage />;
    }
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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Course Evaluation</h1>
              <p className="text-customgreys-dirtyGrey text-lg">
                Choose an evaluation form to provide your feedback
              </p>
            </div>
          </div>
        </div>

        {/* Evaluation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {evaluationOptions.map((option) => {
            const OptionIcon = option.icon;
            
            return (
              <Card
                key={option.id}
                className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-primary-300"
                onClick={() => setSelectedEvaluation(option.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${option.color}`}>
                        <OptionIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{option.title}</CardTitle>
                        <p className="text-sm text-customgreys-dirtyGrey">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <Badge className={option.badgeColor}>
                      {option.id === "hrd-ld" ? "HRD-LD" : "Standard"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-primary-700">What's included:</h4>
                    <ul className="space-y-2">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-700" />
              Evaluation Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-primary-700">Course Evaluation</h4>
                <ul className="space-y-2 text-sm text-customgreys-dirtyGrey">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Quick and general feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Standard course satisfaction metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Basic instructor and content assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="font-medium text-orange-600">
                      Recommended for quick feedback
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-primary-700">HRD-LD Evaluation</h4>
                <ul className="space-y-2 text-sm text-customgreys-dirtyGrey">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Comprehensive training assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Level I-II evaluation framework</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Detailed impact and implementation analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="font-medium text-orange-600">
                      Recommended for thorough assessment
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
