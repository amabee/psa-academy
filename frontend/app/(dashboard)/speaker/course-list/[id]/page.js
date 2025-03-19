"use client";
import { useUser } from "@/app/providers/UserProvider";
import Header from "@/components/shared/header";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const EnrolledStudentsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const user = useUser();

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      enrollDate: "2025-02-15",
      progress: 78,
      status: "Active",
    },
    {
      id: 2,
      name: "Taylor Smith",
      email: "taylor.smith@example.com",
      enrollDate: "2025-01-22",
      progress: 45,
      status: "Active",
    },
    {
      id: 3,
      name: "Yskaela Yaena",
      email: "yska.yaena@gmail.com",
      enrollDate: "2025-01-26",
      progress: 89,
      status: "Active",
    },
    {
      id: 4,
      name: "Morgan Lee",
      email: "morgan.lee@example.com",
      enrollDate: "2025-03-10",
      progress: 33,
      status: "Inactive",
    },
    {
      id: 5,
      name: "Jordan Kim",
      email: "jordan.kim@example.com",
      enrollDate: "2025-02-01",
      progress: 92,
      status: "Active",
    },
    {
      id: 6,
      name: "Casey Brown",
      email: "casey.brown@example.com",
      enrollDate: "2025-01-30",
      progress: 60,
      status: "Active",
    },
    {
      id: 7,
      name: "Drew Parker",
      email: "drew.parker@example.com",
      enrollDate: "2025-02-28",
      progress: 50,
      status: "Inactive",
    },
    {
      id: 8,
      name: "Riley Adams",
      email: "riley.adams@example.com",
      enrollDate: "2025-01-15",
      progress: 80,
      status: "Active",
    },
    {
      id: 9,
      name: "Jamie Garcia",
      email: "jamie.garcia@example.com",
      enrollDate: "2025-03-05",
      progress: 72,
      status: "Active",
    },
    {
      id: 10,
      name: "Quinn Martinez",
      email: "quinn.martinez@example.com",
      enrollDate: "2025-02-20",
      progress: 95,
      status: "Active",
    },
    {
      id: 11,
      name: "Shan Gorra",
      email: "shma.gorra.coc@phinmaed.com",
      enrollDate: "2025-02-20",
      progress: 0,
      status: "Active",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  }, [searchTerm]);

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
    if (sortField !== field) return "↓";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <div className="w-full">
      <Header title="Enrolled Students" subtitle="View Enrolled Students" />

      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search students..."
            className="bg-gray-800 text-white rounded-md px-4 py-2 w-64 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label className="text-gray-400 mr-2">Items per page:</label>
            <select
              className="bg-gray-800 text-white rounded-md px-2 py-1 focus:outline-none"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => router.push(`/courses/${id}/invite`)}
          >
            Invite Students
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 bg-gray-800 py-3 px-4 rounded-t-md">
        <div
          className="col-span-2 text-gray-300 font-medium cursor-pointer hover:text-white"
          onClick={() => handleSort("name")}
        >
          STUDENT{" "}
          <span className="text-gray-500">{getSortIndicator("name")}</span>
        </div>
        <div
          className="col-span-3 text-gray-300 font-medium cursor-pointer hover:text-white"
          onClick={() => handleSort("email")}
        >
          EMAIL{" "}
          <span className="text-gray-500">{getSortIndicator("email")}</span>
        </div>
        <div
          className="col-span-2 text-gray-300 font-medium cursor-pointer hover:text-white"
          onClick={() => handleSort("enrollDate")}
        >
          ENROLLED ON{" "}
          <span className="text-gray-500">
            {getSortIndicator("enrollDate")}
          </span>
        </div>
        <div
          className="col-span-2 text-gray-300 font-medium cursor-pointer hover:text-white"
          onClick={() => handleSort("progress")}
        >
          PROGRESS{" "}
          <span className="text-gray-500">{getSortIndicator("progress")}</span>
        </div>
        <div
          className="col-span-2 text-gray-300 font-medium cursor-pointer hover:text-white"
          onClick={() => handleSort("status")}
        >
          STATUS{" "}
          <span className="text-gray-500">{getSortIndicator("status")}</span>
        </div>
        <div className="col-span-1 text-gray-300 font-medium text-center">
          ACTIONS
        </div>
      </div>

      {/* Student Rows */}
      {currentStudents.length > 0 ? (
        currentStudents.map((student) => (
          <div
            key={student.id}
            className="grid grid-cols-12 py-4 px-4 border-b border-gray-700"
          >
            <div className="col-span-2 flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  student.name.charAt(0).toUpperCase() < "M"
                    ? "bg-blue-500"
                    : "bg-purple-500"
                }`}
              >
                {student.name.charAt(0)}
              </div>
              <span className="ml-3 text-gray-300">{student.name}</span>
            </div>
            <div className="col-span-3 flex items-center text-gray-400">
              {student.email}
            </div>
            <div className="col-span-2 flex items-center text-gray-400">
              {student.enrollDate.replace(
                /(\d{4})-(\d{2})-(\d{2})/,
                "$3/$2/$1"
              )}
            </div>
            <div className="col-span-2 flex items-center">
              <div className="w-[150px] bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    student.progress >= 70
                      ? "bg-green-500"
                      : student.progress >= 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${student.progress}%` }}
                ></div>
              </div>
              <span className="ml-2 text-gray-300">{student.progress}%</span>
            </div>
            <div className="col-span-2 flex items-center">
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  student.status === "Active"
                    ? "bg-green-900 text-green-300"
                    : "bg-red-900 text-red-300"
                }`}
              >
                {student.status}
              </span>
            </div>
            <div className="col-span-1 flex items-center justify-center space-x-3">
              <button className="text-blue-400 hover:text-blue-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
              <button className="text-green-400 hover:text-green-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button className="text-red-400 hover:text-red-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="py-8 text-center text-gray-400">
          No students found matching your search criteria.
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-400">
          Showing {indexOfFirstItem + 1}-
          {Math.min(indexOfLastItem, sortedStudents.length)} of{" "}
          {sortedStudents.length} students
        </div>

        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md ${
              currentPage > 1
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-700 text-gray-300 opacity-50 cursor-not-allowed"
            }`}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {startPage > 1 && (
            <>
              <button
                className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600"
                onClick={() => goToPage(1)}
              >
                1
              </button>
              {startPage > 2 && (
                <span className="px-2 py-1 text-gray-400">...</span>
              )}
            </>
          )}

          {pageNumbers.map((number) => (
            <button
              key={number}
              className={`px-3 py-1 rounded-md ${
                currentPage === number
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => goToPage(number)}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-2 py-1 text-gray-400">...</span>
              )}
              <button
                className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600"
                onClick={() => goToPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            className={`px-3 py-1 rounded-md ${
              currentPage < totalPages
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-700 text-gray-300 opacity-50 cursor-not-allowed"
            }`}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrolledStudentsPage;
