<?php

use Ramsey\Uuid\Uuid;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require('../../../configs/conn.php');
include('../../../middleware/helpers.php');


class Categories
{
    private $conn;
    private $uuid;
    public function __construct()
    {
        $this->conn = DatabaseConnection::getInstance()->getConnection();
        $this->uuid = Uuid::uuid4();
    }

    public function generateLessonID()
    {

        $lesson_id = InputHelper::sanitizeString($this->uuid->toString());

        $checkLessonIDSql = "SELECT COUNT(*) FROM `lessons` WHERE `lesson_id` = :lesson_id";
        $stmt = $this->conn->prepare($checkLessonIDSql);
        $stmt->bindParam(":lesson_id", $lesson_id);
        $stmt->execute();

        $lessonID_Exists = $stmt->fetchColumn();

        while ($lessonID_Exists > 0) {

            $lesson_id = InputHelper::sanitizeString($this->uuid->toString());

            $stmt->bindParam(":lesson_id", $lesson_id);
            $stmt->execute();
            $lessonID_Exists = $stmt->fetchColumn();
        }

        return json_encode([
            "status" => 201,
            "success" => true,
            "data" => [],
            "message" => $lesson_id
        ]);
    }

    public function createLesson($json)
    {
        try {
            $data = json_decode($json, true);

            $isDataSet = InputHelper::requiredFields(
                $data,
                ['lesson_id', 'title', 'description', 'resources', 'sequence_number']
            );

            if ($isDataSet !== true) {
                return json_encode([
                    "status" => 422,
                    "success" => false,
                    "data" => [],
                    "message" => "Missing Parameter. $isDataSet"
                ]);
            }

            $lesson_id = InputHelper::sanitizeString($data['lesson_id']);
            $title = InputHelper::sanitizeString($data['title']);
            $course_id = InputHelper::sanitizeString($data['course_id']);
            $description = InputHelper::sanitizeString($data['description']);
            $resources = InputHelper::sanitizeString($data['resources']);
            $sequence_number = InputHelper::sanitizeInt($data['sequence_number']);

            $sql = "INSERT INTO `lessons`(`lesson_id`, `course_id`, `lesson_title`, `lesson_description`, `resources`, `sequence_number`, `created_at`) 
                    VALUES (:lesson_id, :course_id, :title, :description, :resources, :sequence_number, NOW())";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":lesson_id", $lesson_id);
            $stmt->bindParam(":course_id", $course_id);
            $stmt->bindParam(":title", $title);
            $stmt->bindParam(":description", $description);
            $stmt->bindParam(":resources", $resources);
            $stmt->bindParam(":sequence_number", $sequence_number);

            if ($stmt->execute()) {
                return json_encode([
                    "status" => 201,
                    "success" => true,
                    "data" => [],
                    "message" => "Lesson created successfully."
                ]);
            } else {
                return json_encode([
                    "status" => 500,
                    "success" => false,
                    "data" => [],
                    "message" => "An error occurred. Please try again."
                ]);
            }

        } catch (PDOException $ex) {
            return json_encode([
                "status" => 500,
                "success" => false,
                "data" => [],
                "message" => $ex->getMessage()
            ]);
        }
    }
}

$categories = new Categories();

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

            case "generateLessonID":
                if ($requestMethod === "GET") {
                    echo $categories->generateLessonID();
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

            case "createLesson":
                if ($requestMethod === "POST") {
                    echo $categories->createLesson($json);
                } else {
                    http_response_code(405);
                    echo json_encode([
                        "status" => 405,
                        "success" => false,
                        "data" => [],
                        "message" => "Invalid request method for login. Use POST."
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
