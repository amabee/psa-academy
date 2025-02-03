-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 02, 2025 at 02:05 PM
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
(15, '47d2d511-a3f2-4292-a338-03269c3c58f4', 1, 39, 'Intro to Java Programming', 'Intro to Java Programming', 'course_6796df0d0aa55.png', 'publish', '2025-01-27 09:11:47', '2025-01-27 09:19:09'),
(16, 'bbf25daa-56f7-4038-a389-b0647e072e00', 1, 5, 'Introduction to Python', 'Learn about the origins of Python, its versatility, and why it&rsquo;s one of the most popular programming languages today. This lesson will also introduce you to Python&#039;s syntax and basic structure.', 'course_679c252c5a87e.png', 'publish', '2025-01-31 09:00:56', '2025-01-31 09:19:40');

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

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`enrollment_id`, `user_id`, `course_id`, `enrollment_date`) VALUES
(1, 4, '47d2d511-a3f2-4292-a338-03269c3c58f4', '2025-01-31 10:00:59');

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
('0a1bd08d-a1d4-4497-8112-48845d2a2f93', '47d2d511-a3f2-4292-a338-03269c3c58f4', 'Setting up the environment', 'Installing Node.js, VS Code, and dependencies', 'Resources not available', 2, '2025-01-31 09:52:27', NULL),
('24713fc0-a64d-45d5-a4f2-d90d32e938cd', 'bbf25daa-56f7-4038-a389-b0647e072e00', 'gege', 'egg', 'g', 1, '2025-01-31 09:50:29', '2025-01-31 09:51:47'),
('8d538766-59fa-4ff4-8340-4ddcdae0f2d9', 'bbf25daa-56f7-4038-a389-b0647e072e00', 'lesson 1', 'description 1', 'resources 1', 2, '2025-01-31 09:02:07', '2025-01-31 09:51:47'),
('ac74657b-1ad1-4a34-81cc-3bf5662eda9f', '47d2d511-a3f2-4292-a338-03269c3c58f4', 'Introduction to Next.js', 'Learn what Next.js is, its benefits over React, and when to use it.', 'Resources not available', 1, '2025-01-28 15:38:47', '2025-01-31 08:45:40');

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
(9, 'c00c71f5-ac79-40a5-8f07-7d9ec8a95f78', 'topic_679c1d7318653.pdf'),
(10, 'c66bc4ec-7046-4577-b3e3-5b7e587a6310', 'topic_679c26af11247.pdf'),
(11, '96a5a457-951d-43cb-ae7b-c3c6280107df', 'topic_679c2c3590061.pdf'),
(13, '401495cb-3b93-4283-bfdb-367dbbc1a73a', 'topic_679c2cf3278e9.pdf');

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
('022b560d63f42ef20017fab40b6a577e002d2462a1566e576702aab74efba6e5', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzk1NDY4MSwiZXhwIjoxNzM3OTYxODgxLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.t90DoaPTpXYiTgQmYn-kt5DuMSHZ7GCW4SssCvvdRBU', '::1', 'axios/1.7.9', '2025-01-27 13:11:21', '2025-01-27 13:11:21', '2025-01-27 15:11:21', 1),
('025ec10ff6801d6972674033cd57ec7cb3fb309af788697da5c851f152934938', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzk2MzQxNywiZXhwIjoxNzM3OTcwNjE3LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.msnbkdDhgASMXEV7mv7tOny1Ngw1wyfy1WCAR4SBUP4', '::1', 'axios/1.7.9', '2025-01-27 15:36:57', '2025-01-27 15:36:57', '2025-01-27 17:36:57', 1),
('09341872060da1caafd849f532963c3c18b2ea056df44d526ca4873e3d9ddbad', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODMwNDM5OCwiZXhwIjoxNzM4MzExNTk4LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.PxVAEdSCLurvRRvx2ZZ4HQyP4SEZ6MbuYsYSkVYB8Mk', '::1', 'axios/1.7.9', '2025-01-31 14:19:58', '2025-01-31 14:19:58', '2025-01-31 16:19:58', 1),
('0beccf6b710e75eb333f236d5717400680f57717309d92a8e125d4d7c1f6b295', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODI4MzcwNywiZXhwIjoxNzM4MjkwOTA3LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.giqkHZTgWhQ_8Z0d46UYyyfTTlM3l06nSGp-JsUGr6I', '::1', 'axios/1.7.9', '2025-01-31 08:35:07', '2025-01-31 08:35:07', '2025-01-31 10:35:07', 1),
('0e1e2c9ea44c72feb633b7d2af144031c75c0c452a093d174543dc4518385d7b', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4NDUwMiwiZXhwIjoxNzM3MjkxNzAyLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.v1RPJnaYqUl3Drkc7ERByPcnyVOYL8ttYxm_uUs9Rio', '::1', 'axios/1.7.9', '2025-01-19 19:01:42', '2025-01-19 19:01:42', '2025-01-19 21:01:42', 1),
('0e786bafccfa4b0f3a1e08b840a49bb763be2f4115941d2006b0e476a77c9159', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODAzMjUxOSwiZXhwIjoxNzM4MDM5NzE5LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.HzxafTUkDRTFnNV-k0Ww6K7osKkpVtHVe_d9OoperXY', '::1', 'axios/1.7.9', '2025-01-28 10:48:39', '2025-01-28 10:48:39', '2025-01-28 12:48:39', 1),
('100a29bb0f52529210b43f19851312a99a409eb92f1097d79cc976027bee2b98', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODI5MDkyNywiZXhwIjoxNzM4Mjk4MTI3LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.fOXD_ciNmZrmhHKYnP_bdkDk2IAS6dz1_7s28A4lGeQ', '::1', 'axios/1.7.9', '2025-01-31 10:35:27', '2025-01-31 10:35:27', '2025-01-31 12:35:27', 1),
('1370c5f49949ab38045008aec20612c7a1eac0f2d0c7bd24a2d96667a079fbfb', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODI5MDU5OSwiZXhwIjoxNzM4Mjk3Nzk5LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.aqeRYo0EXp9Yx5_BByVaixGkpPNRubROmmdPVceYyVU', '::1', 'axios/1.7.9', '2025-01-31 10:29:59', '2025-01-31 10:29:59', '2025-01-31 12:29:59', 1),
('183d3fce6c85012e6c9344e151ba162549adb7b36846146c6830bb44d80a9392', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODQ3MjAwMSwiZXhwIjoxNzM4NDc5MjAxLCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.GDTOQEYbnTHoDywon1_TFoWWGaJjOBuXU_ogsNUWYsM', '::1', 'axios/1.7.9', '2025-02-02 12:53:21', '2025-02-02 12:53:21', '2025-02-02 14:53:21', 1),
('1da49cf6646606185382c9d4d0941b8b371cf33f658c7908fa207d9c35d1e5ad', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODMxMjQzNywiZXhwIjoxNzM4MzE5NjM3LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.c1S56S-KPyYtYHllNxD-KsUv18gPx_9ULvTaHMbn_pk', '::1', 'axios/1.7.9', '2025-01-31 16:33:57', '2025-01-31 16:33:57', '2025-01-31 18:33:57', 1),
('24f074bfe400cf9a02a02b7ef7cc2b4cb5dc49e5faf946c54df61b46f1a409f7', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzcwMjY4MCwiZXhwIjoxNzM3NzA5ODgwLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.uMyfSbL_UBM7b5yy3oSiYdZSZ6BHjjp40mxyXiGKX4s', '::1', 'axios/1.7.9', '2025-01-24 15:11:20', '2025-01-24 15:11:20', '2025-01-24 17:11:20', 1),
('37136b8f578d7b0bb91d45d12c90f3b4d8fa3b31471a97f17ac9f0ec2c98ab19', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODQxNzAwOCwiZXhwIjoxNzM4NDI0MjA4LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.bIPHIHNRl7TOd6BSW3CynMmuGPfc5LN7ymsyDifFDk0', '::1', 'axios/1.7.9', '2025-02-01 21:36:48', '2025-02-01 21:36:48', '2025-02-01 23:36:48', 1),
('3ce1a66900b65e8d5d99d28cb21abf1b35e1ff73fde4cff9c4f579f5c070fae1', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODQ3MjcxOCwiZXhwIjoxNzM4NDc5OTE4LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.Gh_Zu0_673UcZDwq0afhx_22SOq91-bDbz23RNYLTQ8', '::1', 'axios/1.7.9', '2025-02-02 13:05:18', '2025-02-02 13:05:18', '2025-02-02 15:05:18', 1),
('3dea0e9dccd998c01501082272ef5d9677ebccdff5fe5a1ba2c92e9ac82e1df7', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzY4NzYwMCwiZXhwIjoxNzM3Njk0ODAwLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.TliLyKk8eK6Xpa5A5gS_eEpchuQM7VOqBy14K54nFX8', '::1', 'axios/1.7.9', '2025-01-24 11:00:00', '2025-01-24 11:00:00', '2025-01-24 13:00:00', 1),
('4a3e3956e07b3cd7c8e9cd82efaef78c56bcfcb629aa866311fc86887fad5569', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzY5NTE2NywiZXhwIjoxNzM3NzAyMzY3LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.7HN43RfBv_hdo2HwM99BlP56r9j4X4UT24f388QumIs', '::1', 'axios/1.7.9', '2025-01-24 13:06:07', '2025-01-24 13:06:07', '2025-01-24 15:06:07', 1),
('4eb93b0ddc356e7f37a98147684bfc24e808ceee16c6eeb6d203f4e18a82acf8', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODQ5NjQwNSwiZXhwIjoxNzM4NTAzNjA1LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.1nvz-sv64_h7_umbDQBa9dMh1wVzuUgkRj1VaRRtM4k', '::1', 'axios/1.7.9', '2025-02-02 19:40:05', '2025-02-02 19:40:05', '2025-02-02 21:40:05', 1),
('598c915cecc4a4e7433f70dfddb7b511876dd87b4544e8e9716eb17bdb877f33', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzQ1OTY2OSwiZXhwIjoxNzM3NDY2ODY5LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.ylZEkLigIX-YF7_Z8ewxrdIiIi_2FW3YsRO8iw3Yu28', '::1', 'axios/1.7.9', '2025-01-21 19:41:09', '2025-01-21 19:41:09', '2025-01-21 21:41:09', 1),
('63708044e39e02a2d311dbe76eb79893f63d4209abc20b72b1570ad9e9a4b5a6', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODM4OTMxNCwiZXhwIjoxNzM4Mzk2NTE0LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0._Vf7OmAg8r4jitq3SXYF2-gOhUFet5uRwQLXpRAd-LU', '::1', 'axios/1.7.9', '2025-02-01 13:55:14', '2025-02-01 13:55:14', '2025-02-01 15:55:14', 1),
('6b8fe480b285c90171f9540cb95a1cdea3cf61f79313725938cafcc7d25573f7', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODI5ODE0NCwiZXhwIjoxNzM4MzA1MzQ0LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.JjpXAz8oL2Qk7cT9qjznX3ee9F1xgAINbbPgYKvIb-8', '::1', 'axios/1.7.9', '2025-01-31 12:35:44', '2025-01-31 12:35:44', '2025-01-31 14:35:44', 1),
('6c2b393ef91f3ce3d66be59798228c2224faa8d6c7de21b11670dfdaa068891d', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODMwNTAyMCwiZXhwIjoxNzM4MzEyMjIwLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.UUntLpT2qxe2XWgDkukkMqck7dAkNO0ux9XyV9zamPo', '::1', 'axios/1.7.9', '2025-01-31 14:30:20', '2025-01-31 14:30:20', '2025-01-31 16:30:20', 1),
('6dce33aa5647db0d8813dbfcdcbfc3d12e999bb14171453152b5a58838458f25', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODI5MDU0NSwiZXhwIjoxNzM4Mjk3NzQ1LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.B9xMUkmaqzsgITBBbwAlXo5cyMB-g9s94buM5NPULpM', '::1', 'axios/1.7.9', '2025-01-31 10:29:05', '2025-01-31 10:29:05', '2025-01-31 12:29:05', 1),
('702f5b97dd2d65480c8a9bb571cfc2047e5b4222c4f9dcc74fe55838634cc7f5', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODQ2NTMzMywiZXhwIjoxNzM4NDcyNTMzLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.xdI2r0-KInv1Ra2uSsjcnDrB1RnZY83DcQdhI2lkwL8', '::1', 'axios/1.7.9', '2025-02-02 11:02:13', '2025-02-02 11:02:13', '2025-02-02 13:02:13', 1),
('726d55aa54b5772e28c94b3e90c53c915b20cd42ead8451e03b04661645ff56d', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODQ5Mjk2OSwiZXhwIjoxNzM4NTAwMTY5LCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.cwCKLKlUIH8VgYa-tI65C4Cf17SI6tBd-RucNxTmdk8', '::1', 'axios/1.7.9', '2025-02-02 18:42:49', '2025-02-02 18:42:49', '2025-02-02 20:42:49', 1),
('778b3a86ceb66585ad2741f5adc2976faffa16cc451d1fea183632fdc6ad739f', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzM3ODc4NCwiZXhwIjoxNzM3Mzg1OTg0LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.UVIndqRQ_9n6xW9xI6PMvRhz5YKXdCITxawMGGpsDZ0', '::1', 'axios/1.7.9', '2025-01-20 21:13:04', '2025-01-20 21:13:04', '2025-01-20 23:13:04', 1),
('78a8f0c0ccecd40e69ec90cee17a17aab0eff930b046944e21aed9ed45f5c3a2', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODA0MTMzNiwiZXhwIjoxNzM4MDQ4NTM2LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.RceurbR_y3Xoo5gWnQ4EtCwKwxK-GjMu0aLrmyOWxfg', '::1', 'axios/1.7.9', '2025-01-28 13:15:36', '2025-01-28 13:15:36', '2025-01-28 15:15:36', 1),
('7b66fcd07326368d0ae17aeb0a14714efc56e0f81babe4d3b57f6ba01555667d', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODQxMzYyMSwiZXhwIjoxNzM4NDIwODIxLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.G5TNxzVtCfRpGdhemwz9wh8uob1CttQ_BfQTgosNVZQ', '::1', 'axios/1.7.9', '2025-02-01 20:40:21', '2025-02-01 20:40:21', '2025-02-01 22:40:21', 1),
('7d3790c5df88b358df792f0b48f0e52935dd0f93f86756a450ed6014d6384b94', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODM5NjU0NywiZXhwIjoxNzM4NDAzNzQ3LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.cOjqBXAkZfW0RU4aHHFmAjQ4zxVD-9PlJMCYsBujrfw', '::1', 'axios/1.7.9', '2025-02-01 15:55:47', '2025-02-01 15:55:47', '2025-02-01 17:55:47', 1),
('7f66f8b63d692b121c5ff2ae6a3087c23e4b9f69d4027f5b21b3aba5eba09c41', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4NDY5OCwiZXhwIjoxNzM3MjkxODk4LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.qaEyOXz3BnNtFbn1MgnvpFG9X5c67wpKMI3QOTj8pOw', '::1', 'axios/1.7.9', '2025-01-19 19:04:58', '2025-01-19 19:04:58', '2025-01-19 21:04:58', 1),
('83a3566f4cdb252c275dca1e7369bd0eb1c5e6a13f670ea269ca06cd7aa130ea', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODM5NzY2MCwiZXhwIjoxNzM4NDA0ODYwLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.URHJUMV16CdIHOc2pSdCsfopdELsnt3wd5LWXEQOcuI', '::1', 'axios/1.7.9', '2025-02-01 16:14:20', '2025-02-01 16:14:20', '2025-02-01 18:14:20', 1),
('8ec1eb78363387438b9bf8143616e9c91639b9b8b3023b73fd7bd0b9ab1f15f7', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI5NDI1OSwiZXhwIjoxNzM3MzAxNDU5LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.FbdeaYcv2LVgTaesBDOPDbz7JZwpQm2ijFpMmN8bp8E', '::1', 'axios/1.7.9', '2025-01-19 21:44:19', '2025-01-19 21:44:19', '2025-01-19 23:44:19', 1),
('9149b4196e1e44caf3731d6689a4065f8c122719af139ec1a49e49ae854dc66d', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODM5NzQyOCwiZXhwIjoxNzM4NDA0NjI4LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.8o0wvexTapQ4QjMLCagZ2WOlfrsE_Y_USoGn-_S5hhI', '::1', 'axios/1.7.9', '2025-02-01 16:10:28', '2025-02-01 16:10:28', '2025-02-01 18:10:28', 1),
('91ca70c0dcb20282107494897db14c9b0e8113d5fd2bdfd21828946aa4466f42', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4NDYyMCwiZXhwIjoxNzM3MjkxODIwLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.Z561fM0iSAIOy09Xdh06cvbBzfG72qkG4YVr3vGPP1U', '::1', 'axios/1.7.9', '2025-01-19 19:03:40', '2025-01-19 19:03:40', '2025-01-19 21:03:40', 1),
('92691545aa3537f49c1ed9d29402610d87c41d93a272c3276fb025548b70e918', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4MzQ3MywiZXhwIjoxNzM3MjkwNjczLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.a2EPkkBVz8eopJTd_qrbP8QpP0mbqzMABqUMrQm7Iyg', '::1', 'axios/1.7.9', '2025-01-19 18:44:33', '2025-01-19 18:44:33', '2025-01-19 20:44:33', 1),
('929ba9e2c6acc5aeb6f9c0cd6e2baab7473415055c8c972a573802c5df7e4a97', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODM5ODQ3MywiZXhwIjoxNzM4NDA1NjczLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.VypDC0_fi5jK4oQhhAuO6KV6l-0mOIAeFuat43YZOgU', '::1', 'axios/1.7.9', '2025-02-01 16:27:53', '2025-02-01 16:27:53', '2025-02-01 18:27:53', 1),
('aaf36cb01d3eb4432a126450fa89460cf5aaf63e7b3cc0183a4a643202ae8087', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzk0NzQzMSwiZXhwIjoxNzM3OTU0NjMxLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.90_CL6B6KEuOgRbT-c8dfnwGOLUTOQ9jZiO6Z3wCIKE', '::1', 'axios/1.7.9', '2025-01-27 11:10:31', '2025-01-27 11:10:31', '2025-01-27 13:10:31', 1),
('b45c4b1f7e1a5baab885270466cbf5b58edcdfcc0551328f2216d40c2316fa10', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4NDMxNywiZXhwIjoxNzM3MjkxNTE3LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.cOecLG8lOljysdmFD73e6N8ykOJaBW6g7BllhHivtBw', '::1', 'axios/1.7.9', '2025-01-19 18:58:37', '2025-01-19 18:58:37', '2025-01-19 20:58:37', 1),
('bc9ad469f4443831a88a59828f802812c82160b02a47ec03b52c050cff6e0bb2', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODA0ODYxNCwiZXhwIjoxNzM4MDU1ODE0LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.D9dP51lvaSZVicnfWl6eisKlf1aWLmBiUyFig6p6jlM', '::1', 'axios/1.7.9', '2025-01-28 15:16:54', '2025-01-28 15:16:54', '2025-01-28 17:16:54', 1),
('c002ebee3f8ca4a351ce6776e6c9bf041ff953c359ca7072d8f3e04edb996cb4', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODAyNTI2MSwiZXhwIjoxNzM4MDMyNDYxLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.JG0ttm1nr2JP09IhcPd2nbFmbWFddKl58Byt5cA7CEs', '::1', 'axios/1.7.9', '2025-01-28 08:47:41', '2025-01-28 08:47:41', '2025-01-28 10:47:41', 1),
('c10cf259b59ef350fe7c665a44244face8319468a527aba28a49f0ecff3cf7ff', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzM3MTU2OCwiZXhwIjoxNzM3Mzc4NzY4LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.rvLoBzUPUfzTbL9M9Z_Ao_1uLnGGupEoy2ZdxhjtcGA', '::1', 'axios/1.7.9', '2025-01-20 19:12:48', '2025-01-20 19:12:48', '2025-01-20 21:12:48', 1),
('c6e49ebc41a6f7e892886877a8c803b6df0eda5ab9b88408ff889faad0dbf9de', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODM5NzUyNCwiZXhwIjoxNzM4NDA0NzI0LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.VdMvLmQr1j7vU1306FaZxQ28l36Dr_lVStQ1i0RhsZ0', '::1', 'axios/1.7.9', '2025-02-01 16:12:04', '2025-02-01 16:12:04', '2025-02-01 18:12:04', 1),
('d0df322bb3989864787b0f6b9c9aa615f05bc780624d1a6e51737f5ae9db8bed', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODQxNjg4OSwiZXhwIjoxNzM4NDI0MDg5LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.hitp-dYiIxDGSqJEWfYtUdORa9Pf4Mmmkg9-JzlmNvk', '::1', 'axios/1.7.9', '2025-02-01 21:34:49', '2025-02-01 21:34:49', '2025-02-01 23:34:49', 1),
('d1c9e0c050b22dfa9645ec87683d1949d86b7be8ac1475b34dbd5c0989abd5ae', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODQ2NDI2MSwiZXhwIjoxNzM4NDcxNDYxLCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.VOqdp0puSizYJIRSH21BaW6pszoy_FLb193VSfi8vGE', '::1', 'axios/1.7.9', '2025-02-02 10:44:21', '2025-02-02 10:44:21', '2025-02-02 12:44:21', 1),
('d3d7d5a4b7e043afbbaea7aee2d78d441522b200c906d5348ab5287e7039f252', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzkzOTkwOCwiZXhwIjoxNzM3OTQ3MTA4LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.JYGDx2-ZtNlCruWq5ejZ1hQfb1XfmvvUTemk-w2AIIE', '::1', 'axios/1.7.9', '2025-01-27 09:05:08', '2025-01-27 09:05:08', '2025-01-27 11:05:08', 1),
('dbe4e2523759fb079ffa1d97dd43da8a0a7db6d008a88c02b95466706aa79350', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODQxNjA5NiwiZXhwIjoxNzM4NDIzMjk2LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.RG_JM4ccKt8Vh0DrGiBx1xpR6u4ujOPjQixChSy2MUE', '::1', 'axios/1.7.9', '2025-02-01 21:21:36', '2025-02-01 21:21:36', '2025-02-01 23:21:36', 1),
('e09439a747545de4c41abc12d7fe15dac27401f5094fe02d9af46c7e44843153', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzY5NTQyMCwiZXhwIjoxNzM3NzAyNjIwLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.EeD75kEBtscQq5qFu7thZBwKznBfiy83tSIcj-wxqgU', '::1', 'axios/1.7.9', '2025-01-24 13:10:20', '2025-01-24 13:10:20', '2025-01-24 15:10:20', 1),
('e6786bba0c819d2fe34e9ce1ade573f4947bf6689336c5397b189bbd84a1b9c0', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODQwNjMzNiwiZXhwIjoxNzM4NDEzNTM2LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.dinO2H0g_DlauPGe9nr9L7ta49U_lqNG7c8P1XG4ygE', '::1', 'axios/1.7.9', '2025-02-01 18:38:56', '2025-02-01 18:38:56', '2025-02-01 20:38:56', 1),
('e809d6f4a207ddeba83996529d306ec52d5538b95bd3bfc0fb3877f6a48f2288', 2, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODI4Njc5NiwiZXhwIjoxNzM4MjkzOTk2LCJzdWIiOjIsInVzZXIiOnsiaWQiOjIsInVzZXJuYW1lIjoieWFlbmEiLCJmdWxsX25hbWUiOiJZc2thZWxhWWFlbmFGdWppbW90byIsImVtYWlsIjoieWFlbmFfeXNrYUBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjN9fQ.ukTRBwfhnuzXyZNORT8kXr8LKgTCXX5yqz2BfyEjSpA', '192.168.20.33', 'axios/1.7.9', '2025-01-31 09:26:36', '2025-01-31 09:26:36', '2025-01-31 11:26:36', 1),
('e91fda7007ab571c21cd88313bc2fafdf2060da3cbad7e7aae6468e1d58f73b9', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4NDQ2NiwiZXhwIjoxNzM3MjkxNjY2LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.h-KgTEspptesZMuM3mRXN4uL47mB9fvAs6tUf47lBx8', '::1', 'axios/1.7.9', '2025-01-19 19:01:06', '2025-01-19 19:01:06', '2025-01-19 21:01:06', 1),
('eae800f1fd65ac1c97dc1dc7b96540140935606ad6b728fef68e5947a15346f6', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzY4MDA5NSwiZXhwIjoxNzM3Njg3Mjk1LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.7pRzhTXttnhWf0YVYhAHOvkOpVVtC8lKSG7Ll9isADU', '::1', 'axios/1.7.9', '2025-01-24 08:54:55', '2025-01-24 08:54:55', '2025-01-24 10:54:55', 1),
('eb86041ada373cc9af2c9199bc60fcdc9b64596cf4986d9e26278eb47a3e64c9', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODQ4MTY1MCwiZXhwIjoxNzM4NDg4ODUwLCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.mPKArJmuMSsfNVnX9O-7yqjUsWx3l760R5naux0l5yg', '::1', 'axios/1.7.9', '2025-02-02 15:34:10', '2025-02-02 15:34:10', '2025-02-02 17:34:10', 1),
('f21f1ef83c1894536ef8637f6cafb5a1fd9e2a730395ee84269ea9f1d92baade', 2, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODQxNzEyNCwiZXhwIjoxNzM4NDI0MzI0LCJzdWIiOjIsInVzZXIiOnsiaWQiOjIsInVzZXJuYW1lIjoieWFlbmEiLCJmdWxsX25hbWUiOiJZc2thZWxhWWFlbmFGdWppbW90byIsImVtYWlsIjoieWFlbmFfeXNrYUBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.7drX8LDosOIbdK9PCAMhjjso8KC3OWkjaQ4-9AQjjLM', '::1', 'axios/1.7.9', '2025-02-01 21:38:44', '2025-02-01 21:38:44', '2025-02-01 23:38:44', 1),
('f356491b117442aa026a3338c90b32bf1e66e729d5d156d1187ac7ef6025f8ff', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4NDcyNCwiZXhwIjoxNzM3MjkxOTI0LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.YsE4ONiN1v3TYDkONW4w_aYT03RiAhDZJfnjQ40qJDY', '::1', 'axios/1.7.9', '2025-01-19 19:05:24', '2025-01-19 19:05:24', '2025-01-19 21:05:24', 1),
('fa42bff4ddcdf5b0af5a50a3cdc159b077280f2c3d2bf294e4955fd96954c03d', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzI4NDU3MSwiZXhwIjoxNzM3MjkxNzcxLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.u9RRhosR9utmT29D5UvsF5hoMxZO97kFV5doPKy1Je0', '::1', 'axios/1.7.9', '2025-01-19 19:02:51', '2025-01-19 19:02:51', '2025-01-19 21:02:51', 1),
('fa46e49a7be1c7fbe3f72aea64ec8e0c309ef8136d962eac5dfe8f051798d659', 2, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczODI4NTI0NiwiZXhwIjoxNzM4MjkyNDQ2LCJzdWIiOjIsInVzZXIiOnsiaWQiOjIsInVzZXJuYW1lIjoieWFlbmEiLCJmdWxsX25hbWUiOiJZc2thZWxhWWFlbmFGdWppbW90byIsImVtYWlsIjoieWFlbmFfeXNrYUBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjN9fQ.YqIQCbh_3c20idbbTnmLM8jVU5fvDCGC3XuiJqMbbqY', '::1', 'axios/1.7.9', '2025-01-31 09:00:46', '2025-01-31 09:00:46', '2025-01-31 11:00:46', 1),
('fb7809fd36dc4026ec8308ff7e7b7865457767e78c6b0e4bb8cf75d0a7129052', 2, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTczNzQ1OTYwMCwiZXhwIjoxNzM3NDY2ODAwLCJzdWIiOjIsInVzZXIiOnsiaWQiOjIsInVzZXJuYW1lIjoic3R1ZGVudDEiLCJmdWxsX25hbWUiOiJZc2thZWxhWWFlbmFGdWppbW90byIsImVtYWlsIjoieWFlbmFfeXNrYUBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.sNpJ41k1SZwEFMWF_4Do5_HzyfNzIgCwAPMUPPuX1ts', '::1', 'axios/1.7.9', '2025-01-21 19:40:00', '2025-01-21 19:40:00', '2025-01-21 21:40:00', 1);

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
('092e9001-c7e1-4ec8-9a66-2b7c4ea36555', 'd6f480c6-af0b-421b-82a9-fbdd8710b55c', 'BBB', 'ADADSADAd', 7, '2025-01-28 13:45:16', NULL),
('0c773c0c-4895-4f98-9a2f-2348d2cf5692', 'd6f480c6-af0b-421b-82a9-fbdd8710b55c', 'BB', 'B', 1, '2025-01-28 08:56:19', NULL),
('12b93c51-8a15-4dec-b14c-0e9e8a552c54', '1cb2d8c5-9a0a-4cc6-8fa1-9e94673c80c1', 'ddsad', 'dsssa', 3, '2025-01-28 13:49:44', NULL),
('1c4a9364-e525-462b-82d0-361f4dbefd6c', 'd6f480c6-af0b-421b-82a9-fbdd8710b55c', 'SDADSA', 'ASDADADASd', 4, '2025-01-28 11:40:38', NULL),
('2ad46d44-6b95-468d-b430-2c614e7044ce', '1cb2d8c5-9a0a-4cc6-8fa1-9e94673c80c1', 'gaga', 'gagag', 4, '2025-01-28 14:06:19', NULL),
('2c679562-5bc5-4189-ab59-692c0f2ca7a1', '5f63da2d-bff1-49fe-ad54-be705598b279', 'ggaqwe', 'qweqwewqe', 10, '2025-01-28 15:36:33', NULL),
('2e4191ef-4b85-4ee0-a85f-f7913f3d1073', '1cb2d8c5-9a0a-4cc6-8fa1-9e94673c80c1', 'GGSSSSS', 'GGSSSSS', 5, '2025-01-28 14:07:45', NULL),
('350ed4a5-8054-403c-9d19-c4f821772100', '5f63da2d-bff1-49fe-ad54-be705598b279', 'Kaltok 101', 'Kaltok Basics', 9, '2025-01-28 15:35:40', NULL),
('401495cb-3b93-4283-bfdb-367dbbc1a73a', '0a1bd08d-a1d4-4497-8112-48845d2a2f93', 'Creating a Next.js App', 'Using npx create-next-app', 1, '2025-01-31 09:52:54', NULL),
('4c59a31a-035d-44db-b702-77894c7a0d1c', 'd6f480c6-af0b-421b-82a9-fbdd8710b55c', 'BSS', 'BSS', 2, '2025-01-28 09:13:14', NULL),
('5530f750-ad57-4573-b7d3-843409b9996e', '1cb2d8c5-9a0a-4cc6-8fa1-9e94673c80c1', 'Aso', 'Winston Lee', 2, '2025-01-28 13:48:34', NULL),
('5a0408db-30bb-4634-949a-d0c99915dd0e', '5f63da2d-bff1-49fe-ad54-be705598b279', 'Bucky', 'Bucky', 11, '2025-01-28 15:37:11', NULL),
('62dcebec-4c44-4470-a3ce-a322f30bb1eb', '1cb2d8c5-9a0a-4cc6-8fa1-9e94673c80c1', 'dd', 'ddd', 7, '2025-01-28 14:10:41', NULL),
('659cb079-d927-438d-a0d8-b8921d9d5d30', '5f63da2d-bff1-49fe-ad54-be705598b279', 'Video 1', 'Video 2', 7, '2025-01-28 15:32:28', NULL),
('74db3b77-ff93-4c77-8cc8-c809ca8a473e', '1cb2d8c5-9a0a-4cc6-8fa1-9e94673c80c1', 'gg', 'gsasd', 9, '2025-01-28 14:12:03', NULL),
('7eec2e46-9fd7-4c6a-b547-14ee32cb7924', '5f63da2d-bff1-49fe-ad54-be705598b279', 'gg', 'ggs', 8, '2025-01-28 15:34:12', NULL),
('874a0440-9d05-4bd5-91ce-68f21ca3e3c1', '1cb2d8c5-9a0a-4cc6-8fa1-9e94673c80c1', 'SDASDA', 'ASDASDA', 1, '2025-01-28 13:46:27', NULL),
('8c0a31ca-0555-4631-8034-4f9e78bf854f', '1cb2d8c5-9a0a-4cc6-8fa1-9e94673c80c1', 'rrq', 'rqr', 6, '2025-01-28 14:08:47', NULL),
('96a5a457-951d-43cb-ae7b-c3c6280107df', '8d538766-59fa-4ff4-8340-4ddcdae0f2d9', 'GGSS', 'Yaena', 1, '2025-01-31 09:49:49', NULL),
('99bd7060-9fb7-4ff8-af72-6067e5815743', 'd6f480c6-af0b-421b-82a9-fbdd8710b55c', 'SBG', 'SBG', 5, '2025-01-28 13:16:07', NULL),
('9fd683e2-53a8-4bc0-8e2f-d06d09f0084a', '5f63da2d-bff1-49fe-ad54-be705598b279', 'BBBBBB', 'BBBBB', 1, '2025-01-28 14:14:27', NULL),
('ae58f725-5eb2-447e-a701-d44737275e92', 'd6f480c6-af0b-421b-82a9-fbdd8710b55c', 'Sheesh', 'Sheesh', 3, '2025-01-28 10:45:24', NULL),
('b5651866-fb8c-4554-bf82-ef0eec2cd856', 'a0cea95a-fc70-4c8f-9a68-4e6f456ed4ff', 'Chapter 1: Web Design Principles', 'Learn the essentials of web development, including creating static web pages with HTML and CSS. You\'ll understand how websites are structured and styled', 1, '2025-01-27 10:23:15', NULL),
('b835b5e2-cf3b-4268-a7ae-447d1c75ddfd', '5f63da2d-bff1-49fe-ad54-be705598b279', 'HDHDHD', 'SDASD', 2, '2025-01-28 14:14:44', NULL),
('ba8e2723-cc5b-4054-a7fd-31cd080cbcb3', '5f63da2d-bff1-49fe-ad54-be705598b279', 'gagaga', 'gagagagagaga', 4, '2025-01-28 14:45:30', NULL),
('bb10439a-4944-4274-a99f-290c672ac3bb', '1cb2d8c5-9a0a-4cc6-8fa1-9e94673c80c1', 'Nyalibee', 'Nyalibee', 8, '2025-01-28 14:11:22', NULL),
('c00c71f5-ac79-40a5-8f07-7d9ec8a95f78', 'ac74657b-1ad1-4a34-81cc-3bf5662eda9f', 'What is Next.js?', 'Overview and key features', 1, '2025-01-31 08:46:09', '2025-01-31 08:46:46'),
('c1f4e135-5538-4d88-b4df-583aeceb4742', '5f63da2d-bff1-49fe-ad54-be705598b279', 'Usok', 'Usok', 3, '2025-01-28 14:19:39', NULL),
('c66bc4ec-7046-4577-b3e3-5b7e587a6310', 'ac74657b-1ad1-4a34-81cc-3bf5662eda9f', 'Why use Next.js?', 'Comparison with React and other frameworks', 2, '2025-01-31 09:26:11', NULL),
('d8a62c3b-74fd-48da-a64a-ec346f8c4b4d', 'a0cea95a-fc70-4c8f-9a68-4e6f456ed4ff', 'Chapter 2: HTML,CSS,JS: What are they?', 'Structuring web pages', 2, '2025-01-27 10:27:12', NULL),
('e3e5dfea-94de-4b83-b81c-6964f2969901', '5f63da2d-bff1-49fe-ad54-be705598b279', 'h', 'q', 6, '2025-01-28 14:53:00', NULL),
('e58d8693-d00b-4127-9ddd-487b78a9e973', 'd6f480c6-af0b-421b-82a9-fbdd8710b55c', 'topic 1', 'topic 1', 6, '2025-01-28 13:36:42', NULL),
('f1453dc1-0ab0-45d7-8e35-8db7e996864d', 'a0cea95a-fc70-4c8f-9a68-4e6f456ed4ff', 'Chapter 3: Web Syntaxes and what are they.', 'Web Syntaxes', 3, '2025-01-27 11:10:00', NULL),
('f2bc47ae-51d6-45d3-92fe-a5386666be8a', '5f63da2d-bff1-49fe-ad54-be705598b279', 'hhhh', 'hwqeqwe', 5, '2025-01-28 14:46:06', NULL),
('f6b1df6d-4864-4c20-9a76-4e55a268ac55', 'a0cea95a-fc70-4c8f-9a68-4e6f456ed4ff', 'Chapter 4: Into the stylesheet verse', 'Web Stylesheet designing', 4, '2025-01-27 11:20:56', NULL),
('f6b9df6d-4864-4c20-9a76-4e55a268ac55', 'a0cea95a-fc70-4c8f-9a68-4e6f456ed4ff', 'Chapter 5: Into the stylesheet verse 2', 'Advance Stylesheet configs', 4, '2025-01-27 11:11:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `topic_progress`
--

CREATE TABLE `topic_progress` (
  `topic_progress_id` int(11) NOT NULL,
  `topic_id` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_completed` tinyint(4) NOT NULL,
  `completion_date` datetime DEFAULT NULL,
  `last_accessed` datetime NOT NULL DEFAULT current_timestamp()
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
(1, 3, 'johndoe', '$2a$12$KKwgz4PKbBrSIB0ilRaFAug55HtPdlWlC/f1x4HrbigS7TwysWXvC', 1),
(2, 4, 'yaena', '$2a$12$KKwgz4PKbBrSIB0ilRaFAug55HtPdlWlC/f1x4HrbigS7TwysWXvC', 1),
(3, 4, 'aiahkin', '$2y$10$z2lHlJv1K8JugG/u/q8DzOqKVQBnWqAeXM3eg3uJk1I/4x1EEdBka', 1),
(4, 4, 'angelzm', '$2y$10$yIsI96X900Waqcj00iql.uUuOIR20aV/8uZzSRO5RSB6uGfODl7mC', 1),
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
(2, 2, 'Yskaela', 'Yaena', 'Fujimoto', '25', '1999-12-12', 'female', 'female', 'Japan 3rd Floor, Japan City', 'yaena_yska@gmail.com', '991', 'O+', 'none', NULL, NULL, NULL, 0, 0, 0, 'default.png', '', '2025-01-31 00:00:00', NULL),
(3, 3, 'Mariah', 'Queen', 'Arceta', '25', '1999-12-12', NULL, 'female', '', 'aiahkins@gmail.com', '09569260774', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'default.png', 'No Bio', '2025-02-02 09:31:45', NULL),
(4, 4, 'Jillian', 'Santos', 'Orencio', '22', '2002-12-20', NULL, 'female', '', 'dancethenightaway.kr@gmail.com', '+639569260774', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'default.png', 'No Bio', '2025-02-02 10:38:00', NULL),
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
  MODIFY `index_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `enrollment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- AUTO_INCREMENT for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `materials`
--
ALTER TABLE `materials`
  MODIFY `material_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
  MODIFY `topic_progress_id` int(11) NOT NULL AUTO_INCREMENT;

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
