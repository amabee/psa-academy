<?php

use Ramsey\Uuid\Uuid;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require('../../../configs/conn.php');
include('../../../middleware/helpers.php');


class Course
{
    private $conn;


    public function __construct()
    {
        $this->conn = DatabaseConnection::getInstance()->getConnection();

    }

    public function getCourses($json)
    {
        $data = json_decode($json, true);
        $isDataSet = InputHelper::requiredFields($data, ['user_id']);

        if ($isDataSet !== true) {
            return $isDataSet;
        }

        $user_id = InputHelper::sanitizeInt($data['user_id']);

        if (!InputHelper::validateInt($user_id)) {
            http_response_code(422);
            return json_encode([
                "status" => 422,
                "success" => false,
                "data" => "",
                "message" => "Invalid user id"
            ]);
        }

        try {
            $sql = "SELECT 
                        courses.course_id, 
                        courses.user_id AS speaker_id,
                        userinfo.first_name AS speaker_firstname,
                        userinfo.middle_name AS speaker_middlename,
                        userinfo.last_name AS speaker_lastname,
                        userinfo.profile_image as speaker_image,
                        courses.title, 
                        courses.description,
                        courses.course_image, 
                        courses.course_status, 
                        courses.created_at,
                        categories.category_name,
                        enrollments.user_id AS student_id,
                        CASE 
                            WHEN enrollments.user_id IS NOT NULL THEN 1 
                            ELSE 0 
                        END AS enrolled
                    FROM 
                        courses
                    INNER JOIN 
                        categories 
                        ON courses.category_id = categories.category_id
                    LEFT JOIN 
                        enrollments 
                        ON courses.course_id = enrollments.course_id 
                        AND enrollments.user_id = :userID
                    LEFT JOIN 
                        userinfo 
                        ON courses.user_id = userinfo.user_id";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':userID', $user_id, PDO::PARAM_INT);
            $stmt->execute();

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($result as &$course) {
                $lessonSql = "SELECT lesson_id 
                             FROM lessons 
                             WHERE course_id = :course_id 
                             ORDER BY sequence_number ASC";

                $lessonStmt = $this->conn->prepare($lessonSql);
                $lessonStmt->bindParam(':course_id', $course['course_id'], PDO::PARAM_INT);
                $lessonStmt->execute();
                $lessons = $lessonStmt->fetchAll(PDO::FETCH_ASSOC);

                // Get topics for each lesson
                $course['lessons'] = [];
                foreach ($lessons as $lesson) {
                    $topicSql = "SELECT topic_id 
                                FROM topic 
                                WHERE lesson_id = :lesson_id 
                                ORDER BY sequence_number ASC";

                    $topicStmt = $this->conn->prepare($topicSql);
                    $topicStmt->bindParam(':lesson_id', $lesson['lesson_id'], PDO::PARAM_INT);
                    $topicStmt->execute();

                    $course['lessons'][] = [
                        'lesson_id' => $lesson['lesson_id'],
                        'topics' => $topicStmt->fetchAll(PDO::FETCH_COLUMN)
                    ];
                }
            }

            http_response_code(200);

            return json_encode([
                "status" => 200,
                "success" => true,
                "data" => $result,
                "message" => ""
            ]);
        } catch (PDOException $ex) {
            http_response_code(500);

            return json_encode([
                "status" => 500,
                "success" => false,
                "data" => [],
                "message" => $ex->getMessage()
            ]);
        }
    }

