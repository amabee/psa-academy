"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BookOpen,
  Users,
  User,
  FileText,
  BarChart3,
} from "lucide-react";
import { LoadingOverlay } from "@/components/shared/loadingoverlay";
import { useUser } from "@/app/providers/UserProvider";

const CourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const courseId = params.courseId;

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ROOT_URL}api/resource-person/process/courses.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operation: "getCourseDetails",
            json: JSON.stringify({
              user_id: user?.user_id,
              course_id: courseId,
            }),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setCourseData(data.data);
      } else {
        console.error("Failed to fetch course details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!courseData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-900">
            Course not found
          </h2>
          <p className="text-gray-600 mt-2">
            The course you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push("/resource-person")}
            className="mt-4"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/resource-person")}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {courseData.course.title}
          </h1>
          <p className="text-gray-600">{courseData.course.description}</p>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courseData.lessons?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total lessons</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courseData.lessons?.reduce(
                (total, lesson) => total + (lesson.topics?.length || 0),
                0
              ) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total topics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courseData.students?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courseData.tests?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Available tests</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lessons">Lessons & Topics</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Information */}
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    {courseData.course.course_image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_ROOT_URL}image_serve.php?image=${courseData.course.course_image}`}
                        alt={courseData.course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <BookOpen className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {courseData.course.title}
                    </h3>
                    <p className="text-gray-600">
                      {courseData.course.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getStatusBadge(courseData.course.course_status)}
                      <span className="text-sm text-gray-500">
                        Created {formatDate(courseData.course.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <Badge variant="outline">
                      {courseData.course.category_name}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    {getStatusBadge(courseData.course.course_status)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teacher Information */}
            <Card>
              <CardHeader>
                <CardTitle>Teacher Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                    {courseData.course.teacher_image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_ROOT_URL}profile_image_serve.php?image=${courseData.course.teacher_image}`}
                        alt={courseData.course.teacher_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {courseData.course.teacher_name}
                    </h3>
                    <p className="text-gray-600">
                      {courseData.course.teacher_position}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {courseData.course.teacher_about}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Lessons & Topics Tab */}
        <TabsContent value="lessons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lessons & Topics</CardTitle>
            </CardHeader>
            <CardContent>
              {courseData.lessons?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No lessons available for this course.
                </div>
              ) : (
                <div className="space-y-6">
                  {courseData.lessons?.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.lesson_id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">
                          Lesson {lessonIndex + 1}: {lesson.title}
                        </h3>
                        <Badge variant="outline">
                          {lesson.topics?.length || 0} topics
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{lesson.description}</p>

                      {lesson.topics && lesson.topics.length > 0 && (
                        <div className="space-y-2">
                          {lesson.topics.map((topic, topicIndex) => (
                            <div
                              key={topic.topic_id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-600">
                                    {topicIndex + 1}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium">{topic.title}</p>
                                  <p className="text-sm text-gray-500">
                                    {topic.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">
                                  {topic.duration || "N/A"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
            </CardHeader>
            <CardContent>
              {courseData.students?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No students enrolled in this course.
                </div>
              ) : (
                <div className="space-y-4">
                  {courseData.students?.map((student) => (
                    <div
                      key={student.user_id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                          {student.profile_image ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_ROOT_URL}profile_image_serve.php?image=${student.profile_image}`}
                              alt={student.student_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {student.student_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {student.progress_percentage || 0}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.completed_topics || 0}/
                          {student.total_topics || 0} topics
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tests Tab */}
        <TabsContent value="tests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Tests</CardTitle>
            </CardHeader>
            <CardContent>
              {courseData.tests?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No tests available for this course.
                </div>
              ) : (
                <div className="space-y-4">
                  {courseData.tests?.map((test) => (
                    <div key={test.test_id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {test.title}
                          </h3>
                          <p className="text-gray-600">{test.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>
                              Duration: {test.duration || "N/A"} minutes
                            </span>
                            <span>Questions: {test.question_count || 0}</span>
                            <span>
                              Passing Score: {test.passing_score || "N/A"}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{test.test_type}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseDetailPage;
