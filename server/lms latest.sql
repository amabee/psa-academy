-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 13, 2025 at 08:06 AM
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
(2, 'Artificial Intelligence'),
(3, 'Mathematics'),
(4, 'Science'),
(5, 'Programming'),
(6, 'Web Development'),
(7, 'Data Science'),
(8, 'Business'),
(9, 'Finance'),
(10, 'Arts'),
(11, 'Music'),
(12, 'Health & Wellness'),
(13, 'Fitness'),
(14, 'Cooking'),
(15, 'Photography'),
(16, 'Graphic Design'),
(17, 'Digital Marketing'),
(18, 'Writing & Publishing'),
(19, 'Languages'),
(20, 'History'),
(21, 'Psychology'),
(22, 'Personal Development'),
(23, 'Public Speaking'),
(24, 'Time Management'),
(25, 'Leadership'),
(26, 'Education'),
(27, 'Engineering'),
(28, 'Architecture'),
(29, 'Interior Design'),
(30, 'Fashion Design'),
(31, 'Film & Video'),
(32, 'UI/UX Design'),
(33, 'Cybersecurity'),
(34, 'Blockchain'),
(35, 'Mobile App Development'),
(36, 'Game Development'),
(37, 'Networking'),
(38, 'Cloud Computing'),
(39, 'Project Management'),
(40, 'Career Development'),
(41, 'Social Media Management'),
(42, 'Environmental Studies'),
(99, 'Not Defined');

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
  `topic_id` varchar(255) DEFAULT NULL,
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
(19, '35a77222-347c-4af8-8d4e-fc27e965dc40', 1, 99, 'not available', 'not available', 'default.jpg', 'draft', '2025-03-12 18:41:20', NULL),
(17, '3feed044-fccf-405a-9ec0-e7ea0125a141', 1, 5, 'Introduction to Programming', 'Introduction to Programming', 'course_67a0c044bd850.png', 'publish', '2025-02-03 21:09:51', '2025-02-11 08:32:59'),
(18, 'f437be06-3317-4a54-8a0e-16b022b1bbbc', 1, 5, 'Object-Oriented Programming (OOP) in Python', 'Python OOP', 'course_67a58d9ee463a.webp', 'publish', '2025-02-07 12:34:55', '2025-02-07 12:37:33');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `enrollment_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `course_id` varchar(255) DEFAULT NULL,
  `isAdmitted` tinyint(1) DEFAULT NULL,
  `enrollment_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`enrollment_id`, `user_id`, `course_id`, `isAdmitted`, `enrollment_date`) VALUES
(2, 2, '3feed044-fccf-405a-9ec0-e7ea0125a141', 1, '2025-02-14 21:11:06'),
(5, 4, 'f437be06-3317-4a54-8a0e-16b022b1bbbc', 1, NULL),
(6, 2, '3feed044-fccf-405a-9ec0-e7ea0125a141', 1, NULL),
(7, 4, '3feed044-fccf-405a-9ec0-e7ea0125a141', 1, NULL);

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
-- Table structure for table `evaluation`
--

