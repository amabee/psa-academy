<?php

use Ramsey\Uuid\Uuid;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require('../../../configs/conn.php');
include('../../../middleware/helpers.php');

class ResourcePersonCourses
{
    private $conn;
    private $uuid;

    public function __construct()
    {
        $this->conn = DatabaseConnection::getInstance()->getConnection();
        $this->uuid = Uuid::uuid4();
    }

    public function getAllCourses($json)
    {
        try {
            $sql = "SELECT 
                        c.course_id,
                        c.title,
                        c.description,
                        c.course_image,
                        c.course_status,
                        c.created_at,
                        cat.category_name,
                        u.user_id AS teacher_id,
                        CONCAT(u.first_name, ' ', COALESCE(u.middle_name, ''), ' ', u.last_name) AS teacher_name,
                        u.profile_image AS teacher_image,
                        u.user_about AS teacher_about,
                        u.position as teacher_position,
                        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.course_id) as student_count
                    FROM 
                        courses c
                    INNER JOIN 
                        categories cat ON c.category_id = cat.category_id
                    INNER JOIN 
                        userinfo u ON c.user_id = u.user_id
                    ORDER BY 
                        c.created_at DESC";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            return json_encode([
                "status" => 200,
                "success" => true,
                "data" => $courses,
                "message" => "Courses retrieved successfully"
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

    public function getCourseDetails($json)
    {
        $data = json_decode($json, true);
        $isDataSet = InputHelper::requiredFields($data, ['user_id', 'course_id']);

        if ($isDataSet !== true) {
            return $isDataSet;
        }

        $user_id = InputHelper::sanitizeInt($data['user_id']);
        $course_id = InputHelper::sanitizeString($data['course_id']);

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
            // Get course basic information
            $courseSql = "SELECT 
                            c.course_id,
                            c.title,
                            c.description,
                            c.course_image,
                            c.course_status,
                            c.created_at,
                            cat.category_name,
                            u.user_id AS teacher_id,
                            CONCAT(u.first_name, ' ', COALESCE(u.middle_name, ''), ' ', u.last_name) AS teacher_name,
                            u.profile_image AS teacher_image,
                            u.user_about AS teacher_about,
                            u.position as teacher_position
                        FROM 
                            courses c
                        INNER JOIN 
                            categories cat ON c.category_id = cat.category_id
                        INNER JOIN 
                            userinfo u ON c.user_id = u.user_id
                        WHERE 
                            c.course_id = :course_id";

            $stmt = $this->conn->prepare($courseSql);
            $stmt->bindParam(':course_id', $course_id);
            $stmt->execute();
            $course = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$course) {
                http_response_code(404);
                return json_encode([
                    "status" => 404,
                    "success" => false,
                    "data" => "",
                    "message" => "Course not found"
                ]);
            }

            // Get lessons and topics
            $lessonsSql = "SELECT 
                            l.lesson_id,
                            l.title,
                            l.description,
                            l.lesson_order
                        FROM 
                            lessons l
                        WHERE 
                            l.course_id = :course_id
                        ORDER BY 
                            l.lesson_order";

            $stmt = $this->conn->prepare($lessonsSql);
            $stmt->bindParam(':course_id', $course_id);
            $stmt->execute();
            $lessons = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get topics for each lesson
            foreach ($lessons as &$lesson) {
                $topicsSql = "SELECT 
                                t.topic_id,
                                t.title,
                                t.description,
                                t.duration,
                                t.topic_order
                            FROM 
                                topic t
                            WHERE 
                                t.lesson_id = :lesson_id
                            ORDER BY 
                                t.topic_order";

                $stmt = $this->conn->prepare($topicsSql);
                $stmt->bindParam(':lesson_id', $lesson['lesson_id']);
                $stmt->execute();
                $lesson['topics'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }

            // Get enrolled students with progress
            $studentsSql = "SELECT 
                            u.user_id,
                            CONCAT(u.first_name, ' ', COALESCE(u.middle_name, ''), ' ', u.last_name) AS student_name,
                            u.email,
                            u.profile_image,
                            e.enrollment_date,
                            e.status as enrollment_status,
                            (SELECT COUNT(*) FROM topic_progress tp 
                             INNER JOIN topic t ON tp.topic_id = t.topic_id 
                             INNER JOIN lessons l ON t.lesson_id = l.lesson_id 
                             WHERE l.course_id = :course_id AND tp.user_id = u.user_id AND tp.is_completed = 1) as completed_topics,
                            (SELECT COUNT(*) FROM topic t 
                             INNER JOIN lessons l ON t.lesson_id = l.lesson_id 
                             WHERE l.course_id = :course_id) as total_topics,
                            (SELECT MAX(tp.last_accessed) FROM topic_progress tp 
                             INNER JOIN topic t ON tp.topic_id = t.topic_id 
                             INNER JOIN lessons l ON t.lesson_id = l.lesson_id 
                             WHERE l.course_id = :course_id AND tp.user_id = u.user_id) as last_activity
                        FROM 
                            enrollments e
                        INNER JOIN 
                            userinfo u ON e.user_id = u.user_id
                        WHERE 
                            e.course_id = :course_id2
                        ORDER BY 
                            e.enrollment_date DESC";

            $stmt = $this->conn->prepare($studentsSql);
            $stmt->bindParam(':course_id', $course_id);
            $stmt->bindParam(':course_id2', $course_id);
            $stmt->execute();
            $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Calculate progress percentage for each student
            foreach ($students as &$student) {
                $student['progress_percentage'] = $student['total_topics'] > 0 
                    ? round(($student['completed_topics'] / $student['total_topics']) * 100, 2) 
                    : 0;
                $student['is_active'] = $student['enrollment_status'] === 'active';
            }

            // Get tests
            $testsSql = "SELECT 
                            t.test_id,
                            t.title,
                            t.description,
                            t.duration,
                            t.passing_score,
                            t.test_type,
                            (SELECT COUNT(*) FROM questions q WHERE q.test_id = t.test_id) as question_count
                        FROM 
                            tests t
                        WHERE 
                            t.course_id = :course_id
                        ORDER BY 
                            t.created_at DESC";

            $stmt = $this->conn->prepare($testsSql);
            $stmt->bindParam(':course_id', $course_id);
            $stmt->execute();
            $tests = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get evaluations
            $evaluationsSql = "SELECT 
                                e.eval_id,
                                e.title,
                                e.description,
                                e.evaluation_type,
                                e.status,
                                e.created_at,
                                (SELECT COUNT(*) FROM evaluation_responses er WHERE er.eval_id = e.eval_id) as response_count
                            FROM 
                                evaluation e
                            WHERE 
                                e.course_id = :course_id
                            ORDER BY 
                                e.created_at DESC";

            $stmt = $this->conn->prepare($evaluationsSql);
            $stmt->bindParam(':course_id', $course_id);
            $stmt->execute();
            $evaluations = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $courseData = [
                'course' => $course,
                'lessons' => $lessons,
                'students' => $students,
                'tests' => $tests,
                'evaluations' => $evaluations
            ];

            http_response_code(200);
            return json_encode([
                "status" => 200,
                "success" => true,
                "data" => $courseData,
                "message" => "Course details retrieved successfully"
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

$resourcePerson = new ResourcePersonCourses();

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

            case "getAllCourses":
                if ($requestMethod === "GET") {
                    echo $resourcePerson->getAllCourses(null);
                } else {
                    http_response_code(405);
                    echo json_encode([
                        "status" => 405,
                        "success" => false,
                        "data" => [],
                        "message" => "Invalid request method for getAllCourses. Use GET."
                    ]);
                }
                break;

            case "getCourseDetails":
                if ($requestMethod === "POST") {
                    echo $resourcePerson->getCourseDetails($json);
                } else {
                    http_response_code(405);
                    echo json_encode([
                        "status" => 405,
                        "success" => false,
                        "data" => [],
                        "message" => "Invalid request method for getCourseDetails. Use POST."
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
