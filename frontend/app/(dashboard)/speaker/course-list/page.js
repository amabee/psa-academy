"use client";

import Header from "@/components/shared/header";
import Loading from "@/components/shared/loading";
import TeacherCourseCard from "@/components/shared/teachercoursecard";
import Toolbar from "@/components//shared/toolbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const Courses = () => {
    const router = useRouter();
    const user = "user_7kFh92JkCpQw3N8M5L4xRzVtYs";

    const courses = [
        {
            courseId: "3a9f3d6c-c391-4b1c-9c3d-6c3f3d6c3f3d",
            teacherId: "user_7kFh92JkCpQw3N8M5L4xRzVtYs",
            teacherName: "John Doe",
            title: "Introduction to Programming",
            description:
                "Learn the basics of programming with this comprehensive course.",
            category: "Computer Science",
            image:
                "https://images.pexels.com/photos/5905888/pexels-photo-5905888.jpeg",
            price: 4999,
            level: "Beginner",
            status: "Published",
            enrollments: [
                { userId: "user_2ntu96pUCljUV2T9W0AThzjacQB" },
                { userId: "user_9xWp45MnKjL8vRt2Hs6BqDcEy" },
            ],
            sections: [
                {
                    sectionId: "2f9d1e8b-5a3c-4b7f-9e6d-8c2a1f0b3d5e",
                    sectionTitle: "Getting Started",
                    sectionDescription:
                        "Learn the basics of programming and set up your development environment.",
                    chapters: [
                        {
                            chapterId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
                            type: "Video",
                            title: "Welcome to Programming",
                            content: "https://example.com/videos/welcome.mp4",
                            video: "https://example.com/videos/welcome.mp4",
                            comments: [
                                {
                                    commentId: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
                                    userId: "emma.wilson@hotmail.com",
                                    text: "Great introduction!",
                                    timestamp: "2023-03-10T09:15:00Z",
                                },
                            ],
                        },
                        {
                            chapterId: "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
                            type: "Text",
                            title: "What is Programming?",
                            content:
                                "Programming is the process of creating instructions for computers to follow...",
                            comments: [],
                        },
                        {
                            chapterId: "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
                            type: "Quiz",
                            title: "Programming Basics Quiz",
                            content:
                                "1. What is a variable?\n2. What is the difference between a compiler and an interpreter?\n3. Name three popular programming languages.",
                            comments: [],
                        },
                    ],
                },
                {
                    sectionId: "3g0e2f9c-6d4e-5a7f-8b9g-1h2i3j4k5l6m",
                    sectionTitle: "Basic Programming Concepts",
                    sectionDescription:
                        "Explore fundamental programming concepts and data types.",
                    chapters: [
                        {
                            chapterId: "d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9",
                            type: "Video",
                            title: "Variables and Data Types",
                            content: "https://example.com/videos/variables-data-types.mp4",
                            video: "https://example.com/videos/variables-data-types.mp4",
                            comments: [],
                        },
                        {
                            chapterId: "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
                            type: "Text",
                            title: "Control Structures",
                            content:
                                "Control structures are fundamental elements in programming that allow you to control the flow of your program...",
                            comments: [],
                        },
                        {
                            chapterId: "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1",
                            type: "Quiz",
                            title: "Control Structures Quiz",
                            content:
                                "1. What is an if-else statement?\n2. Explain the purpose of a loop.\n3. What is a switch statement?",
                            comments: [],
                        },
                    ],
                },
                {
                    sectionId: "4h1f3g0d-7e5f-6b8g-9c0h-2i3j4k5l6m7n",
                    sectionTitle: "Functions and Modules",
                    sectionDescription:
                        "Learn how to organize your code using functions and modules.",
                    chapters: [
                        {
                            chapterId: "g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2",
                            type: "Video",
                            title: "Introduction to Functions",
                            content: "https://example.com/videos/intro-to-functions.mp4",
                            video: "https://example.com/videos/intro-to-functions.mp4",
                            comments: [],
                        },
                        {
                            chapterId: "h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3",
                            type: "Text",
                            title: "Creating and Using Modules",
                            content:
                                "Modules are a way to organize and reuse code across different parts of your program...",
                            comments: [],
                        },
                        {
                            chapterId: "i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4",
                            type: "Quiz",
                            title: "Functions and Modules Quiz",
                            content:
                                "1. What is the difference between a function and a method?\n2. How do you import a module in Python?\n3. What is the purpose of the 'return' statement in a function?",
                            comments: [],
                        },
                    ],
                },
            ],
        },
        {
            courseId: "c5d6e7f8-g9h0-i1j2-k3l4-m5n6o7p8q9r0",
            teacherId: "user_7kFh92JkCpQw3N8M5L4xRzVtYs",
            teacherName: "John Doe",
            title: "Web Development Fundamentals",
            description:
                "Learn the basics of HTML, CSS, and JavaScript to build modern websites.",
            category: "Web Development",
            image:
                "https://images.pexels.com/photos/6001397/pexels-photo-6001397.jpeg",
            price: 7999,
            level: "Beginner",
            status: "Published",
            enrollments: [
                { userId: "user_6tHm89QwNpKj3Fx5Vy2RdLcBs" },
                { userId: "user_9xWp45MnKjL8vRt2Hs6BqDcEy" },
            ],
            sections: [
                {
                    sectionId: "3e5f7g9h-1i3j-5k7l-9m1n-3o5p7q9r1s3t",
                    sectionTitle: "HTML Basics",
                    sectionDescription: "Learn the fundamentals of HTML.",
                    chapters: [
                        {
                            chapterId: "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
                            type: "Video",
                            title: "Introduction to HTML",
                            content: "https://example.com/videos/intro-to-html.mp4",
                            video: "https://example.com/videos/intro-to-html.mp4",
                            comments: [],
                        },
                        {
                            chapterId: "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1",
                            type: "Quiz",
                            title: "HTML Tags Quiz",
                            content:
                                "1. What does HTML stand for?\n2. Name three basic HTML tags.\n3. What is the purpose of the <head> tag?",
                            comments: [],
                        },
                        {
                            chapterId: "g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2",
                            type: "Text",
                            title: "HTML Forms and Input Elements",
                            content:
                                "HTML forms are used to collect user input. Learn about various input types and form elements...",
                            comments: [],
                        },
                    ],
                },
                {
                    sectionId: "4f6g8h0i-2j4k-6l8m-0n2p-4q6r8s0t2u4v",
                    sectionTitle: "CSS Styling",
                    sectionDescription: "Learn how to style your HTML with CSS.",
                    chapters: [
                        {
                            chapterId: "h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3",
                            type: "Video",
                            title: "CSS Basics",
                            content: "https://example.com/videos/css-basics.mp4",
                            video: "https://example.com/videos/css-basics.mp4",
                            comments: [],
                        },
                        {
                            chapterId: "i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4",
                            type: "Text",
                            title: "CSS Layout Techniques",
                            content:
                                "Learn about different CSS layout techniques including Flexbox and Grid...",
                            comments: [],
                        },
                        {
                            chapterId: "j0k1l2m3-n4o5-p6q7-r8s9-t0u1v2w3x4y5",
                            type: "Quiz",
                            title: "CSS Styling Quiz",
                            content:
                                "1. What is the box model in CSS?\n2. Explain the difference between inline and block elements.\n3. How do you center an element horizontally and vertically using Flexbox?",
                            comments: [],
                        },
                    ],
                },
            ],
        },
        {
            courseId: "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
            teacherId: "user_7kFh92JkCpQw3N8M5L4xRzVtYs",
            teacherName: "John Doe",
            title: "Mobile App Development with React Native",
            description:
                "Build cross-platform mobile apps using React Native and JavaScript.",
            category: "Mobile Development",
            image:
                "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg",
            price: 12999,
            level: "Advanced",
            status: "Published",
            enrollments: [{ userId: "user_6tHm89QwNpKj3Fx5Vy2RdLcBs" }],
            sections: [
                {
                    sectionId: "5k7l9m1n-3o5p-7q9r-1s3t-5u7v9w1x3y5z",
                    sectionTitle: "Getting Started with React Native",
                    sectionDescription: "Learn the basics of React Native development.",
                    chapters: [
                        {
                            chapterId: "i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4",
                            type: "Video",
                            title: "Setting Up Your Development Environment",
                            content: "https://example.com/videos/react-native-setup.mp4",
                            video: "https://example.com/videos/react-native-setup.mp4",
                            comments: [],
                        },
                        {
                            chapterId: "j0k1l2m3-n4o5-p6q7-r8s9-t0u1v2w3x4y5",
                            type: "Text",
                            title: "React Native Basics",
                            content:
                                "Learn about functions, objects, and other core concepts in JavaScript...",
                            comments: [],
                        },
                    ],
                },
            ],
        },
    ];
    const isLoading = false;
    const isError = false;


    const createCourse = () => {
        return {
            unwrap: () => Promise.resolve({
                courseId: "course_123",
                teacherId: "user_7kFh92JkCpQw3N8M5L4xRzVtYs",
                teacherName: "John Dee"
            })
        };
    };

    const deleteCourse = () => {
        throw new Error("Not Implemented");
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredCourses = useMemo(() => {
        if (!courses) return [];

        return courses.filter((course) => {
            const matchesSearch = course.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesCategory =
                selectedCategory === "all" || course.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [courses, searchTerm, selectedCategory]);

    const handleEdit = (course) => {
        router.push(`/teacher/courses/${course.courseId}`, {
            scroll: false,
        });
    };

    const handleDelete = async (course) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            await deleteCourse(course.courseId).unwrap();
        }
    };

    const handleCreateCourse = async () => {
        if (!user) return;

        const result = await createCourse({
            teacherId: user.id,
            teacherName: user.fullName || "Unknown Teacher",
        }).unwrap();
        router.push(`/speaker/courses/${result.courseId}`, {
            scroll: false,
        });
    };

    const routeToStudentList = (course) => {
        router.push(`/speaker/course-list/${course.courseId}`, {
            scroll: false,
        })
    }

    if (isLoading) return <Loading />;
    if (isError || !courses) return <div>Error loading courses.</div>;

    return (
        <div className="teacher-courses">
            <Header
                title="My Courses"
                subtitle="Browse your courses"
            />
            <Toolbar
                onSearch={setSearchTerm}
                onCategoryChange={setSelectedCategory}
            />
            <div className="teacher-courses__grid">
                {filteredCourses.map((course) => (
                    <TeacherCourseCard
                        key={course.courseId}
                        course={course}
                        isViewStudents={true}
                        onStudentLinkClick={routeToStudentList}
                        isOwner={course.teacherId === user}
                    />
                ))}
            </div>
        </div>
    );
};

export default Courses;
