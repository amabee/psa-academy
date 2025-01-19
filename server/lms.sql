-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 19, 2025 at 02:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms`
--

-- --------------------------------------------------------

--
-- Table structure for table `activitylogs`
--

CREATE TABLE `activitylogs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `activity_details` text DEFAULT NULL,
  `activity_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `announcement_id` int(11) NOT NULL,
  `title` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `date_posted` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `assignment_id` int(11) NOT NULL,
  `lesson_id` int(11) DEFAULT NULL,
  `assignment_title` varchar(255) DEFAULT NULL,
  `due_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(1, 'Technology'),
(2, 'Artificial Intelligence');

-- --------------------------------------------------------

--
-- Table structure for table `certifications`
--

CREATE TABLE `certifications` (
  `certification_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `course_id` varchar(255) DEFAULT NULL,
  `issue_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `choices`
--

CREATE TABLE `choices` (
  `choice_id` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `choice_text` text DEFAULT NULL,
  `is_correct` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `commentsorquestions`
--

CREATE TABLE `commentsorquestions` (
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `topic_id` int(11) DEFAULT NULL,
  `comment_text` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `index_id` int(11) NOT NULL,
  `course_id` varchar(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `course_image` varchar(500) NOT NULL,
  `course_status` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`index_id`, `course_id`, `user_id`, `category_id`, `title`, `description`, `course_image`, `course_status`, `created_at`, `updated_at`) VALUES
(4, '1939cdb9-6f0a-4c83-95fd-e520e18d5e32', 1, 1, 'Programming Essentials', 'desc 1', 'https://yavuzceliker.github.io/sample-images/image-2.jpg', 'Description', '2025-01-18 21:26:53', NULL),
(2, 'a1282260-2d56-4627-8af8-8dbafab6f0fa', 1, 1, 'Introduction to Programming', 'Introduction to Programming', 'https://yavuzceliker.github.io/sample-images/image-3.jpg', 'published', '2025-01-18 19:03:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `enrollment_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `course_id` varchar(255) DEFAULT NULL,
  `enrollment_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `essay_answers`
--

CREATE TABLE `essay_answers` (
  `answer_id` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `answer_text` text DEFAULT NULL,
  `submission_date` date DEFAULT NULL,
  `score` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `grade_id` int(11) NOT NULL,
  `submission_id` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `lesson_id` varchar(255) NOT NULL,
  `course_id` varchar(255) DEFAULT NULL,
  `lesson_title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `resources` text DEFAULT NULL,
  `sequence_number` int(11) DEFAULT NULL,
  `is_Completed` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`lesson_id`, `course_id`, `lesson_title`, `content`, `resources`, `sequence_number`, `is_Completed`) VALUES
('db18bf0c-6a03-473f-8f92-265e5bb9567f', '1939cdb9-6f0a-4c83-95fd-e520e18d5e32', 'Chapter 1', 'Sheesh', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `materials`
--

CREATE TABLE `materials` (
  `material_id` int(11) NOT NULL,
  `topic_id` int(11) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `announcement_id` int(11) DEFAULT NULL,
  `read_status` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offices`
--

CREATE TABLE `offices` (
  `office_id` int(11) NOT NULL,
  `region_id` int(11) DEFAULT NULL,
  `office_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `progress`
--

CREATE TABLE `progress` (
  `progress_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `course_id` varchar(255) DEFAULT NULL,
  `progress_percentage` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `question_id` int(11) NOT NULL,
  `test_id` int(11) DEFAULT NULL,
  `question_text` text DEFAULT NULL,
  `question_type` enum('multiple_choice','essay','true_false','short_answer') DEFAULT NULL,
  `points` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `regions`
--

CREATE TABLE `regions` (
  `region_id` int(11) NOT NULL,
  `region_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_token` varchar(500) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `login_time` datetime DEFAULT current_timestamp(),
  `last_active_time` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `user_id`, `session_token`, `ip_address`, `user_agent`, `login_time`, `last_active_time`, `expires_at`, `is_active`) VALUES
('0e1e2c9ea44c72feb633b7d2af144031c75c0c452a093d174543dc4518385d7b', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4NDUwMiwiZXhwIjoxNzM3MjkxNzAyLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.v1RPJnaYqUl3Drkc7ERByPcnyVOYL8ttYxm_uUs9Rio', '::1', 'axios/1.7.9', '2025-01-19 19:01:42', '2025-01-19 19:01:42', '2025-01-19 21:01:42', 1),
('7f66f8b63d692b121c5ff2ae6a3087c23e4b9f69d4027f5b21b3aba5eba09c41', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4NDY5OCwiZXhwIjoxNzM3MjkxODk4LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.qaEyOXz3BnNtFbn1MgnvpFG9X5c67wpKMI3QOTj8pOw', '::1', 'axios/1.7.9', '2025-01-19 19:04:58', '2025-01-19 19:04:58', '2025-01-19 21:04:58', 1),
('8ec1eb78363387438b9bf8143616e9c91639b9b8b3023b73fd7bd0b9ab1f15f7', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI5NDI1OSwiZXhwIjoxNzM3MzAxNDU5LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.FbdeaYcv2LVgTaesBDOPDbz7JZwpQm2ijFpMmN8bp8E', '::1', 'axios/1.7.9', '2025-01-19 21:44:19', '2025-01-19 21:44:19', '2025-01-19 23:44:19', 1),
('91ca70c0dcb20282107494897db14c9b0e8113d5fd2bdfd21828946aa4466f42', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4NDYyMCwiZXhwIjoxNzM3MjkxODIwLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.Z561fM0iSAIOy09Xdh06cvbBzfG72qkG4YVr3vGPP1U', '::1', 'axios/1.7.9', '2025-01-19 19:03:40', '2025-01-19 19:03:40', '2025-01-19 21:03:40', 1),
('92691545aa3537f49c1ed9d29402610d87c41d93a272c3276fb025548b70e918', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4MzQ3MywiZXhwIjoxNzM3MjkwNjczLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.a2EPkkBVz8eopJTd_qrbP8QpP0mbqzMABqUMrQm7Iyg', '::1', 'axios/1.7.9', '2025-01-19 18:44:33', '2025-01-19 18:44:33', '2025-01-19 20:44:33', 1),
('b45c4b1f7e1a5baab885270466cbf5b58edcdfcc0551328f2216d40c2316fa10', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4NDMxNywiZXhwIjoxNzM3MjkxNTE3LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.cOecLG8lOljysdmFD73e6N8ykOJaBW6g7BllhHivtBw', '::1', 'axios/1.7.9', '2025-01-19 18:58:37', '2025-01-19 18:58:37', '2025-01-19 20:58:37', 1),
('e91fda7007ab571c21cd88313bc2fafdf2060da3cbad7e7aae6468e1d58f73b9', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4NDQ2NiwiZXhwIjoxNzM3MjkxNjY2LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.h-KgTEspptesZMuM3mRXN4uL47mB9fvAs6tUf47lBx8', '::1', 'axios/1.7.9', '2025-01-19 19:01:06', '2025-01-19 19:01:06', '2025-01-19 21:01:06', 1),
('f356491b117442aa026a3338c90b32bf1e66e729d5d156d1187ac7ef6025f8ff', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4NDcyNCwiZXhwIjoxNzM3MjkxOTI0LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.YsE4ONiN1v3TYDkONW4w_aYT03RiAhDZJfnjQ40qJDY', '::1', 'axios/1.7.9', '2025-01-19 19:05:24', '2025-01-19 19:05:24', '2025-01-19 21:05:24', 1),
('fa42bff4ddcdf5b0af5a50a3cdc159b077280f2c3d2bf294e4955fd96954c03d', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4NDU3MSwiZXhwIjoxNzM3MjkxNzcxLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.u9RRhosR9utmT29D5UvsF5hoMxZO97kFV5doPKy1Je0', '::1', 'axios/1.7.9', '2025-01-19 19:02:51', '2025-01-19 19:02:51', '2025-01-19 21:02:51', 1);

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `submission_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `assignment_id` int(11) DEFAULT NULL,
  `test_id` int(11) DEFAULT NULL,
  `submission_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tests`
--

CREATE TABLE `tests` (
  `test_id` int(11) NOT NULL,
  `lesson_id` int(11) DEFAULT NULL,
  `test_title` varchar(255) DEFAULT NULL,
  `test_type` enum('pre','post') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `topic`
--

CREATE TABLE `topic` (
  `topic_id` int(11) NOT NULL,
  `lesson_id` int(11) DEFAULT NULL,
  `topic_title` varchar(255) DEFAULT NULL,
  `topic_description` text DEFAULT NULL,
  `sequence_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `true_false`
--

CREATE TABLE `true_false` (
  `answer_id` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `answer` tinyint(1) DEFAULT NULL,
  `submission_date` date DEFAULT NULL,
  `score` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `userType_id` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `is_Active` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `userType_id`, `username`, `password`, `is_Active`) VALUES
(1, 3, 'johndoe', '$2a$12$KKwgz4PKbBrSIB0ilRaFAug55HtPdlWlC/f1x4HrbigS7TwysWXvC', 1);

-- --------------------------------------------------------

--
-- Table structure for table `userinfo`
--

CREATE TABLE `userinfo` (
  `userInfo_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `age` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `sex` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `blood_type` varchar(255) DEFAULT NULL,
  `allergies` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `office_id` int(11) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `is_Pwd` smallint(6) DEFAULT NULL,
  `is_SoloParent` smallint(6) DEFAULT NULL,
  `is_Pregnant` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userinfo`
--

INSERT INTO `userinfo` (`userInfo_id`, `user_id`, `first_name`, `middle_name`, `last_name`, `age`, `date_of_birth`, `sex`, `gender`, `email`, `phone`, `blood_type`, `allergies`, `ip`, `office_id`, `position`, `is_Pwd`, `is_SoloParent`, `is_Pregnant`) VALUES
(1, 1, 'John', 'Mea', 'Doe', '25', '1995-02-20', 'Female', 'Female', 'johndoe@gmail.com', '09123456789', 'O+', 'none', NULL, NULL, 'Programmer', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `usersettings`
--

CREATE TABLE `usersettings` (
  `settings_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `settings_json` text DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usertype`
--

CREATE TABLE `usertype` (
  `userType_id` int(11) NOT NULL,
  `role_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usertype`
--

INSERT INTO `usertype` (`userType_id`, `role_name`) VALUES
(1, 'admin'),
(2, 'resource manager'),
(3, 'speaker'),
(4, 'student');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activitylogs`
--
ALTER TABLE `activitylogs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`announcement_id`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`assignment_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`certification_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `choices`
--
ALTER TABLE `choices`
  ADD PRIMARY KEY (`choice_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `commentsorquestions`
--
ALTER TABLE `commentsorquestions`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `topic_id` (`topic_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_id`),
  ADD UNIQUE KEY `index_id` (`index_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`enrollment_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `essay_answers`
--
ALTER TABLE `essay_answers`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`grade_id`),
  ADD KEY `submission_id` (`submission_id`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`lesson_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `materials`
--
ALTER TABLE `materials`
  ADD PRIMARY KEY (`material_id`),
  ADD KEY `topic_id` (`topic_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `offices`
--
ALTER TABLE `offices`
  ADD PRIMARY KEY (`office_id`),
  ADD KEY `region_id` (`region_id`);

--
-- Indexes for table `progress`
--
ALTER TABLE `progress`
  ADD PRIMARY KEY (`progress_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `test_id` (`test_id`);

--
-- Indexes for table `regions`
--
ALTER TABLE `regions`
  ADD PRIMARY KEY (`region_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`submission_id`),
  ADD KEY `test_id` (`test_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`test_id`);

--
-- Indexes for table `topic`
--
ALTER TABLE `topic`
  ADD PRIMARY KEY (`topic_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Indexes for table `true_false`
--
ALTER TABLE `true_false`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `userType_id` (`userType_id`);

--
-- Indexes for table `userinfo`
--
ALTER TABLE `userinfo`
  ADD PRIMARY KEY (`userInfo_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `office_id` (`office_id`);

--
-- Indexes for table `usersettings`
--
ALTER TABLE `usersettings`
  ADD PRIMARY KEY (`settings_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `usertype`
--
ALTER TABLE `usertype`
  ADD PRIMARY KEY (`userType_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activitylogs`
--
ALTER TABLE `activitylogs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `announcement_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `certifications`
--
ALTER TABLE `certifications`
  MODIFY `certification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `choices`
--
ALTER TABLE `choices`
  MODIFY `choice_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `commentsorquestions`
--
ALTER TABLE `commentsorquestions`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `index_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `enrollment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `essay_answers`
--
ALTER TABLE `essay_answers`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grades`
--
ALTER TABLE `grades`
  MODIFY `grade_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `materials`
--
ALTER TABLE `materials`
  MODIFY `material_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `offices`
--
ALTER TABLE `offices`
  MODIFY `office_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `progress`
--
ALTER TABLE `progress`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `regions`
--
ALTER TABLE `regions`
  MODIFY `region_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `submission_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tests`
--
ALTER TABLE `tests`
  MODIFY `test_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `topic`
--
ALTER TABLE `topic`
  MODIFY `topic_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `true_false`
--
ALTER TABLE `true_false`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `userinfo`
--
ALTER TABLE `userinfo`
  MODIFY `userInfo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `usersettings`
--
ALTER TABLE `usersettings`
  MODIFY `settings_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usertype`
--
ALTER TABLE `usertype`
  MODIFY `userType_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activitylogs`
--
ALTER TABLE `activitylogs`
  ADD CONSTRAINT `activitylogs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `certifications`
--
ALTER TABLE `certifications`
  ADD CONSTRAINT `certifications_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `certifications_ibfk_3` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;

--
-- Constraints for table `choices`
--
ALTER TABLE `choices`
  ADD CONSTRAINT `choices_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`);

--
-- Constraints for table `commentsorquestions`
--
ALTER TABLE `commentsorquestions`
  ADD CONSTRAINT `commentsorquestions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `commentsorquestions_ibfk_2` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`topic_id`);

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `enrollments_ibfk_3` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;

--
-- Constraints for table `essay_answers`
--
ALTER TABLE `essay_answers`
  ADD CONSTRAINT `essay_answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`);

--
-- Constraints for table `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`submission_id`);

--
-- Constraints for table `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;

--
-- Constraints for table `materials`
--
ALTER TABLE `materials`
  ADD CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`topic_id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `offices`
--
ALTER TABLE `offices`
  ADD CONSTRAINT `offices_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`region_id`);

--
-- Constraints for table `progress`
--
ALTER TABLE `progress`
  ADD CONSTRAINT `progress_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `progress_ibfk_3` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`);

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`),
  ADD CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `true_false`
--
ALTER TABLE `true_false`
  ADD CONSTRAINT `true_false_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`userType_id`) REFERENCES `usertype` (`userType_id`);

--
-- Constraints for table `userinfo`
--
ALTER TABLE `userinfo`
  ADD CONSTRAINT `userinfo_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `userinfo_ibfk_2` FOREIGN KEY (`office_id`) REFERENCES `offices` (`office_id`);

--
-- Constraints for table `usersettings`
--
ALTER TABLE `usersettings`
  ADD CONSTRAINT `usersettings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
