-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 11, 2025 at 07:11 AM
-- Server version: 11.8.2-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `psa-academy`
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
(20, '2ffb59df-d35d-4663-a656-4020459d0a31', 1, 99, 'not available', 'not available', 'default.jpg', 'draft', '2025-03-27 11:13:28', NULL),
(17, '3feed044-fccf-405a-9ec0-e7ea0125a141', 1, 5, 'Introduction to Programming', 'Introduction to Programming', 'course_67a0c044bd850.png', 'publish', '2025-02-03 21:09:51', '2025-03-27 12:50:08'),
(18, 'f437be06-3317-4a54-8a0e-16b022b1bbbc', 1, 5, 'Object-Oriented Programming (OOP) in Python', 'Python OOP', 'course_67a58d9ee463a.webp', 'publish', '2025-02-07 12:34:55', '2025-06-11 12:33:05');

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
(5, 4, 'f437be06-3317-4a54-8a0e-16b022b1bbbc', 1, '2025-03-27 10:24:24'),
(7, 4, '3feed044-fccf-405a-9ec0-e7ea0125a141', 1, '2025-03-27 10:24:30'),
(8, 6, '3feed044-fccf-405a-9ec0-e7ea0125a141', 1, '2025-03-27 10:24:32'),
(9, 6, 'f437be06-3317-4a54-8a0e-16b022b1bbbc', 1, '2025-03-27 10:24:35');

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
('135ab87c-98ac-49d1-9554-af2d358480c2', 'f437be06-3317-4a54-8a0e-16b022b1bbbc', 'Lesson 1', 'Basics Of Python OOP', 'https://www.geeksforgeeks.org/python-oops-concepts/', 1, '2025-02-19 11:59:58', '2025-03-27 10:37:54'),
('8b062884-5a9e-4030-81ec-79998bb10299', '3feed044-fccf-405a-9ec0-e7ea0125a141', 'Introduction to Programming', 'Introduction to Programming', 'Resources not available', 1, '2025-02-11 08:33:28', NULL),
('e06c99a9-4814-44f9-8dab-6eee92258c7b', '3feed044-fccf-405a-9ec0-e7ea0125a141', 'Basic Syntax', 'Java Edition', 'Resources not available', 2, '2025-02-14 14:05:27', NULL);

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
(26, '56329bed-5af4-40ed-abb4-f1342d21c47f', 'topic_6849053a01a9d.pdf');

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
-- Table structure for table `responses`
--

