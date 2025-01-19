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

    public function getCourses()
    {
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
                cat.category_name
            FROM courses c
            INNER JOIN categories cat ON c.category_id = cat.category_id
            WHERE c.course_id = :course_id";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':course_id', $data['course_id'], PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                $sql = "SELECT 
                    lesson_id,
                    lesson_title,
                    content,
                    resources,
                    sequence_number
                FROM lessons 
                WHERE course_id = :course_id 
                ORDER BY sequence_number";

                $stmt = $this->conn->prepare($sql);
                $stmt->bindValue(':course_id', $result['course_id'], PDO::PARAM_STR);
                $stmt->execute();
                $result['lessons'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
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

    public function generateCourseID()
    {

        $course_id = InputHelper::sanitizeString($this->uuid->toString());

        $checkCourseSql = "SELECT COUNT(*) FROM `courses` WHERE `course_id` = :course_id";
        $stmt = $this->conn->prepare($checkCourseSql);
        $stmt->bindParam(":course_id", $course_id);
        $stmt->execute();

        $courseIDExists = $stmt->fetchColumn();

        while ($courseIDExists > 0) {

            $course_id = InputHelper::sanitizeString($this->uuid->toString());

            $stmt->bindParam(":course_id", $course_id);
            $stmt->execute();
            $courseIDExists = $stmt->fetchColumn();
        }

        return json_encode([
            "status" => 201,
            "success" => true,
            "data" => [],
            "message" => $course_id
        ]);
    }

    public function createCourse($json)
    {
        try {

            $data = json_decode($json, true);

            $isDataSet = InputHelper::requiredFields($data, ['course_id', 'user_id', 'category_id', 'title', 'description', 'course_status']);
            if ($isDataSet !== true) {
                return $isDataSet;
            }

            $this->conn->beginTransaction();

            $course_id = InputHelper::sanitizeString($data['course_id']);
            $user_id = (int) InputHelper::sanitizeInt($data['user_id']);
            $category_id = (int) InputHelper::sanitizeInt($data['category_id']);
            $title = InputHelper::sanitizeString($data['title']);
            $description = InputHelper::sanitizeString($data['description']);
            $course_status = InputHelper::sanitizeString($data['course_status']);

            $sql = "
                INSERT INTO `courses`(`course_id`, `user_id`, `category_id`, `title`, `description`, `course_status`, `created_at`) 
                VALUES (:course_id, :user_id, :category_id, :title, :description, :course_status, NOW())";

            $stmt = $this->conn->prepare($sql);

            $stmt->bindParam(":course_id", $course_id);
            $stmt->bindParam(":user_id", $user_id);
            $stmt->bindParam(":category_id", $category_id);
            $stmt->bindParam(":title", $title);
            $stmt->bindParam(":description", $description);
            $stmt->bindParam(":course_status", $course_status);

            if (!$stmt->execute()) {
                $errorInfo = $stmt->errorInfo();
                http_response_code(response_code: 500);
                return json_encode([
                    "status" => 500,
                    "success" => true,
                    "data" => [],
                    "message" => "SQL error: " . $errorInfo[2]
                ]);
            }

            $this->conn->commit();
            http_response_code(201);

            return json_encode([
                "status" => 201,
                "success" => true,
                "data" => [],
                "message" => "Course created successfully."
            ]);

        } catch (PDOException $ex) {
            $this->conn->rollBack();
            http_response_code(500);
            return json_encode([
                "status" => 500,
                "success" => false,
                "data" => [],
                "message" => "Error occurred: " . $ex->getMessage()
            ]);
        }
    }

    public function updateCourse($json)
    {
        try {

            $data = is_string($json) ? json_decode($json, true) : $json;

            $isDataSet = InputHelper::requiredFields($data, ['course_id', 'user_id', 'category_id', 'title', 'description', 'course_status']);
            if ($isDataSet !== true) {
                return $isDataSet;
            }

            $course_id = InputHelper::sanitizeString($data['course_id']);

            $checkCourseSql = "SELECT COUNT(*) FROM `courses` WHERE `course_id` = :course_id";
            $stmt = $this->conn->prepare($checkCourseSql);
            $stmt->bindParam(":course_id", $course_id);
            $stmt->execute();

            $courseExists = $stmt->fetchColumn();
            if ($courseExists == 0) {
                http_response_code(404);
                return json_encode([
                    "status" => 404,
                    "success" => false,
                    "data" => [],
                    "message" => "Course not found."
                ]);
            }

            $this->conn->beginTransaction();

            $user_id = (int) InputHelper::sanitizeInt($data['user_id']);
            $category_id = (int) InputHelper::sanitizeInt($data['category_id']);
            $title = InputHelper::sanitizeString($data['title']);
            $description = InputHelper::sanitizeString($data['description']);
            $course_status = InputHelper::sanitizeString($data['course_status']);

            $sql = "
                UPDATE `courses` 
                SET `user_id` = :user_id, `category_id` = :category_id, `title` = :title, `description` = :description, 
                    `course_status` = :course_status, `updated_at` = NOW() 
                WHERE `course_id` = :course_id";

            $stmt = $this->conn->prepare($sql);

            $stmt->bindParam(":course_id", $course_id);
            $stmt->bindParam(":user_id", $user_id);
            $stmt->bindParam(":category_id", $category_id);
            $stmt->bindParam(":title", $title);
            $stmt->bindParam(":description", $description);
            $stmt->bindParam(":course_status", $course_status);

            if (!$stmt->execute()) {
                $errorInfo = $stmt->errorInfo();
                http_response_code(500);
                return json_encode([
                    "status" => 500,
                    "success" => false,
                    "data" => [],
                    "message" => "SQL error: " . $errorInfo[2]
                ]);
            }

            $this->conn->commit();
            http_response_code(200);

            return json_encode([
                "status" => 200,
                "success" => true,
                "data" => [],
                "message" => "Course updated successfully."
            ]);

        } catch (PDOException $ex) {
            $this->conn->rollBack();
            http_response_code(500);
            return json_encode([
                "status" => 500,
                "success" => false,
                "data" => [],
                "message" => "Error occurred: " . $ex->getMessage()
            ]);
        }
    }

    public function removeCourse($json)
    {

        $data = is_string($json) ? json_decode($json, true) : $json;

        $isDataSet = InputHelper::requiredFields($data, ['course_id']);
        if ($isDataSet !== true) {
            return $isDataSet;
        }

        try {
            $this->conn->beginTransaction();

            $course_id = InputHelper::sanitizeString($data['course_id']);

            $sql = "DELETE FROM `courses` WHERE `course_id` = :course_id";

            $stmt = $this->conn->prepare($sql);

            $stmt->bindParam(":course_id", $course_id);

            if (!$stmt->execute()) {
                $errorInfo = $stmt->errorInfo();
                http_response_code(500);
                return json_encode([
                    "status" => 500,
                    "success" => false,
                    "data" => [],
                    "message" => "SQL error: " . $errorInfo[2]
                ]);
            }

            $this->conn->commit();
            http_response_code(200);

            return json_encode([
                "status" => 200,
                "success" => true,
                "data" => [],
                "message" => "Course removed successfully."
            ]);

        } catch (PDOException $ex) {
            $this->conn->rollBack();
            http_response_code(500);
            return json_encode([
                "status" => 500,
                "success" => false,
                "data" => [],
                "message" => "Error occurred: " . $ex->getMessage()
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

            case "getCourses":
                if ($requestMethod === "GET") {
                    echo $course->getCourses();
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

            case "generateCourseID":
                if ($requestMethod === "GET") {
                    echo $course->generateCourseID();
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

            case "createCourse":
                if ($requestMethod === "POST") {
                    echo $course->createCourse($json);
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

            case "updateCourse":
                if ($requestMethod === "PUT") {
                    echo $course->updateCourse($json);
                } else {
                    http_response_code(405);
                    echo json_encode([
                        "status" => 405,
                        "success" => false,
                        "data" => [],
                        "message" => "Invalid request method for login. Use PUT."
                    ]);
                }
                break;

            case "removeCourse":
                if ($requestMethod === "DELETE") {
                    echo $course->removeCourse($json);
                } else {
                    http_response_code(405);
                    echo json_encode([
                        "status" => 405,
                        "success" => false,
                        "data" => [],
                        "message" => "Invalid request method for login. Use DELETE."
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
