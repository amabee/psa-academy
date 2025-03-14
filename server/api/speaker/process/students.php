<?php

use Ramsey\Uuid\Uuid;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require('../../../configs/conn.php');
include('../../../middleware/helpers.php');


class Courses
{
    private $conn;
    private $uuid;

    public function __construct()
    {
        $this->conn = DatabaseConnection::getInstance()->getConnection();
        $this->uuid = Uuid::uuid4();
    }

    public function getMyCourses($json)
    {
        $data = json_decode($json, true);

        $isData = InputHelper::requiredFields($data, ['course_id']);

        if ($isData !== true) {
            http_response_code(500);
            return $isData;
        }

        try {
            $sql = "SELECT 
                    courses.course_id, 
                    courses.user_id,
                    courses.title, 
                    courses.description,
                    courses.course_image, 
                    courses.course_status, 
                    courses.created_at,
                    categories.category_name,
                    COUNT(enrollments.enrollment_id) AS enrollment_count
                FROM 
                    courses
                INNER JOIN 
                    categories 
                    ON courses.category_id = categories.category_id
                LEFT JOIN 
                    enrollments 
                    ON courses.course_id = enrollments.course_id
                WHERE courses.course_id = :course_id
                GROUP BY 
                    courses.course_id, 
                    courses.user_id,
                    courses.title, 
                    courses.description, 
                    courses.course_status, 
                    courses.created_at,
                    categories.category_name
                ";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":course_id", $data['course_id'], PDO::PARAM_STR);
            $stmt->execute();

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

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

    public function getCourseDetails($json)
    {
        $data = json_decode($json, true);

        try {
            $sql = "SELECT 
                c.course_id,
                c.title,
                c.description,
                c.course_status,
                c.created_at,
                c.course_image,
                cat.category_name,
                cat.category_id
            FROM courses c
            INNER JOIN categories cat ON c.category_id = cat.category_id
            WHERE c.course_id = :course_id";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':course_id', $data['course_id'], PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                // Fetch lessons
                $sql = "SELECT 
                    lesson_id,
                    lesson_title,
                    lesson_description,
                    resources,
                    sequence_number
                FROM lessons 
                WHERE course_id = :course_id 
                ORDER BY sequence_number";

                $stmt = $this->conn->prepare($sql);
                $stmt->bindValue(':course_id', $result['course_id'], PDO::PARAM_STR);
                $stmt->execute();
                $lessons = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Fetch topics for each lesson
                foreach ($lessons as &$lesson) {
                    $topicSql = "SELECT 
                        topic_id,
                        lesson_id,
                        topic_title,
                        topic_description,
                        sequence_number
                    FROM topic 
                    WHERE lesson_id = :lesson_id 
                    ORDER BY sequence_number";

                    $topicStmt = $this->conn->prepare($topicSql);
                    $topicStmt->bindValue(':lesson_id', $lesson['lesson_id'], PDO::PARAM_STR);
                    $topicStmt->execute();
                    $lesson['topics'] = $topicStmt->fetchAll(PDO::FETCH_ASSOC);
                }

                $result['lessons'] = $lessons;
            } else {
                http_response_code(404);
                return json_encode([
                    "status" => 404,
                    "success" => true,
                    "data" => [],
                    "message" => "Course not found"
                ]);
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
}

$course = new Courses();

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

            case "getMyCourses":
                if ($requestMethod === "GET") {
                    echo $course->getMyCourses($json);
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

            case "getCourseDetail":
                if ($requestMethod === "GET") {
                    echo $course->getCourseDetails($json);
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
