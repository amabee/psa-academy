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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/shared/loadingoverlay";
import { useUser } from "@/app/providers/UserProvider";
import axios from "axios";

const ResourcePersonDashboard = () => {
  const { user } = useUser();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchAllCourses();
  }, []);

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

  const fetchAllCourses = async () => {
    // try {
    //   const response = await axios.get(
    //     `${process.env.NEXT_PUBLIC_ROOT_URL}resource-person/process/courses.php?operation=getAllCourses`,
    //     {
    //       headers: {
    //         Authorization: process.env.NEXT_PUBLIC_API_KEY,
    //       },
    //     }
    //   );

    //   const data = response.data;

    //   if (data.success) {
    //     setCourses(data.data);
    //   } else {
    //     console.error("Failed to fetch courses:", data.message);
    //   }
    // } catch (error) {
    //   console.error("Error fetching courses:", error);
    // } finally {
    //   setLoading(false);
    // }

    setLoading(false);
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
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-colors">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 transition-colors">
            Inactive
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 transition-colors">
            Draft
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-50 text-slate-700 border-slate-200">
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
    <div className="min-h-screen">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-300">
                Resource Person Dashboard
              </h1>
              <p className="text-slate-400 mt-2 text-lg">
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
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1 bg-slate-800 backdrop-blur-sm"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">
                  {stat.title}
                </CardTitle>
                <div
                  className={`h-10 w-10 rounded-xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                >
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-slate-200">
                      {stat.value.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className="flex items-center text-emerald-600 text-sm font-medium">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {stat.trend}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <CardTitle className="text-xl font-semibold text-slate-300">
                All Courses
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search courses, teachers, or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
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
                  <SelectTrigger className="w-full sm:w-40 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
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
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-700">
                  <TableRow className=" border-slate-200">
                    <TableHead className="font-semibold text-slate-200 text-md">
                      Course
                    </TableHead>
                    <TableHead className="font-semibold text-slate-200 text-md">
                      Teacher
                    </TableHead>
                    <TableHead className="font-semibold text-slate-200 text-md">
                      Category
                    </TableHead>
                    <TableHead className="font-semibold text-slate-200 text-md">
                      Students
                    </TableHead>
                    <TableHead className="font-semibold text-slate-200 text-md">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-slate-200 text-md">
                      Created
                    </TableHead>
                    <TableHead className="font-semibold text-slate-200 text-md">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-slate-400" />
                          </div>
                          <div className="text-slate-500 font-medium">
                            {searchTerm
                              ? "No courses found matching your search."
                              : "No courses available."}
                          </div>
                          <p className="text-sm text-slate-400">
                            {searchTerm
                              ? "Try adjusting your search terms or filters."
                              : "Get started by creating your first course."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCourses.map((course, index) => (
                      <TableRow
                        key={course.course_id}
                        className="hover:bg-slate-50/50 transition-colors duration-150 border-slate-100 group"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 group-hover:shadow-md transition-shadow duration-200">
                              {course.course_image ? (
                                <img
                                  src={`${process.env.NEXT_PUBLIC_ROOT_URL}image_serve.php?image=${course.course_image}`}
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <BookOpen className="h-6 w-6 text-slate-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-150 truncate">
                                {course.title}
                              </div>
                              <div className="text-sm text-slate-500 line-clamp-2 mt-1">
                                {course.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                              {course.teacher_image ? (
                                <img
                                  src={`${process.env.NEXT_PUBLIC_ROOT_URL}profile_image_serve.php?image=${course.teacher_image}`}
                                  alt={course.teacher_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-slate-400" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-slate-900 truncate">
                                {course.teacher_name}
                              </div>
                              <div className="text-sm text-slate-500 truncate">
                                {course.teacher_position}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="outline"
                            className="border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            {course.category_name}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="font-semibold text-slate-900">
                              {course.student_count || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          {getStatusBadge(course.course_status)}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-2 text-slate-600">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">
                              {formatDate(course.created_at)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewCourse(course.course_id)}
                              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200 group/btn"
                            >
                              <Eye className="h-4 w-4 mr-1 group-hover/btn:scale-110 transition-transform duration-200" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-slate-100 transition-colors duration-200"
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