CREATE TABLE `evaluation` (
  `eval_id` int(11) NOT NULL,
  `title_id` int(11) NOT NULL,
  `evaluated_entity_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `total_score` decimal(10,0) NOT NULL,
  `created_at` date NOT NULL,
  `date_of_conduct` date NOT NULL,
  `venue` varchar(100) NOT NULL,
  `evaluator_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evaluationgroups`
--

CREATE TABLE `evaluationgroups` (
  `group_id` int(11) NOT NULL,
  `group_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evaluationlevels`
--

CREATE TABLE `evaluationlevels` (
  `level_id` int(11) NOT NULL,
  `level_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evaluationpart`
--

CREATE TABLE `evaluationpart` (
  `part_id` int(11) NOT NULL,
  `part_title` varchar(100) NOT NULL,
  `evaluation_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evaluationquestions`
--

CREATE TABLE `evaluationquestions` (
  `eval_quest_id` int(11) NOT NULL,
  `evaluation_id` int(11) NOT NULL,
  `question` text NOT NULL,
  `part_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evaluationresponse`
--

CREATE TABLE `evaluationresponse` (
  `response_id` int(11) NOT NULL,
  `eval_question_id` int(11) NOT NULL,
  `response` text NOT NULL,
  `score` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evaluationtitle`
--

CREATE TABLE `evaluationtitle` (
  `title_id` int(11) NOT NULL,
  `title_name` varchar(100) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evaluationtypes`
--

CREATE TABLE `evaluationtypes` (
  `type_id` int(11) NOT NULL,
  `type_name` varchar(100) NOT NULL
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
  `lesson_description` text DEFAULT NULL,
  `resources` text DEFAULT NULL,
  `sequence_number` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`lesson_id`, `course_id`, `lesson_title`, `lesson_description`, `resources`, `sequence_number`, `created_at`, `updated_at`) VALUES
('135ab87c-98ac-49d1-9554-af2d358480c2', 'f437be06-3317-4a54-8a0e-16b022b1bbbc', 'Lesson 1', 'Lesson', 'Resources not available', 1, '2025-02-19 11:59:58', NULL),
('8b062884-5a9e-4030-81ec-79998bb10299', '3feed044-fccf-405a-9ec0-e7ea0125a141', 'Introduction to Programming', 'Introduction to Programming', 'Resources not available', 1, '2025-02-11 08:33:28', NULL),
('e06c99a9-4814-44f9-8dab-6eee92258c7b', '3feed044-fccf-405a-9ec0-e7ea0125a141', 'Basic Syntax', 'Java Edition', 'Resources not available', 2, '2025-02-14 14:05:27', NULL),
('e7ef1ac5-afc9-406d-b034-cbf9c89d7019', '35a77222-347c-4af8-8d4e-fc27e965dc40', 'Lesson 1 ', 'Description 1', 'RESOURCE', 1, '2025-03-12 18:42:25', '2025-03-12 18:42:49');

-- --------------------------------------------------------

--
-- Table structure for table `lesson_progress`
--

CREATE TABLE `lesson_progress` (
  `progress_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lesson_id` varchar(255) NOT NULL,
  `is_completed` tinyint(4) DEFAULT 0,
  `completion_date` datetime DEFAULT NULL,
  `last_accessed` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `materials`
--

CREATE TABLE `materials` (
  `material_id` int(11) NOT NULL,
  `topic_id` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `materials`
--

INSERT INTO `materials` (`material_id`, `topic_id`, `file_name`) VALUES
(21, '41c9d886-deef-49a6-a2f5-dcafcbd7470b', 'topic_67aaab5ee56c7.pdf'),
(22, '47ce4349-0fdf-402d-af45-68e0fbbd4fb7', 'topic_67aaac0a2383a.pdf'),
(23, '5c1ff401-8e49-42d2-979b-13e146499c1b', 'topic_67aedd6893e19.pdf'),
(24, '03cecc19-7f1b-4d46-a45f-89397588c5ba', 'topic_67aedd965a9df.pdf'),
(25, '678fa6e5-f19b-4ac8-8c12-b97958b60a6c', 'topic_67d16566c626d.pdf');

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
('000404f0d5bdd4920d7b7c2a21f7aab142009d0faa900a62a4d660b28daadcf4', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MTc3Mzk2MywiZXhwIjoxNzQxNzgxMTYzLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.8gKEJYj5pNFj9OJpu6trzQWeq3FICAkXw8-QPJfzbWo', '::1', 'axios/1.7.9', '2025-03-12 18:06:03', '2025-03-12 18:06:03', '2025-03-12 20:06:03', 1),
('1f3ab939cb8145b85eda373cfecbc02b16b09538314af2ce4655ff96b125fb1b', 2, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MTc3NDM3NCwiZXhwIjoxNzQxNzgxNTc0LCJzdWIiOjIsInVzZXIiOnsiaWQiOjIsInVzZXJuYW1lIjoieWFlbmEiLCJmdWxsX25hbWUiOiJZc2thZWxhWWFlbmFGdWppbW90byIsImVtYWlsIjoieWFlbmFfeXNrYUBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.rSLawH3-iA0OnYjN4hNYcUCIuRFnqd-Wbd5iZssmEl8', '::1', 'axios/1.7.9', '2025-03-12 18:12:54', '2025-03-12 18:12:54', '2025-03-12 20:12:54', 1),
('97683ce1f63e91acf188a9efc2ccca771b12a36b98acb1ce425558371f3b4986', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MTc3NDgyNywiZXhwIjoxNzQxNzgyMDI3LCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.VExihfur9aeaR8ktQnZWD1t9afNQed0Ux6hu_mdA6hE', '::1', 'axios/1.7.9', '2025-03-12 18:20:27', '2025-03-12 18:20:27', '2025-03-12 20:20:27', 1),
('b2e6305c705f107c8089183336fa8754b711829e6acd0f0b05ab92e40b67dcdf', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MTc3NDg1MywiZXhwIjoxNzQxNzgyMDUzLCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.U_8BE7ionrjIX0zlmeMR1bm35_ctXk-g76UW7qAfKGM', '::1', 'axios/1.7.9', '2025-03-12 18:20:53', '2025-03-12 18:20:53', '2025-03-12 20:20:53', 1),
('d778cb2be987677ee2e5fc38b304a2ec24141fd695c99ab08d145116e27f375f', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MTc3NTkxMSwiZXhwIjoxNzQxNzgzMTExLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.gUHpJyNCq6yphCAU9me61BJ-gR2CnZy25RlvJcK5hwo', '::1', 'axios/1.7.9', '2025-03-12 18:38:31', '2025-03-12 18:38:31', '2025-03-12 20:38:31', 1);

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
  `topic_id` varchar(255) NOT NULL,
  `lesson_id` varchar(255) DEFAULT NULL,
  `topic_title` varchar(255) DEFAULT NULL,
  `topic_description` text DEFAULT NULL,
  `sequence_number` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `topic`
--

INSERT INTO `topic` (`topic_id`, `lesson_id`, `topic_title`, `topic_description`, `sequence_number`, `created_at`, `updated_at`) VALUES
('03cecc19-7f1b-4d46-a45f-89397588c5ba', 'e06c99a9-4814-44f9-8dab-6eee92258c7b', 'Topic 2', 'Topic 2', 2, '2025-02-14 14:07:22', NULL),
('27a37d30-0598-43b1-8e13-5cf8de682063', 'e7ef1ac5-afc9-406d-b034-cbf9c89d7019', 'Topic 1', 'DESCRIPTION', 1, '2025-03-12 18:43:19', NULL),
('41c9d886-deef-49a6-a2f5-dcafcbd7470b', '8b062884-5a9e-4030-81ec-79998bb10299', 'Topic 2', 'Topic 2', 2, '2025-02-11 08:34:27', '2025-02-11 09:46:56'),
('47ce4349-0fdf-402d-af45-68e0fbbd4fb7', '8b062884-5a9e-4030-81ec-79998bb10299', 'Topic 1', 'Topic 1', 1, '2025-02-11 09:46:52', '2025-02-11 09:46:56'),
('5c1ff401-8e49-42d2-979b-13e146499c1b', 'e06c99a9-4814-44f9-8dab-6eee92258c7b', 'Topic 1', 'Topic 1', 1, '2025-02-14 14:06:36', NULL),
('678fa6e5-f19b-4ac8-8c12-b97958b60a6c', 'e7ef1ac5-afc9-406d-b034-cbf9c89d7019', 'Topic 2', 'DESCRIPTION', 2, '2025-03-12 18:43:57', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `topic_progress`
--

CREATE TABLE `topic_progress` (
  `topic_progress_id` int(11) NOT NULL,
  `topic_id` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_completed` tinyint(4) NOT NULL DEFAULT 0,
  `completion_date` datetime DEFAULT NULL,
  `last_accessed` datetime NOT NULL DEFAULT current_timestamp(),
  `time_spent` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `topic_progress`
--

INSERT INTO `topic_progress` (`topic_progress_id`, `topic_id`, `user_id`, `is_completed`, `completion_date`, `last_accessed`, `time_spent`) VALUES
(10, '47ce4349-0fdf-402d-af45-68e0fbbd4fb7', 4, 1, '2025-03-12 18:23:52', '2025-03-12 18:24:14', 0),
(11, '41c9d886-deef-49a6-a2f5-dcafcbd7470b', 4, 1, NULL, '2025-03-12 18:25:23', 0);

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
(1, 3, 'johndoe', '$2a$12$KKwgz4PKbBrSIB0ilRaFAug55HtPdlWlC/f1x4HrbigS7TwysWXvC', 1),
(2, 4, 'yaena', '$2a$12$KKwgz4PKbBrSIB0ilRaFAug55HtPdlWlC/f1x4HrbigS7TwysWXvC', 1),
(3, 4, 'aiahkin', '$2y$10$z2lHlJv1K8JugG/u/q8DzOqKVQBnWqAeXM3eg3uJk1I/4x1EEdBka', 1),
(4, 4, 'angelzm', '$2a$12$KKwgz4PKbBrSIB0ilRaFAug55HtPdlWlC/f1x4HrbigS7TwysWXvC', 1),
(5, 4, 'angelzm1', '$2y$10$mKFGu8TBBU.x5Jk4Ea3Dcesa6WaIRPlu3ePNYru64KMlOOkOF558S', 1);

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
  `address` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `blood_type` varchar(255) DEFAULT NULL,
  `allergies` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `office_id` int(11) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `is_Pwd` smallint(6) DEFAULT NULL,
  `is_SoloParent` smallint(6) DEFAULT NULL,
  `is_Pregnant` smallint(6) DEFAULT NULL,
  `profile_image` varchar(255) NOT NULL DEFAULT 'default.png',
  `user_about` varchar(500) NOT NULL DEFAULT 'No Bio',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userinfo`
--

INSERT INTO `userinfo` (`userInfo_id`, `user_id`, `first_name`, `middle_name`, `last_name`, `age`, `date_of_birth`, `sex`, `gender`, `address`, `email`, `phone`, `blood_type`, `allergies`, `ip`, `office_id`, `position`, `is_Pwd`, `is_SoloParent`, `is_Pregnant`, `profile_image`, `user_about`, `date_created`, `date_updated`) VALUES
(1, 1, 'John', 'Mea', 'Doe', '25', '1995-02-20', 'Female', 'Female', 'Zone 10 Cugman, Cagayan de Oro City', 'johndoe@gmail.com', '09123456789', 'O+', 'none', NULL, NULL, 'Programmer', 0, 1, 0, 'd6177de5-d803-4373-ada0-6b6e60f1748b.webp', '🌟 Cogito ergo sum🌟', '2025-01-31 00:00:00', '2025-02-01 21:06:02'),
(2, 2, 'Yskaela', 'Yaena', 'Fujimoto', '25', '1999-12-12', 'female', 'female', 'Japan 3rd Floor, Japan City', 'yaena_yska@gmail.com', '991', 'O+', 'none', NULL, NULL, NULL, 0, 0, 0, '829e1296-df94-4536-862d-e5ee50126b9b.png', '', '2025-01-31 00:00:00', '2025-02-25 10:08:02'),
(3, 3, 'Mariah', 'Queen', 'Arceta', '25', '1999-12-12', NULL, 'female', '', 'aiahkins@gmail.com', '09569260774', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'default.png', 'No Bio', '2025-02-02 09:31:45', NULL),
(4, 4, 'Jillian', 'Santos', 'Orencio', '22', '2002-12-20', NULL, 'female', 'Japan 3rd Floor. Etivac', 'dancethenightaway.kr@gmail.com', '+639569260774', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'c34e7078-38c1-44e1-8c9f-0645dcca1726.png', 'Experienced programmer specializing in PHP, C#, and Next.js with WinForms. Passionate about building efficient web and desktop applications, optimizing databases, and implementing secure authentication systems. Skilled in UI/UX design, Bootstrap styling, and dynamic system configurations. Currently developing an Applicants Application System with role-based access. Always eager to learn and tackle new development challenges🚀🚀🚀', '2025-02-02 10:38:00', '2025-02-11 11:00:54'),
(5, 5, 'Paul', 'Sho', 'Sho', '29', '1995-12-27', NULL, 'male', '', 'joda.orencio.coc@phinmaed.com', '09363350635', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'default.png', 'No Bio', '2025-02-02 10:43:21', NULL);

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
-- Indexes for table `evaluation`
--
ALTER TABLE `evaluation`
  ADD PRIMARY KEY (`eval_id`),
  ADD KEY `title_id` (`title_id`),
  ADD KEY `evaluated_entity_id` (`evaluated_entity_id`),
  ADD KEY `type_id` (`type_id`),
  ADD KEY `level_id` (`level_id`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `evaluator_id` (`evaluator_id`);

--
-- Indexes for table `evaluationgroups`
--
ALTER TABLE `evaluationgroups`
  ADD PRIMARY KEY (`group_id`);

--
-- Indexes for table `evaluationlevels`
--
ALTER TABLE `evaluationlevels`
  ADD PRIMARY KEY (`level_id`);

--
-- Indexes for table `evaluationpart`
--
ALTER TABLE `evaluationpart`
  ADD PRIMARY KEY (`part_id`),
  ADD KEY `evaluation_id` (`evaluation_id`);

--
-- Indexes for table `evaluationquestions`
--
ALTER TABLE `evaluationquestions`
  ADD PRIMARY KEY (`eval_quest_id`),
  ADD KEY `part_id` (`part_id`),
  ADD KEY `evaluation_id` (`evaluation_id`);

--
-- Indexes for table `evaluationresponse`
--
ALTER TABLE `evaluationresponse`
  ADD PRIMARY KEY (`response_id`),
  ADD KEY `eval_question_id` (`eval_question_id`);

--
-- Indexes for table `evaluationtitle`
--
ALTER TABLE `evaluationtitle`
  ADD PRIMARY KEY (`title_id`);

--
-- Indexes for table `evaluationtypes`
--
ALTER TABLE `evaluationtypes`
  ADD PRIMARY KEY (`type_id`);

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
-- Indexes for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD PRIMARY KEY (`progress_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `lesson_id` (`lesson_id`);

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
-- Indexes for table `topic_progress`
--
ALTER TABLE `topic_progress`
  ADD PRIMARY KEY (`topic_progress_id`),
  ADD KEY `topic_id` (`topic_id`),
  ADD KEY `user_id` (`user_id`);

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
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

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
  MODIFY `index_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `enrollment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `essay_answers`
--
ALTER TABLE `essay_answers`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evaluation`
--
ALTER TABLE `evaluation`
  MODIFY `eval_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evaluationgroups`
--
ALTER TABLE `evaluationgroups`
  MODIFY `group_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evaluationlevels`
--
ALTER TABLE `evaluationlevels`
  MODIFY `level_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evaluationpart`
--
ALTER TABLE `evaluationpart`
  MODIFY `part_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evaluationquestions`
--
ALTER TABLE `evaluationquestions`
  MODIFY `eval_quest_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evaluationresponse`
--
ALTER TABLE `evaluationresponse`
  MODIFY `response_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evaluationtitle`
--
ALTER TABLE `evaluationtitle`
  MODIFY `title_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evaluationtypes`
--
ALTER TABLE `evaluationtypes`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grades`
--
ALTER TABLE `grades`
  MODIFY `grade_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `materials`
--
ALTER TABLE `materials`
  MODIFY `material_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

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
-- AUTO_INCREMENT for table `topic_progress`
--
ALTER TABLE `topic_progress`
  MODIFY `topic_progress_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `true_false`
--
ALTER TABLE `true_false`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `userinfo`
--
ALTER TABLE `userinfo`
  MODIFY `userInfo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  ADD CONSTRAINT `commentsorquestions_ibfk_2` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`topic_id`) ON DELETE CASCADE;

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
-- Constraints for table `evaluation`
--
ALTER TABLE `evaluation`
  ADD CONSTRAINT `evaluation_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `evaluationlevels` (`level_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluation_ibfk_2` FOREIGN KEY (`title_id`) REFERENCES `evaluationtitle` (`title_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluation_ibfk_3` FOREIGN KEY (`group_id`) REFERENCES `evaluationgroups` (`group_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluation_ibfk_4` FOREIGN KEY (`type_id`) REFERENCES `evaluationtypes` (`type_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluation_ibfk_5` FOREIGN KEY (`evaluator_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluation_ibfk_6` FOREIGN KEY (`evaluated_entity_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `evaluationpart`
--
ALTER TABLE `evaluationpart`
  ADD CONSTRAINT `evaluationpart_ibfk_1` FOREIGN KEY (`evaluation_id`) REFERENCES `evaluation` (`eval_id`) ON DELETE CASCADE;

--
-- Constraints for table `evaluationquestions`
--
ALTER TABLE `evaluationquestions`
  ADD CONSTRAINT `evaluationquestions_ibfk_1` FOREIGN KEY (`part_id`) REFERENCES `evaluationpart` (`part_id`) ON DELETE CASCADE;

--
-- Constraints for table `evaluationresponse`
--
ALTER TABLE `evaluationresponse`
  ADD CONSTRAINT `evaluationresponse_ibfk_1` FOREIGN KEY (`eval_question_id`) REFERENCES `evaluationquestions` (`eval_quest_id`) ON DELETE CASCADE;

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
-- Constraints for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD CONSTRAINT `lesson_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `lesson_progress_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`);

--
-- Constraints for table `materials`
--
ALTER TABLE `materials`
  ADD CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`topic_id`) ON DELETE CASCADE;

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
-- Constraints for table `topic`
--
ALTER TABLE `topic`
  ADD CONSTRAINT `topic_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `topic_progress`
--
ALTER TABLE `topic_progress`
  ADD CONSTRAINT `topic_progress_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`topic_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `topic_progress_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE;

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
