"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  BookOpen,
  Clock,
  Eye,
  Calendar,
  User,
  TrendingUp,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  Edit,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/shared/loadingoverlay";
import { useUser } from "@/app/providers/UserProvider";
import axios from "axios";
import { useCoursesResourceManager } from "@/queries/resource-person/students";
import { fetchAllCourses } from "@/lib/actions/resource-person/action";
import { toast } from "sonner";

const ResourcePersonDashboard = () => {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { success, data, message } = await fetchAllCourses();

    if (!success) {
      return toast.error("Something went wrong while fetching data");
    }

    setCourses(data);
    setLoading(false);
  };

  console.log(courses);

  useEffect(() => {
    const filtered = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || course.course_status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "students":
          return (b.student_count || 0) - (a.student_count || 0);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  }, [searchTerm, courses, statusFilter, sortBy]);

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
      case "publish":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors font-medium px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Active
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 transition-colors font-medium px-3 py-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            Draft
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-50 text-slate-700 border-slate-200 font-medium px-3 py-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
            Unknown
          </Badge>
        );
    }
  };

  const handleViewCourse = (courseId) => {
    router.push(`/resource-person/courses/${courseId}`);
  };

  const stats = [
    {
      title: "Total Courses",
      value: courses.length,
      description: "Active courses in the system",
      icon: BookOpen,
      color: "bg-blue-500",
      trend: "+12%",
    },
    {
      title: "Total Teachers",
      value: new Set(courses.map((course) => course.teacher_id)).size,
      description: "Unique course instructors",
      icon: User,
      color: "bg-purple-500",
      trend: "+8%",
    },
    {
      title: "Total Students",
      value: courses.reduce(
        (total, course) => total + (course.student_count || 0),
        0
      ),
      description: "Enrolled across all courses",
      icon: Users,
      color: "bg-emerald-500",
      trend: "+23%",
    },
    {
      title: "Active Courses",
      value: courses.filter((course) => course.course_status === "active")
        .length,
      description: "Currently running courses",
      icon: Clock,
      color: "bg-orange-500",
      trend: "+5%",
    },
  ];

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Resource Person Dashboard
              </h1>
              <p className="text-slate-300 mt-2 text-lg">
                Monitor and manage all courses in the system
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">
                  {stat.title}
                </CardTitle>
                <div
                  className={`h-10 w-10 rounded-xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg`}
                >
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {stat.value.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className="flex items-center text-emerald-400 text-sm font-medium">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {stat.trend}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm border border-slate-200/50">
          <CardHeader className="pb-4 border-b border-slate-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <CardTitle className="text-2xl font-bold text-white-100 flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
                Course Management
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-700" />
                  <Input
                    placeholder="Search courses, teachers, or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/80 text-slate-900"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="students">Most Students</SelectItem>
                    <SelectItem value="title">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className=" border-none">
                    <TableHead className="font-bold text-slate-100 text-md py-4 px-6">
                      COURSE DETAILS
                    </TableHead>
                    <TableHead className="font-bold text-slate-100 text-md py-4 px-6">
                      INSTRUCTOR
                    </TableHead>
                    <TableHead className="font-bold text-slate-100 text-md py-4 px-6">
                      CATEGORY
                    </TableHead>
                    <TableHead className="font-bold text-slate-100 text-md py-4 px-6 text-center">
                      ENROLLMENT
                    </TableHead>
                    <TableHead className="font-bold text-slate-100 text-md py-4 px-6 text-center">
                      STATUS
                    </TableHead>
                    <TableHead className="font-bold text-slate-100 text-md py-4 px-6">
                      CREATED
                    </TableHead>
                    <TableHead className="font-bold text-slate-100 text-md py-4 px-6 text-center">
                      ACTIONS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-lg">
                            <BookOpen className="h-10 w-10 text-slate-400" />
                          </div>
                          <div className="text-slate-600 font-semibold text-lg">
                            {searchTerm
                              ? "No courses found matching your search."
                              : "No courses available."}
                          </div>
                          <p className="text-sm text-slate-500 max-w-md">
                            {searchTerm
                              ? "Try adjusting your search terms or filters to find what you're looking for."
                              : "Get started by creating your first course to see it appear here."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCourses.map((course, index) => (
                      <TableRow
                        key={course.course_id}
                        className="hover:cursor-pointer transition-all duration-200 border-b border-slate-100 group hover:shadow-sm"
                      >
                        <TableCell className="py-6 px-6">
                          <div className="flex items-start space-x-4">
                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 shadow-md group-hover:shadow-lg transition-shadow duration-200 flex-shrink-0">
                              {course.course_image ? (
                                <img
                                  src={`${process.env.NEXT_PUBLIC_ROOT_URL}image_serve.php?image=${course.course_image}`}
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <BookOpen className="h-8 w-8 text-blue-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-slate-100  transition-colors duration-200 text-lg mb-1 line-clamp-2">
                                {course.title}
                              </div>
                              <p className="text-sm text-slate-200 line-clamp-2 leading-relaxed">
                                {course.description ||
                                  "No description available."}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 shadow-md flex-shrink-0">
                              {course.teacher_image ? (
                                <img
                                  src={`${process.env.NEXT_PUBLIC_ROOT_URL}profile_image_serve.php?image=${course.teacher_image}`}
                                  alt={course.teacher_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="h-6 w-6 text-purple-600" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-100 truncate">
                                {course.teacher_name}
                              </div>
                              <div className="text-sm text-slate-200 truncate">
                                {course.teacher_position || "Speaker"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <Badge
                            variant="outline"
                            className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors font-medium px-3 py-1 text-sm"
                          >
                            {course.category_name}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-6 px-6 text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-200">
                              <Users className="h-5 w-5 text-emerald-600" />
                            </div>
                            <span className="font-bold text-slate-100 text-lg">
                              {course.student_count || 0}
                            </span>
                            <span className="text-md text-slate-200 font-medium">
                              students
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-6 text-center">
                          {getStatusBadge(course.course_status)}
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2 text-slate-100">
                              <Calendar className="h-5 w-5 text-slate-100" />
                              <span className="text-sm font-medium">
                                {formatDate(course.created_at)}
                              </span>
                            </div>
                            <span className="text-xs text-slate-200">
                              {Math.floor(
                                (new Date() - new Date(course.created_at)) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              days ago
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewCourse(course.course_id)}
                              className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200 group/btn shadow-sm"
                            >
                              <Eye className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-slate-100 transition-all duration-200 text-slate-600 hover:text-slate-800"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourcePersonDashboard;