    public function getUserCourseDetails($json)
    {
        $data = json_decode($json, true);
        $isDataSet = InputHelper::requiredFields($data, ['user_id', 'course_id']);

        if ($isDataSet !== true) {
            return $isDataSet;
        }

        $user_id = InputHelper::sanitizeInt($data['user_id']);
        $course_id = InputHelper::sanitizeInt($data['course_id']);

        if (!InputHelper::validateInt($user_id) || !InputHelper::validateInt($course_id)) {
            http_response_code(422);
            return json_encode([
                "status" => 422,
                "success" => false,
                "data" => "",
                "message" => "Invalid user id or course id"
            ]);
        }

        try {
            // Get course and teacher details
            $sql = "SELECT 
                        c.course_id,
                        c.title,
                        c.description,
                        c.course_image,
                        c.course_status,
                        c.created_at,
                        cat.category_name,
                        u.user_id AS teacher_id,
                        u.first_name AS teacher_firstname,
                        u.middle_name AS teacher_middlename,
                        u.last_name AS teacher_lastname,
                        u.profile_image AS teacher_image,
                        CASE 
                            WHEN e.user_id IS NOT NULL THEN 1 
                            ELSE 0 
                        END AS enrolled
                    FROM 
                        courses c
                    INNER JOIN 
                        categories cat ON c.category_id = cat.category_id
                    INNER JOIN 
                        userinfo u ON c.user_id = u.user_id
                    LEFT JOIN 
                        enrollments e ON c.course_id = e.course_id AND e.user_id = :user_id
                    WHERE 
                        c.course_id = :course_id";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->bindParam(':course_id', $course_id, PDO::PARAM_INT);
            $stmt->execute();

            $courseDetails = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$courseDetails) {
                http_response_code(404);
                return json_encode([
                    "status" => 404,
                    "success" => false,
                    "data" => "",
                    "message" => "Course not found"
                ]);
            }

            // Get lessons with progress
            $lessonSql = "SELECT 
                            l.lesson_id,
                            l.title AS lesson_title,
                            l.description AS lesson_description,
                            l.sequence_number,
                            COALESCE(lp.is_completed, 0) AS is_completed,
                            lp.completion_date,
                            lp.last_accessed
                        FROM 
                            lessons l
                        LEFT JOIN 
                            lesson_progress lp ON l.lesson_id = lp.lesson_id AND lp.user_id = :user_id
                        WHERE 
                            l.course_id = :course_id
                        ORDER BY 
                            l.sequence_number ASC";

            $lessonStmt = $this->conn->prepare($lessonSql);
            $lessonStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $lessonStmt->bindParam(':course_id', $course_id, PDO::PARAM_INT);
            $lessonStmt->execute();
            $lessons = $lessonStmt->fetchAll(PDO::FETCH_ASSOC);

            // Get topics with progress for each lesson
            foreach ($lessons as &$lesson) {
                $topicSql = "SELECT 
                                t.topic_id,
                                t.title AS topic_title,
                                t.description AS topic_description,
                                t.sequence_number,
                                COALESCE(tp.is_completed, 0) AS is_completed,
                                tp.completion_date,
                                tp.last_accessed
                            FROM 
                                topic t
                            LEFT JOIN 
                                topic_progress tp ON t.topic_id = tp.topic_id AND tp.user_id = :user_id
                            WHERE 
                                t.lesson_id = :lesson_id
                            ORDER BY 
                                t.sequence_number ASC";

                $topicStmt = $this->conn->prepare($topicSql);
                $topicStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
                $topicStmt->bindParam(':lesson_id', $lesson['lesson_id'], PDO::PARAM_INT);
                $topicStmt->execute();
                $lesson['topics'] = $topicStmt->fetchAll(PDO::FETCH_ASSOC);
            }

            $courseDetails['lessons'] = $lessons;

            // Calculate progress statistics
            $totalLessons = count($lessons);
            $completedLessons = array_reduce($lessons, function ($carry, $lesson) {
                return $carry + ($lesson['is_completed'] ? 1 : 0);
            }, 0);

            $totalTopics = array_reduce($lessons, function ($carry, $lesson) {
                return $carry + count($lesson['topics']);
            }, 0);

            $completedTopics = array_reduce($lessons, function ($carry, $lesson) {
                return $carry + array_reduce($lesson['topics'], function ($c, $topic) {
                    return $c + ($topic['is_completed'] ? 1 : 0);
                }, 0);
            }, 0);

            $courseDetails['progress'] = [
                'total_lessons' => $totalLessons,
                'completed_lessons' => $completedLessons,
                'total_topics' => $totalTopics,
                'completed_topics' => $completedTopics,
                'lesson_progress' => $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100, 2) : 0,
                'topic_progress' => $totalTopics > 0 ? round(($completedTopics / $totalTopics) * 100, 2) : 0
            ];

            http_response_code(200);
            return json_encode([
                "status" => 200,
                "success" => true,
                "data" => $courseDetails,
                "message" => ""
            ]);

        } catch (PDOException $ex) {
            http_response_code(500);
            return json_encode([
                "status" => 500,
                "success" => false,
                "data" => [],
                "message" => $ex->getMessage()
            ]);
        }
    }


}

$course = new Course();

$validApiKey = $_ENV['API_KEY'] ?? null;

$requestMethod = $_SERVER["REQUEST_METHOD"];

$headers = array_change_key_case(getallheaders(), CASE_LOWER);

if (isset($headers['authorization']) && $headers['authorization'] === $validApiKey) {

    $operation = null;
    $json = null;

    switch ($requestMethod) {
        case 'GET':
            $operation = isset($_GET["operation"]) ? $_GET["operation"] : null;
            $json = isset($_GET["json"]) ? $_GET["json"] : null;
            break;

        case 'POST':
            $operation = isset($_POST["operation"]) ? $_POST["operation"] : null;
            $json = isset($_POST["json"]) ? $_POST["json"] : null;
            break;

        case 'PUT':
            $input = file_get_contents("php://input");
            $data = json_decode($input, true);

            $operation = isset($data["operation"]) ? $data["operation"] : null;
            $json = isset($data["json"]) ? $data["json"] : null;

            break;

        case 'DELETE':
            $input = file_get_contents("php://input");
            $data = json_decode($input, true);
            $operation = isset($data["operation"]) ? $data["operation"] : null;
            $json = isset($data["json"]) ? $data["json"] : null;
            break;

        default:
            http_response_code(405);
            echo json_encode([
                "success" => false,
                "data" => [],
                "message" => "Invalid Request Method."
            ]);
            exit();
    }

    if (isset($operation) && isset($json)) {
        switch ($operation) {

            case "getCourses":
                if ($requestMethod === "GET") {
                    echo $course->getCourses($json);
                } else {
                    http_response_code(405);
                    echo json_encode([
                        "status" => 405,
                        "success" => false,
                        "data" => [],
                        "message" => "Invalid request method for login. Use GET."
                    ]);
                }
                break;

            default:
                http_response_code(400);
                echo json_encode([
                    "status" => 400,
                    "success" => false,
                    "data" => [],
                    "message" => "Invalid operation."
                ]);
                break;
        }
    } else {
        http_response_code(422);
        echo json_encode([
            "status" => 422,
            "success" => false,
            "data" => [],
            "message" => "Missing Parameters."
        ]);
    }
} else {
    http_response_code(401);
    error_log("Headers: " . json_encode(getallheaders()));
    echo json_encode([
        "status" => 401,
        "success" => false,
        "data" => [],
        "message" => "Invalid API Key."
    ]);
}