CREATE TABLE `responses` (
  `response_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `answer_text` text NOT NULL,
  `answer_choice_id` int(11) NOT NULL,
  `answer_boolean` int(11) NOT NULL,
  `submission_date` date NOT NULL DEFAULT current_timestamp(),
  `score` int(11) NOT NULL
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
('06b5fadb1e87e621917c573a1763bbebecca284e9162a8464a1c45293f49882b', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzAzNzcyMSwiZXhwIjoxNzQzMDQ0OTIxLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.EhnhYH1pLUHncEyo7T8cbyJ8iNhh_JWHFofG-Eewx98', '::1', 'axios/1.8.4', '2025-03-27 09:08:41', '2025-03-27 09:08:41', '2025-03-27 11:08:41', 1),
('091eaefc1de2dff700c73f7f6f4163dbbd4b68941f7fd55882d041bf6a5fa566', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzA0NTE4MiwiZXhwIjoxNzQzMDUyMzgyLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.QCsp37in2xKaftgAKwSaH1vHqT85aVu1ECJW1W4EeaA', '192.168.1.6', 'axios/1.8.4', '2025-03-27 11:13:02', '2025-03-27 11:13:02', '2025-03-27 13:13:02', 1),
('0a8971e2ab10e2c655c074fa5c0934eeea1cd87fdf5589ae7f55958be0e58ad3', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MjQ1NjE2NywiZXhwIjoxNzQyNDYzMzY3LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.LjsyaemdTRtnRrOh5sJO5XObtihGg5CjcNMw5Mg11m4', '::1', 'axios/1.7.9', '2025-03-20 15:36:07', '2025-03-20 15:36:07', '2025-03-20 17:36:07', 1),
('0c2a75809ecead290c387167f32165b8cacc3cd6d44335a6acf225e2c11effb1', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzA0NjU4OSwiZXhwIjoxNzQzMDUzNzg5LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.jhgLWE4QFClNELdAfmMxtaCr5zp5nRXxblwtmVCgiag', '192.168.1.6', 'axios/1.8.4', '2025-03-27 11:36:29', '2025-03-27 11:36:29', '2025-03-27 13:36:29', 1),
('0f1c1e794b3d96d621cadaf024af9ea2284784ad0d94c727596949a8e800d964', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MjM2Nzk3MSwiZXhwIjoxNzQyMzc1MTcxLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.KVUI1Z2QyjBegwc1vaTIcDoK1l1KAp9MD9rIfe-3WBw', '::1', 'axios/1.7.9', '2025-03-19 15:06:11', '2025-03-19 15:06:11', '2025-03-19 17:06:11', 1),
('177fd3dca497ae8cc3c5d5220383fb1293f6313b6e74da1e241d8da4c57fc0c9', 6, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzA1MTA5MCwiZXhwIjoxNzQzMDU4MjkwLCJzdWIiOjYsInVzZXIiOnsiaWQiOjYsInVzZXJuYW1lIjoicGF1bF9zaG8iLCJmdWxsX25hbWUiOiJQYXVsU2hvU2hvIiwiZW1haWwiOiJqb2hucGF1bG9yZW5jaW8zQGdtYWlsLmNvbSIsInVzZXJfdHlwZV9pZCI6NH19.SouARB8RAiBsioU0wGnqFcKnWusi8Y9kr7faodlxIfo', '192.168.1.6', 'axios/1.8.4', '2025-03-27 12:51:30', '2025-03-27 12:51:30', '2025-03-27 14:51:30', 1),
('1f3ab939cb8145b85eda373cfecbc02b16b09538314af2ce4655ff96b125fb1b', 2, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MTc3NDM3NCwiZXhwIjoxNzQxNzgxNTc0LCJzdWIiOjIsInVzZXIiOnsiaWQiOjIsInVzZXJuYW1lIjoieWFlbmEiLCJmdWxsX25hbWUiOiJZc2thZWxhWWFlbmFGdWppbW90byIsImVtYWlsIjoieWFlbmFfeXNrYUBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.rSLawH3-iA0OnYjN4hNYcUCIuRFnqd-Wbd5iZssmEl8', '::1', 'axios/1.7.9', '2025-03-12 18:12:54', '2025-03-12 18:12:54', '2025-03-12 20:12:54', 1),
('3812a1f43b967a36b93d0c67b1977bad3a70822c0ea46f54aedd74d36a904885', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0OTYxNTQyMCwiZXhwIjoxNzQ5NjIyNjIwLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.hUWCpJlbyEBP7Eknr2MtEo5dOMnKatBh5A42ZeibuyM', '192.168.1.2', 'axios/1.8.4', '2025-06-11 12:17:00', '2025-06-11 12:17:00', '2025-06-11 14:17:00', 1),
('40bb240a37836fe1fdf5f490fd9543326a9247810cce5fb1a7f9bcc1b2aaac38', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzA0MjU0MywiZXhwIjoxNzQzMDQ5NzQzLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.sBjGoXusk610WQFynvvSiwUHtjXCh3Cmz-qurRBF5S4', '192.168.1.6', 'axios/1.8.4', '2025-03-27 10:29:03', '2025-03-27 10:29:03', '2025-03-27 12:29:03', 1),
('4472142a20f0c40f8b4fa3c0e7000239515f4acf1cc576485eed532017e6868d', 2, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzA0MjExNywiZXhwIjoxNzQzMDQ5MzE3LCJzdWIiOjIsInVzZXIiOnsiaWQiOjIsInVzZXJuYW1lIjoieWFlbmEiLCJmdWxsX25hbWUiOiJZc2thZWxhWWFlbmFGdWppbW90byIsImVtYWlsIjoieWFlbmFfeXNrYUBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.Ah5qsLg3r8l53EoPQhPBfwu-ao9oaAZo0rQsLtaxrSA', '::1', 'axios/1.8.4', '2025-03-27 10:21:57', '2025-03-27 10:21:57', '2025-03-27 12:21:57', 1),
('46db2aac99e0e4afc28f946d6f5358388cc6cde9813b83df7c0dcc1afe74dcf7', 6, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzA0MjE4NCwiZXhwIjoxNzQzMDQ5Mzg0LCJzdWIiOjYsInVzZXIiOnsiaWQiOjYsInVzZXJuYW1lIjoicGF1bF9zaG8iLCJmdWxsX25hbWUiOiJQYXVsU2hvU2hvIiwiZW1haWwiOiJqb2hucGF1bG9yZW5jaW8zQGdtYWlsLmNvbSIsInVzZXJfdHlwZV9pZCI6NH19.MZhAGPFhXnh1XLUTjQJL4yHjKx3hKJU_M-pqIJKjubM', '::1', 'axios/1.8.4', '2025-03-27 10:23:04', '2025-03-27 10:23:04', '2025-03-27 12:23:04', 1),
('561f51388475390ba738e211c95add70d06389aeb77a8a48ddf84517b680a476', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MjM0NzU1OCwiZXhwIjoxNzQyMzU0NzU4LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.-_9BWhTNurDv_eooxUGpmWoLpLW55TcoaydgZyZ03rQ', '::1', 'axios/1.7.9', '2025-03-19 09:25:58', '2025-03-19 09:25:58', '2025-03-19 11:25:58', 1),
('57afbb784e4401affbea38a05d2c8195d0f8eee9df8f4dc1c828152948cf0a89', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzA1MDAzNywiZXhwIjoxNzQzMDU3MjM3LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.f1ZkH8ncXTlP0o9OPsmJgMawBoLT7EQyN1JY9AorpS4', '127.0.0.1', 'axios/1.8.4', '2025-03-27 12:33:57', '2025-03-27 12:33:57', '2025-03-27 14:33:57', 1),
('5b26a4db77d34c50a84ffcfd108af0d946d39c51ef7be8007499e3600294fb8a', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MjQ0MDc0NCwiZXhwIjoxNzQyNDQ3OTQ0LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.M5OkQLuZldkPpK9_vjGTTkcaOCn1LVFq0LtH3esL3_4', '::1', 'axios/1.7.9', '2025-03-20 11:19:05', '2025-03-20 11:19:05', '2025-03-20 13:19:05', 1),
('5d759c393872ee50a236627ef7a90b0db22502bcfd90730ac45863d25c79898b', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0OTYwNTA1NiwiZXhwIjoxNzQ5NjEyMjU2LCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.7spsW0Diq7EUGrxEvZDcU3rpLUf-anHQNpBnoTc-4MM', '192.168.1.2', 'axios/1.8.4', '2025-06-11 09:24:16', '2025-06-11 09:24:16', '2025-06-11 11:24:16', 1),
('60175ff714394c137d0d1e457a58895a8c60dc02f37b42338a6f20f31e36a545', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzA0NzE3MCwiZXhwIjoxNzQzMDU0MzcwLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.rm-hjglHsrG4lMr0yY8NXuFtXUQcT-e_sPkEvbgJUuw', '192.168.1.6', 'axios/1.8.4', '2025-03-27 11:46:10', '2025-03-27 11:46:10', '2025-03-27 13:46:10', 1),
('77e4608c154bbd7e1179497efb5bf5e47996d10dc0c385555c18af797ef3fd26', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzA1MDk2MSwiZXhwIjoxNzQzMDU4MTYxLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.0awOyL-MWsK1-F8OOJ_NRyNBdyK2CsctkCSY6ipUuTo', '192.168.1.6', 'axios/1.8.4', '2025-03-27 12:49:21', '2025-03-27 12:49:21', '2025-03-27 14:49:21', 1),
('8131f75e0d621448e3bdc74634586fc5a02c79c18a442a2097110a17b687c459', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0OTYwNDg0MSwiZXhwIjoxNzQ5NjEyMDQxLCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.rPQ1FoYMdODhMkmJsByGQLL2QT_rmSd2i-r9pwQxN2o', '::1', 'axios/1.8.4', '2025-06-11 09:20:41', '2025-06-11 09:20:41', '2025-06-11 11:20:41', 1),
('894078767589f8ece0f983afaf7609804fc022be28b513ee8fa919c2c42353d4', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MjM1OTc3MywiZXhwIjoxNzQyMzY2OTczLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.gE2g6lYX86s_cqLIQYA9IfDjf4UEbkIwktZJkUUE-oM', '::1', 'axios/1.7.9', '2025-03-19 12:49:33', '2025-03-19 12:49:33', '2025-03-19 14:49:33', 1),
('94f6962fb48473a5e822988a56e2eb254bc899fe336cfd16cccd2f3329e4e595', 6, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzA0MjQxMCwiZXhwIjoxNzQzMDQ5NjEwLCJzdWIiOjYsInVzZXIiOnsiaWQiOjYsInVzZXJuYW1lIjoicGF1bF9zaG8iLCJmdWxsX25hbWUiOiJQYXVsU2hvU2hvIiwiZW1haWwiOiJqb2hucGF1bG9yZW5jaW8zQGdtYWlsLmNvbSIsInVzZXJfdHlwZV9pZCI6NH19.-rz_sSK-UG4BdMy-nGBMsodNun4J4KJWFTqTjJdbBjs', '::1', 'axios/1.8.4', '2025-03-27 10:26:50', '2025-03-27 10:26:50', '2025-03-27 12:26:50', 1),
('97683ce1f63e91acf188a9efc2ccca771b12a36b98acb1ce425558371f3b4986', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MTc3NDgyNywiZXhwIjoxNzQxNzgyMDI3LCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.VExihfur9aeaR8ktQnZWD1t9afNQed0Ux6hu_mdA6hE', '::1', 'axios/1.7.9', '2025-03-12 18:20:27', '2025-03-12 18:20:27', '2025-03-12 20:20:27', 1),
('a869b40d94d74fa20d59160d283514f9f188bf7a619fda60c52fbcadb557933f', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0OTYwNDY4MywiZXhwIjoxNzQ5NjExODgzLCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.gX07ozPaRCkCOHKLsBKCa65tJnfa38UHSbSxTyVmswY', '::1', 'axios/1.8.4', '2025-06-11 09:18:03', '2025-06-11 09:18:03', '2025-06-11 11:18:03', 1),
('aa884a0630cf581aa7de49c1c4ef95ef7ca83f397d7f02ededb6ee9d80aa9db4', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzA0Mzc0NSwiZXhwIjoxNzQzMDUwOTQ1LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.yJt8MedO7s0NkvI0xz3dpXd587gc1iYfzd3dxqCMeZc', '127.0.0.1', 'axios/1.8.4', '2025-03-27 10:49:05', '2025-03-27 10:49:05', '2025-03-27 12:49:05', 1),
('b2e6305c705f107c8089183336fa8754b711829e6acd0f0b05ab92e40b67dcdf', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MTc3NDg1MywiZXhwIjoxNzQxNzgyMDUzLCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.U_8BE7ionrjIX0zlmeMR1bm35_ctXk-g76UW7qAfKGM', '::1', 'axios/1.7.9', '2025-03-12 18:20:53', '2025-03-12 18:20:53', '2025-03-12 20:20:53', 1),
('b3b24590cdcdd99b41e69050c74320128536ed6317b63d9d646c357518116345', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzA0MzAyNiwiZXhwIjoxNzQzMDUwMjI2LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.LqhH-OVpXZvmcDZoZCaTX30kwvyQ8C602CYwBdQzQMs', '192.168.1.6', 'axios/1.8.4', '2025-03-27 10:37:06', '2025-03-27 10:37:06', '2025-03-27 12:37:06', 1),
('c38da17d11e7e5ee050a22ac3b342034e87792eb89c476e0325e3a5604e339b6', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzA1MTAxMiwiZXhwIjoxNzQzMDU4MjEyLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.HZ-ZgEhL-Th0vuzOLDNTEeNTUi1cMBL5hrIeQmA8Fow', '192.168.1.6', 'axios/1.8.4', '2025-03-27 12:50:12', '2025-03-27 12:50:12', '2025-03-27 14:50:12', 1),
('c65397faf5e4cbf150d5fd737937a02f1be920a24b17999039c4456f560b99e2', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MTkxNDYxMiwiZXhwIjoxNzQxOTIxODEyLCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.lHJC6ekqdDDKgcgnqOq7YI96dVigL0f04v0k2NINLEY', '::1', 'axios/1.7.9', '2025-03-14 09:10:13', '2025-03-14 09:10:13', '2025-03-14 11:10:13', 1),
('c92ddb8d04c4a36e0660d1de43ef8af10e974c3c8f342bd146977504ae15a4c3', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0OTYwNDYzMSwiZXhwIjoxNzQ5NjExODMxLCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.N9fG7XIIi2FfH0rmzDWq6w1hRLzTAeKwWJahrNZuCpI', '::1', 'axios/1.8.4', '2025-06-11 09:17:11', '2025-06-11 09:17:11', '2025-06-11 11:17:11', 1),
('ce490974f84044a9b030cc894f756efda1bde5bf1c363e454afad5aad62107af', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MjQ0ODE0OCwiZXhwIjoxNzQyNDU1MzQ4LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.-g3gzFoKeV72U-ZvvQByCioQNozkBUFPbZ_on58Scvc', '::1', 'axios/1.7.9', '2025-03-20 13:22:28', '2025-03-20 13:22:28', '2025-03-20 15:22:28', 1),
('d19a5fc9575bb6b548956704f2f329b1e3e5d38da4cdfcfe00589b2f4fe8c7b8', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzA1MDk0NywiZXhwIjoxNzQzMDU4MTQ3LCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.jT8k0BbXc1GIxb_sM5qR5bqBPxC8zax3fj8ucqt41iI', '192.168.1.6', 'axios/1.8.4', '2025-03-27 12:49:07', '2025-03-27 12:49:07', '2025-03-27 14:49:07', 1),
('d4a2a2a273d43c76555d98ddc702ad20d8d63877788e6f06ee27bc8edad3d6a3', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MjQzMzM0MCwiZXhwIjoxNzQyNDQwNTQwLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.6h6ASCAnXXt9ki30mPVGQtMqh9RRyHxVKxtBwcEpfwI', '::1', 'axios/1.7.9', '2025-03-20 09:15:40', '2025-03-20 09:15:40', '2025-03-20 11:15:40', 1),
('d778cb2be987677ee2e5fc38b304a2ec24141fd695c99ab08d145116e27f375f', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MTc3NTkxMSwiZXhwIjoxNzQxNzgzMTExLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.gUHpJyNCq6yphCAU9me61BJ-gR2CnZy25RlvJcK5hwo', '::1', 'axios/1.7.9', '2025-03-12 18:38:31', '2025-03-12 18:38:31', '2025-03-12 20:38:31', 1),
('d97dd70a85c9db6f14e66ebf995fe3c2ac74917b0e1a0fa8dd400bc15330e6a9', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0OTYwNDMxMywiZXhwIjoxNzQ5NjExNTEzLCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.LnE1aiUVlraJmFlWAcafiwdDnLB26afnWLNzqeRa5Ig', '::1', 'axios/1.8.4', '2025-06-11 09:11:53', '2025-06-11 09:11:53', '2025-06-11 11:11:53', 1),
('d9f2a9f03633396cb70151dbdc023a51743ccea6f89a6902ca2438db4f075a59', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0OTYxNjQwMywiZXhwIjoxNzQ5NjIzNjAzLCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.xcd7_gjQFNlYhn-wuoCtXcsQfH_lARV1F37OxMRzwwk', '192.168.1.2', 'axios/1.8.4', '2025-06-11 12:33:23', '2025-06-11 12:33:23', '2025-06-11 14:33:23', 1),
('e15fa5be1753fb0bc75ccf5e2a7e62401b587444af4b518211c9b841a389be90', 4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0OTYxMjMwOCwiZXhwIjoxNzQ5NjE5NTA4LCJzdWIiOjQsInVzZXIiOnsiaWQiOjQsInVzZXJuYW1lIjoiYW5nZWx6bSIsImZ1bGxfbmFtZSI6IkppbGxpYW5TYW50b3NPcmVuY2lvIiwiZW1haWwiOiJkYW5jZXRoZW5pZ2h0YXdheS5rckBnbWFpbC5jb20iLCJ1c2VyX3R5cGVfaWQiOjR9fQ.XCUFbWPBGgsmeqwNu_-agPZnukgaJGBYE25W0F9JcMU', '192.168.1.2', 'axios/1.8.4', '2025-06-11 11:25:08', '2025-06-11 11:25:08', '2025-06-11 13:25:08', 1),
('f53b4e56715fab20fccd96d6727cd55cf05245a6de0e604e3aec85e20648fa92', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0MzA0MzUxMiwiZXhwIjoxNzQzMDUwNzEyLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.vntZ8AIdAx5BctNSmeBjJ-idxhnXi0dFIAmcG2hCqaU', '192.168.1.6', 'axios/1.8.4', '2025-03-27 10:45:12', '2025-03-27 10:45:12', '2025-03-27 12:45:12', 1),
('fa8940a33063792fbafd00bae1e16e50fa1ae455939c54cfd31a9d529e9d3e55', 1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwc2EtYWNhZGVteSIsImlhdCI6MTc0Mjc4MTQ2MywiZXhwIjoxNzQyNzg4NjYzLCJzdWIiOjEsInVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImZ1bGxfbmFtZSI6IkpvaG5NZWFEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwidXNlcl90eXBlX2lkIjozfX0.4ajPcJ26okcBCLTzvcz2RmLGNYnSuayl59mUdwLet7U', '::1', 'axios/1.7.9', '2025-03-24 09:57:43', '2025-03-24 09:57:43', '2025-03-24 11:57:43', 1);

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
  `course_id` varchar(255) DEFAULT NULL,
  `test_title` varchar(255) DEFAULT NULL,
  `test_type` enum('pre','post') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tests`
--

INSERT INTO `tests` (`test_id`, `course_id`, `test_title`, `test_type`) VALUES
(1, '2ffb59df-d35d-4663-a656-4020459d0a31', 'What you know', 'pre');

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
('41c9d886-deef-49a6-a2f5-dcafcbd7470b', '8b062884-5a9e-4030-81ec-79998bb10299', 'Topic 2', 'Topic 2', 2, '2025-02-11 08:34:27', '2025-02-11 09:46:56'),
('47ce4349-0fdf-402d-af45-68e0fbbd4fb7', '8b062884-5a9e-4030-81ec-79998bb10299', 'Topic 1', 'Topic 1', 1, '2025-02-11 09:46:52', '2025-02-11 09:46:56'),
('56329bed-5af4-40ed-abb4-f1342d21c47f', '135ab87c-98ac-49d1-9554-af2d358480c2', 'PYTHON ERD', 'PYTHON ERD', 1, '2025-06-11 12:25:41', NULL),
('5c1ff401-8e49-42d2-979b-13e146499c1b', 'e06c99a9-4814-44f9-8dab-6eee92258c7b', 'Topic 1', 'Topic 1', 1, '2025-02-14 14:06:36', NULL);

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
(12, '41c9d886-deef-49a6-a2f5-dcafcbd7470b', 4, 1, '2025-06-11 11:33:54', '2025-06-11 11:28:36', 0),
(13, '47ce4349-0fdf-402d-af45-68e0fbbd4fb7', 4, 1, '2025-06-11 11:33:48', '2025-06-11 11:28:58', 0),
(14, '03cecc19-7f1b-4d46-a45f-89397588c5ba', 4, 1, '2025-06-11 11:34:14', '2025-06-11 11:31:32', 0),
(15, '5c1ff401-8e49-42d2-979b-13e146499c1b', 4, 1, '2025-06-11 11:34:01', '2025-06-11 11:33:58', 0);

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
(5, 4, 'angelzm1', '$2y$10$mKFGu8TBBU.x5Jk4Ea3Dcesa6WaIRPlu3ePNYru64KMlOOkOF558S', 1),
(6, 4, 'paul_sho', '$2a$12$KKwgz4PKbBrSIB0ilRaFAug55HtPdlWlC/f1x4HrbigS7TwysWXvC', 1);

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
(1, 1, 'John', 'Mea', 'Doe', '25', '1995-02-20', 'Female', 'Female', 'Zone 10 Cugman, Cagayan de Oro City', 'johndoe@gmail.com', '09123456789', 'O+', 'none', NULL, NULL, 'Programmer', 0, 1, 0, 'ce4a7071-6baa-4f57-b54c-a627a21e9820.webp', '🌟 Cogito ergo sum🌟', '2025-01-31 00:00:00', '2025-03-20 11:24:16'),
(2, 2, 'Yskaela', 'Yaena', 'Fujimoto', '25', '1999-12-12', 'female', 'female', 'Japan 3rd Floor, Japan City', 'yaena_yska@gmail.com', '991', 'O+', 'none', NULL, NULL, NULL, 0, 0, 0, '829e1296-df94-4536-862d-e5ee50126b9b.png', '', '2025-01-31 00:00:00', '2025-02-25 10:08:02'),
(3, 3, 'Mariah', 'Queen', 'Arceta', '25', '1999-12-12', NULL, 'female', '', 'aiahkins@gmail.com', '09569260774', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'default.png', 'No Bio', '2025-02-02 09:31:45', NULL),
(4, 4, 'Jillian', 'Santos', 'Orencio', '22', '2002-12-20', NULL, 'female', 'Japan 3rd Floor. Etivac', 'dancethenightaway.kr@gmail.com', '+639569260774', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'c34e7078-38c1-44e1-8c9f-0645dcca1726.png', 'Experienced programmer specializing in PHP, C#, and Next.js with WinForms. Passionate about building efficient web and desktop applications, optimizing databases, and implementing secure authentication systems. Skilled in UI/UX design, Bootstrap styling, and dynamic system configurations. Currently developing an Applicants Application System with role-based access. Always eager to learn and tackle new development challenges🚀🚀🚀', '2025-02-02 10:38:00', '2025-02-11 11:00:54'),
(5, 5, 'Paul', 'Sho', 'Sho', '29', '1995-12-27', NULL, 'male', '', 'joda.orencio.coc@phinmaed.com', '09363350635', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'default.png', 'No Bio', '2025-02-02 10:43:21', NULL),
(6, 6, 'Paul', 'Sho', 'Sho', '25', '1999-12-20', NULL, 'male', '', 'johnpaulorencio3@gmail.com', '+639569260774', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24694e37-b64f-493b-aa76-46b77161f31f.jpg', 'No Bio', '2025-03-27 09:08:15', '2025-03-27 10:25:04');

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
-- Indexes for table `responses`
--
ALTER TABLE `responses`
  ADD PRIMARY KEY (`response_id`),
  ADD KEY `answer_choice_id` (`answer_choice_id`),
  ADD KEY `answer_boolean` (`answer_boolean`),
  ADD KEY `question_id` (`question_id`);

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
  ADD PRIMARY KEY (`test_id`),
  ADD KEY `course_id` (`course_id`);

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
  MODIFY `index_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `enrollment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
  MODIFY `material_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

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
-- AUTO_INCREMENT for table `responses`
--
ALTER TABLE `responses`
  MODIFY `response_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `submission_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tests`
--
ALTER TABLE `tests`
  MODIFY `test_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `topic_progress`
--
ALTER TABLE `topic_progress`
  MODIFY `topic_progress_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `true_false`
--
ALTER TABLE `true_false`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `userinfo`
--
ALTER TABLE `userinfo`
  MODIFY `userInfo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
-- Constraints for table `responses`
--
ALTER TABLE `responses`
  ADD CONSTRAINT `responses_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE;

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
-- Constraints for table `tests`
--
ALTER TABLE `tests`
  ADD CONSTRAINT `tests_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;

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
