import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export const NotEnrolledStudentsModal = ({ courseId }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [potentialStudents, setPotentialStudents] = useState([
    {
      id: 1,
      name: "Shan Gorra",
      email: "shma.gorra@psa.gov.ph",
      department: "SOCD",
    },
    {
      id: 2,
      name: "Yves Owen Bonita",
      email: "yvas.bonita@psa.gov.ph",
      department: "SOCD",
    },
    {
      id: 3,
      name: "Sarah Kim",
      email: "sarah.k@example.com",
      department: "CRASD",
    },
    {
      id: 4,
      name: "Michael Chen",
      email: "michael.c@example.com",
      department: "CRASD",
    },
    {
      id: 5,
      name: "Olivia Martinez",
      email: "olivia.m@example.com",
      department: "CRASD",
    },
  ]);

  const filteredStudents = potentialStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleDirectInvite = () => {
    router.push(`/courses/${courseId}/invite`);
  };

  const handleInvite = () => {
    console.log("Inviting students:", selectedStudents);
    setSelectedStudents([]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="primary"
          className="flex items-center gap-2 bg-blue-700
        "
        >
          <UserPlus className="h-4 w-4" />
          Invite Students
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-inherit shadow-2xl rounded-lg border border-gray-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Invite Students to Course
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search students by name, email, or department"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute right-3 top-3 h-5 w-5 text-gray-400"
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

        <div className="max-h-[400px] overflow-y-auto">
          {filteredStudents.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No students found matching your search
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedStudents.includes(student.id)
                      ? "bg-blue-100 border-2 border-blue-500 text-black"
                      : "hover:bg-gray-100 border-2 border-transparent hover:text-black"
                  }`}
                  onClick={() => toggleStudentSelection(student.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => toggleStudentSelection(student.id)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{student.name}</div>
                    <div className="text-sm text-gray-400">{student.email}</div>
                    <div className="text-xs text-gray-400">
                      {student.department}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            {selectedStudents.length} students selected
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleDirectInvite}
              className="mr-2"
            >
              Invite by Email
            </Button>
            <Button
              disabled={selectedStudents.length === 0}
              onClick={handleInvite}
            >
              Invite Selected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotEnrolledStudentsModal;
