"use client";
import { useUser } from "@/app/providers/UserProvider";
import Header from "@/components/shared/header";
import Loading from "@/components/shared/loading";
import { useCourseStudents } from "@/queries/speaker/course_students";
import {
  Eye,
  EyeIcon,
  Trash2,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  BarChart3,
  Award,
  Target,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import NotEnrolledStudentsModal from "../../components/InviteStudents_Modal";
import { getPendingEnrollments, approveEnrollment, denyEnrollment } from "@/lib/actions/speaker/action";
import { toast } from "sonner";

const EnrolledStudentsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const user = useUser();

  const {
    data: rawStudents,
    isLoading: courseStudentsLoading,
    isError: courseStudentsError,
  } = useCourseStudents(id);

  const students = useMemo(() => {
    if (!rawStudents) return [];

    return rawStudents.map((student) => ({
      id: student.user_id,
      name: `${student.first_name} ${student.last_name}`,
      email: student.email,
      enrollDate: student.enrollment_date || "N/A",
      progress: student.course_progress || 0,
      status: student.isAdmitted ? "Active" : "Inactive",
      preTestScore: student.pre_test_total_score || 0,
      preTestMax: student.pre_test_total_questions || 0,
      preTestPercentage: student.pre_test_percentage || 0,
      postTestScore: student.post_test_total_score || 0,
      postTestMax: student.post_test_total_questions || 0,
      postTestPercentage: student.post_test_percentage || 0,
    }));
  }, [rawStudents]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);

  // Filter students based on search term and status
  const filteredStudents = useMemo(() => {
    return (
      students?.filter((student) => {
        const matchesSearch =
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" ||
          student.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
      }) || []
    );
  }, [students, searchTerm, statusFilter]);

  // Sort students based on sort field and direction
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = sortedStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

  // Handle sort click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle page change
  const goToPage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Generate page numbers for pagination
  const pageNumbers = [];
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Get sort indicator
  const getSortIndicator = (field) => {
    if (sortField !== field) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!students.length)
      return {
        avgProgress: 0,
        avgPreTest: 0,
        avgPostTest: 0,
        activeStudents: 0,
      };

    return {
      avgProgress: Math.round(
        students.reduce((acc, s) => acc + s.progress, 0) / students.length
      ),
      avgPreTest: Math.round(
        students.reduce((acc, s) => acc + s.preTestPercentage, 0) /
          students.length
      ),
      avgPostTest: Math.round(
        students.reduce((acc, s) => acc + s.postTestPercentage, 0) /
          students.length
      ),
      activeStudents: students.filter((s) => s.status === "Active").length,
    };
  }, [students]);

  // Get improvement indicator
  const getImprovementIndicator = (preTest, postTest) => {
    if (preTest === 0 || postTest === 0) return null;
    const diff = postTest - preTest;
    if (diff > 0)
      return {
        icon: TrendingUp,
        color: "text-green-400",
        text: `+${diff.toFixed(1)}%`,
      };
    if (diff < 0)
      return {
        icon: TrendingDown,
        color: "text-red-400",
        text: `${diff.toFixed(1)}%`,
      };
    return { icon: Minus, color: "text-gray-400", text: "0%" };
  };

  useEffect(() => {
    const fetchPending = async () => {
      if (!user?.user?.user_id) return;
      setLoadingPending(true);
      const { success, data } = await getPendingEnrollments(user.user.user_id);
      if (success) setPendingEnrollments(data);
      setLoadingPending(false);
    };
    fetchPending();
  }, [user]);

  const handleApprove = async (enrollment_id) => {
    const { success, message } = await approveEnrollment(enrollment_id);
    if (success) {
      toast.success("Enrollment approved");
      setPendingEnrollments((prev) => prev.filter((e) => e.enrollment_id !== enrollment_id));
    } else {
      toast.error(message);
    }
  };
  const handleDeny = async (enrollment_id) => {
    const { success, message } = await denyEnrollment(enrollment_id);
    if (success) {
      toast.success("Enrollment denied");
      setPendingEnrollments((prev) => prev.filter((e) => e.enrollment_id !== enrollment_id));
    } else {
      toast.error(message);
    }
  };

  if (courseStudentsLoading) {
    return <Loading />;
  }

  if (courseStudentsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">⚠️</div>
          <span className="text-red-400">Error loading students data</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Header
        title="Enrolled Students"
        subtitle="Manage and track student progress"
      />

      {/* Modern Stats Cards with animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 backdrop-blur-sm border border-blue-700/30 p-6 rounded-xl hover:scale-105 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-blue-300 text-sm font-medium">
                Total Students
              </div>
              <div className="text-white text-3xl font-bold mt-1">
                {students.length}
              </div>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg group-hover:bg-blue-500/30 transition-colors">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 backdrop-blur-sm border border-green-700/30 p-6 rounded-xl hover:scale-105 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-green-300 text-sm font-medium">
                Avg Progress
              </div>
              <div className="text-white text-3xl font-bold mt-1">
                {stats.avgProgress}%
              </div>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg group-hover:bg-green-500/30 transition-colors">
              <BarChart3 className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-sm border border-purple-700/30 p-6 rounded-xl hover:scale-105 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-purple-300 text-sm font-medium">
                Avg Pre-Test
              </div>
              <div className="text-white text-3xl font-bold mt-1">
                {stats.avgPreTest}%
              </div>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg group-hover:bg-purple-500/30 transition-colors">
              <Target className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 backdrop-blur-sm border border-orange-700/30 p-6 rounded-xl hover:scale-105 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-orange-300 text-sm font-medium">
                Avg Post-Test
              </div>
              <div className="text-white text-3xl font-bold mt-1">
                {stats.avgPostTest}%
              </div>
            </div>
            <div className="bg-orange-500/20 p-3 rounded-lg group-hover:bg-orange-500/30 transition-colors">
              <Award className="h-6 w-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Bar */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                className="w-full bg-gray-900/50 border border-gray-600/50 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all ${
                showFilters
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50"
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Items per page */}
            <div className="flex items-center space-x-2">
              <label className="text-gray-400 text-sm">Show:</label>
              <select
                className="bg-gray-700/50 border border-gray-600/50 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Export Button */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-all">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <NotEnrolledStudentsModal courseId={id} />
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-600/30 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-gray-400 text-sm">Status:</label>
                <select
                  className="bg-gray-700/50 border border-gray-600/50 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modern Table Container */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-800/60 border-b border-gray-700/50">
          <div className="grid grid-cols-12 py-4 px-6 min-w-[1200px]">
            <div
              className="col-span-2 text-gray-300 font-semibold cursor-pointer hover:text-white transition-colors flex items-center space-x-1"
              onClick={() => handleSort("name")}
            >
              <span>STUDENT</span>
              <span className="text-xs">{getSortIndicator("name")}</span>
            </div>
            <div
              className="col-span-2 text-gray-300 font-semibold cursor-pointer hover:text-white transition-colors flex items-center space-x-1"
              onClick={() => handleSort("email")}
            >
              <span>EMAIL</span>
              <span className="text-xs">{getSortIndicator("email")}</span>
            </div>
            <div
              className="col-span-1 text-gray-300 font-semibold cursor-pointer hover:text-white transition-colors flex items-center space-x-1"
              onClick={() => handleSort("enrollDate")}
            >
              <span>ENROLLED</span>
              <span className="text-xs">{getSortIndicator("enrollDate")}</span>
            </div>
            <div
              className="col-span-2 text-gray-300 font-semibold cursor-pointer hover:text-white transition-colors flex items-center space-x-1"
              onClick={() => handleSort("progress")}
            >
              <span>PROGRESS</span>
              <span className="text-xs">{getSortIndicator("progress")}</span>
            </div>
            <div
              className="col-span-2 text-gray-300 font-semibold cursor-pointer hover:text-white transition-colors flex items-center space-x-1"
              onClick={() => handleSort("preTestPercentage")}
            >
              <span>PRE-TEST</span>
              <span className="text-xs">
                {getSortIndicator("preTestPercentage")}
              </span>
            </div>
            <div
              className="col-span-2 text-gray-300 font-semibold cursor-pointer hover:text-white transition-colors flex items-center space-x-1"
              onClick={() => handleSort("postTestPercentage")}
            >
              <span>POST-TEST</span>
              <span className="text-xs">
                {getSortIndicator("postTestPercentage")}
              </span>
            </div>
            <div className="col-span-1 text-gray-300 font-semibold text-center">
              ACTIONS
            </div>
          </div>
        </div>

        {/* Student Rows */}
        <div className="divide-y divide-gray-700/30">
          {currentStudents.length > 0 ? (
            currentStudents.map((student, index) => {
              const improvement = getImprovementIndicator(
                student.preTestPercentage,
                student.postTestPercentage
              );

              return (
                <div
                  key={student.id}
                  className={`grid grid-cols-12 py-4 px-6 min-w-[1200px] hover:bg-gray-700/20 transition-all duration-200 ${
                    selectedStudent === student.id
                      ? "bg-blue-900/20 border-l-4 border-blue-500"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedStudent(
                      selectedStudent === student.id ? null : student.id
                    )
                  }
                >
                  <div className="col-span-2 flex items-center">
                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          student.name.charAt(0).toUpperCase() < "M"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600"
                            : "bg-gradient-to-br from-purple-500 to-purple-600"
                        } shadow-lg`}
                      >
                        {student.name.charAt(0)}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                          student.status === "Active"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-white font-medium">
                        {student.name}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {student.status}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center text-gray-300">
                    {student.email}
                  </div>

                  <div className="col-span-1 flex items-center text-gray-400 text-sm">
                    {student.enrollDate.replace(
                      /(\d{4})-(\d{2})-(\d{2})/,
                      "$3/$2/$1"
                    )}
                  </div>

                  <div className="col-span-2 flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              student.progress >= 80
                                ? "bg-gradient-to-r from-green-500 to-green-400"
                                : student.progress >= 60
                                ? "bg-gradient-to-r from-blue-500 to-blue-400"
                                : student.progress >= 40
                                ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                                : "bg-gradient-to-r from-red-500 to-red-400"
                            }`}
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-white font-medium text-sm min-w-[40px]">
                          {student.progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <div className="bg-gray-700/30 rounded-lg p-3 hover:bg-gray-700/50 transition-colors">
                      <div className="text-white font-medium text-sm">
                        {student.preTestScore}/{student.preTestMax}
                      </div>
                      <div
                        className={`text-xs font-semibold ${
                          student.preTestPercentage >= 70
                            ? "text-green-400"
                            : student.preTestPercentage >= 40
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {student.preTestPercentage}%
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <div className="bg-gray-700/30 rounded-lg p-3 hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="text-white font-medium text-sm">
                            {student.postTestScore}/{student.postTestMax}
                          </div>
                          <div
                            className={`text-xs font-semibold ${
                              student.postTestPercentage >= 70
                                ? "text-green-400"
                                : student.postTestPercentage >= 40
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {student.postTestPercentage}%
                          </div>
                        </div>
                        {improvement && (
                          <div
                            className={`flex items-center space-x-1 ${improvement.color}`}
                          >
                            <improvement.icon className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {improvement.text}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center justify-center space-x-2">
                    <button className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <div className="text-gray-400 text-lg mb-2">
                No students found
              </div>
              <div className="text-gray-500 text-sm">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No students are enrolled in this course yet"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, sortedStudents.length)} of{" "}
            {sortedStudents.length} students
          </div>

          <div className="flex items-center space-x-2">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage > 1
                  ? "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50"
                  : "bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/50"
              }`}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {startPage > 1 && (
                <>
                  <button
                    className="px-3 py-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50 transition-all"
                    onClick={() => goToPage(1)}
                  >
                    1
                  </button>
                  {startPage > 2 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                </>
              )}

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  className={`px-3 py-2 rounded-lg font-medium transition-all ${
                    currentPage === number
                      ? "bg-blue-600 text-white border border-blue-500 shadow-lg"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50"
                  }`}
                  onClick={() => goToPage(number)}
                >
                  {number}
                </button>
              ))}

              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                  <button
                    className="px-3 py-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50 transition-all"
                    onClick={() => goToPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage < totalPages
                  ? "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50"
                  : "bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/50"
              }`}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {loadingPending ? (
        <Loading />
      ) : pendingEnrollments.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2 text-yellow-400">Pending Enrollment Requests</h2>
          <div className="space-y-2">
            {pendingEnrollments.map((req) => (
              <div key={req.enrollment_id} className="flex items-center justify-between bg-yellow-100/10 border border-yellow-300/30 rounded p-3">
                <div>
                  <span className="font-medium">{req.first_name} {req.last_name}</span> requests to join <span className="font-semibold">{req.course_title}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(req.enrollment_id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
                  <button onClick={() => handleDeny(req.enrollment_id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Deny</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EnrolledStudentsPage;
