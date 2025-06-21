-- Course Evaluations Table
-- This table stores student evaluations for courses

CREATE TABLE IF NOT EXISTS `course_evaluations` (
  `evaluation_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `course_id` varchar(255) NOT NULL,
  `evaluation_type` enum('course','hrd-ld') NOT NULL DEFAULT 'course',
  `answers` longtext NOT NULL COMMENT 'JSON string containing evaluation answers',
  `completion_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`evaluation_id`),
  UNIQUE KEY `unique_user_course_evaluation` (`user_id`, `course_id`, `evaluation_type`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_evaluation_type` (`evaluation_type`),
  KEY `idx_completion_date` (`completion_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comments for documentation
ALTER TABLE `course_evaluations` 
COMMENT = 'Stores student course evaluations including both regular course evaluations and HRD-LD evaluations';

-- Sample data structure for answers JSON field:
-- {
--   "overall_satisfaction": 5,
--   "meeting_expectations": "exceeded",
--   "recommend_training": "definitely",
--   "training_environment": 4,
--   "training_materials": 5,
--   "knowledge_gained": 4,
--   "skills_improved": 5,
--   "confidence_increased": 4,
--   "learning_objectives_met": "all_met",
--   "content_relevance": 5,
--   "practical_applicability": 4,
--   "instructor_knowledge": 5,
--   "instructor_communication": 4,
--   "instructor_engagement": 5,
--   "instructor_support": 4,
--   "instructor_organization": 5,
--   "course_structure": 4,
--   "learning_methods": 5,
--   "pace_appropriateness": "just_right",
--   "interactive_elements": 4,
--   "technology_use": 5,
--   "performance_improvement": "significantly",
--   "implementation_confidence": 4,
--   "barriers_identified": "minor_barriers",
--   "support_needed": "mentoring",
--   "strengths": "The course content was very comprehensive and well-structured.",
--   "improvements": "Could include more hands-on exercises.",
--   "additional_topics": "Advanced topics in the same field.",
--   "general_comments": "Overall excellent learning experience."
-- } 
