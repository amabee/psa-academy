<?php

use Ramsey\Uuid\Uuid;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require('../../../configs/conn.php');
include('../../../middleware/helpers.php');


class Topics
{
    private $conn;
    private $uuid;
    public function __construct()
    {
        $this->conn = DatabaseConnection::getInstance()->getConnection();
        $this->uuid = Uuid::uuid4();
    }

    public function generateTopicID()
    {

        $topic_id = InputHelper::sanitizeString($this->uuid->toString());

        $checkTopicIDSql = "SELECT COUNT(*) FROM `topic` WHERE `topic_id` = :topic_id";
        $stmt = $this->conn->prepare($checkTopicIDSql);
        $stmt->bindParam(":topic_id", $topic_id);
        $stmt->execute();

        $topicID_Exists = $stmt->fetchColumn();

        while ($topicID_Exists > 0) {

            $topic_id = InputHelper::sanitizeString($this->uuid->toString());

            $stmt->bindParam(":topic_id", $topic_id);
            $stmt->execute();
            $topicID_Exists = $stmt->fetchColumn();
        }

        return json_encode([
            "status" => 201,
            "success" => true,
            "data" => [],
            "message" => $topic_id
        ]);
    }

    public function getTopicDetails($json)
    {
        try {
            $data = json_decode($json, true);

            $isSetData = InputHelper::requiredFields($data, ['topic_id']);
            if ($isSetData !== true) {
                return $isSetData;
            }

            $topic_id = InputHelper::sanitizeString($data['topic_id']);

            $sql = "SELECT topic.topic_id, 
                            topic.lesson_id, 
                            topic.topic_title, 
                            topic.topic_description, 
                            topic.sequence_number, 
                            materials.file_name
                        FROM topic 
                        LEFT JOIN materials ON topic.topic_id = materials.topic_id
                        WHERE topic.topic_id = :topic_id
                        ";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":topic_id", $topic_id, PDO::PARAM_STR);

            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!empty($result)) {
                http_response_code(200);
                return json_encode([
                    "status" => 200,
                    "success" => true,
                    "data" => $result,
                    "message" => ""
                ]);
            } else {
                http_response_code(404);
                return json_encode([
                    "status" => 404,
                    "success" => false,
                    "data" => [],
                    "message" => "Topic not found."
                ]);
            }
        } catch (PDOException $ex) {
            http_response_code(500);
            return json_encode([
                "status" => 500,
                "success" => false,
                "data" => [],
                "message" => "Something went wrong. " . $ex->getMessage()
            ]);
        }
    }

    public function createTopic($json)
    {
        try {
            $this->conn->beginTransaction();
            $data = json_decode($json, true);

            // Validate required fields
            $isDataSet = InputHelper::requiredFields($data, ['topic_id', "lesson_id", "topic_title", "topic_description", "sequence_number"]);
            if ($isDataSet !== true) {
                return $isDataSet;
            }

            // Sanitize input
            $topic_id = InputHelper::sanitizeString($data['topic_id']);
            $lesson_id = InputHelper::sanitizeString($data['lesson_id']);
            $topic_title = InputHelper::sanitizeString($data['topic_title']);
            $topic_description = InputHelper::sanitizeString($data['topic_description']);
            $sequence_number = InputHelper::sanitizeString($data['sequence_number']);

            $file_name = isset($data['file_name']) ? InputHelper::sanitizeString($data['file_name']) : null;

            // Insert into topic table
            $sql = "INSERT INTO `topic`(`topic_id`, `lesson_id`, `topic_title`, `topic_description`, `sequence_number`, `created_at`) 
                    VALUES (:topic_id, :lesson_id, :topic_title, :topic_description, :sequence_number, NOW())";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":topic_id", $topic_id, PDO::PARAM_STR);
            $stmt->bindParam(":lesson_id", $lesson_id, PDO::PARAM_STR);
            $stmt->bindParam(":topic_title", $topic_title, PDO::PARAM_STR);
            $stmt->bindParam(":topic_description", $topic_description, PDO::PARAM_STR);
            $stmt->bindParam(":sequence_number", $sequence_number, PDO::PARAM_INT);

            if (!$stmt->execute()) {
                $this->conn->rollBack();
                http_response_code(500);
                return json_encode(["status" => 500, "success" => false, "data" => [], "message" => "Failed to create topic"]);
            }

            if ($file_name) {
                $materialSql = "INSERT INTO `materials`(`topic_id`, `file_name`) VALUES (:topic_id, :file_name)";
                $materialStmt = $this->conn->prepare($materialSql);
                $materialStmt->bindParam(":topic_id", $topic_id, PDO::PARAM_STR);
                $materialStmt->bindParam(":file_name", $file_name, PDO::PARAM_STR);

                if (!$materialStmt->execute()) {
                    $this->conn->rollBack();
                    http_response_code(500);
                    return json_encode(["status" => 500, "success" => false, "data" => [], "message" => "Failed to save file information"]);
                }
            }

            $this->conn->commit();
            http_response_code(201);
            return json_encode([
                "status" => 201,
                "success" => true,
                "data" => [],
                "message" => "Lesson topic created successfully"
            ]);
        } catch (Exception $ex) {
            $this->conn->rollBack();
            http_response_code(500);
            return json_encode(["status" => 500, "success" => false, "data" => [], "message" => "Exception Error: " . $ex->getMessage()]);
        }
    }

    public function updateTopic($json)
    {
        try {
            $this->conn->beginTransaction();
            $data = json_decode($json, true);
            $isDataSet = InputHelper::requiredFields($data, ['topic_id', "topic_title", "topic_description"]);

            if ($isDataSet !== true) {
                return $isDataSet;
            }

            $topic_id = InputHelper::sanitizeString($data['topic_id']);
            $topic_title = InputHelper::sanitizeString($data['topic_title']);
            $topic_description = InputHelper::sanitizeString($data['topic_description']);
            $fileName = isset($data['fileName']) ? InputHelper::sanitizeString($data['fileName']) : null;

            if ($fileName) {
                $sql = "SELECT `file_name` FROM `materials` WHERE `topic_id` = :topic_id";
                $stmt = $this->conn->prepare($sql);
                $stmt->bindParam(":topic_id", $topic_id, PDO::PARAM_STR);
                $stmt->execute();
                $oldFile = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($oldFile) {
                    $sql = "DELETE FROM `materials` WHERE `topic_id` = :topic_id";
                    $stmt = $this->conn->prepare($sql);
                    $stmt->bindParam(":topic_id", $topic_id, PDO::PARAM_STR);
                    $stmt->execute();

                    $baseDir = realpath(__DIR__ . '/../../../MEDIA');
                    $oldFilePath = $baseDir . '/course_files/' . $oldFile['file_name'];

                    error_log("Attempting to delete file: " . $oldFilePath);
                    error_log("File exists: " . (file_exists($oldFilePath) ? 'true' : 'false'));

                    if (file_exists($oldFilePath)) {
                        try {
                            if (!unlink($oldFilePath)) {
                                error_log("Failed to delete file: " . $oldFilePath);
                            }
                        } catch (Exception $e) {
                            error_log("Exception while deleting file: " . $e->getMessage());
                        }
                    }
                }

                $sql = "INSERT INTO `materials` (`topic_id`, `file_name`) VALUES (:topic_id, :file_name)";
                $stmt = $this->conn->prepare($sql);
                $stmt->bindParam(":topic_id", $topic_id, PDO::PARAM_STR);
                $stmt->bindParam(":file_name", $fileName, PDO::PARAM_STR);
                $stmt->execute();
            }

            $sql = "UPDATE `topic` 
                SET `topic_title` = :topic_title, 
                    `topic_description` = :topic_description, 
                    `updated_at` = NOW()
                WHERE `topic_id` = :topic_id";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":topic_id", $topic_id, PDO::PARAM_STR);
            $stmt->bindParam(":topic_title", $topic_title, PDO::PARAM_STR);
            $stmt->bindParam(":topic_description", $topic_description, PDO::PARAM_STR);

            if ($stmt->execute()) {
                $this->conn->commit();
                http_response_code(200);
                return json_encode([
                    "status" => 200,
                    "success" => true,
                    "data" => [],
                    "message" => "Topic updated"
                ]);
            } else {
                $this->conn->rollBack();
                http_response_code(500);
                return json_encode([
                    "status" => 500,
                    "success" => false,
                    "data" => [],
                    "message" => "Topic update failed"
                ]);
            }
        } catch (PDOException $ex) {
            $this->conn->rollBack();
            http_response_code(500);
            return json_encode([
                "status" => 500,
                "success" => false,
                "data" => [],
                "message" => "Exception Error: " . $ex->getMessage()
            ]);
        }
    }


    public function updateTopicSequence($json)
    {
        try {
            $data = json_decode($json, true);

            if (!is_array($data) || empty($data)) {
                return json_encode([
                    "status" => 422,
                    "success" => false,
                    "data" => [],
                    "message" => "Invalid data provided."
                ]);
            }

            $this->conn->beginTransaction();

            foreach ($data as $item) {
                $isDataSet = InputHelper::requiredFields(
                    $item,
                    ['topic_id', 'sequence_number']
                );

                if ($isDataSet !== true) {
                    $this->conn->rollBack();
                    return json_encode([
                        "status" => 422,
                        "success" => false,
                        "data" => [],
                        "message" => "Missing Parameter. $isDataSet"
                    ]);
                }

                $topic_id = InputHelper::sanitizeString($item['topic_id']);
                $sequence_number = InputHelper::sanitizeInt($item['sequence_number']);

                $sql = "UPDATE `topic` 
                    SET `sequence_number` = :sequence_number,
                        `updated_at` = NOW() 
                    WHERE `topic_id` = :topic_id";

                $stmt = $this->conn->prepare($sql);
                $stmt->bindParam(":topic_id", var: $topic_id);
                $stmt->bindParam(":sequence_number", $sequence_number);

                if (!$stmt->execute()) {
                    $this->conn->rollBack();
                    return json_encode([
                        "status" => 500,
                        "success" => false,
                        "data" => [],
                        "message" => "Failed to update lesson with ID $topic_id."
                    ]);
                }
            }

            $this->conn->commit();

            return json_encode([
                "status" => 200,
                "success" => true,
                "data" => [],
                "message" => "Topic sequences updated successfully."
            ]);
        } catch (PDOException $ex) {
            $this->conn->rollBack();
            return json_encode([
                "status" => 500,
                "success" => false,
                "data" => [],
                "message" => $ex->getMessage()
            ]);
        }
    }

    public function deleteTopic($json)
    {
        try {
            $this->conn->beginTransaction();
            $data = json_decode($json, true);
            $isDataSet = InputHelper::requiredFields($data, ['topic_id']);

            if ($isDataSet !== true) {
                return $isDataSet;
            }

            $topic_id = InputHelper::sanitizeString($data['topic_id']);

            $sql = "DELETE FROM `topic` WHERE `topic_id` = :topic_id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":topic_id", $topic_id, PDO::PARAM_STR);

            if ($stmt->execute()) {
                $this->conn->commit();
                http_response_code(200);
                return json_encode([
                    "status" => 200,
                    "success" => true,
                    "data" => [],
                    "message" => "Topic deleted"
                ]);
            } else {
                $this->conn->rollBack();
                http_response_code(500);
                return json_encode([
                    "status" => 500,
                    "success" => false,
                    "data" => [],
                    "message" => "Topic deletion failed"
                ]);
            }
        } catch (PDOException $ex) {
            $this->conn->rollBack();
            http_response_code(500);
            return json_encode([
                "status" => 500,
                "success" => false,
                "data" => [],
                "message" => "Exception Error"
            ]);
        }
    }
}

$topic = new Topics();

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

            case "generateTopicID":
                if ($requestMethod === "GET") {
                    echo $topic->generateTopicID();
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

            case "getTopicDetails":
                if ($requestMethod === "GET") {
                    echo $topic->getTopicDetails($json);
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

            case "createTopic":
                if ($requestMethod === "POST") {
                    echo $topic->createTopic($json);
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

            case "updateTopic":
                if ($requestMethod === "POST") {
                    echo $topic->updateTopic($json);
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

            case "updateTopicSequence":
                if ($requestMethod === "POST") {
                    echo $topic->updateTopicSequence($json);
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

            case "deleteTopic":
                if ($requestMethod === "DELETE") {
                    echo $topic->deleteTopic($json);
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
        error_log("Parameters: $operation" . PHP_EOL . "JSON DATA: $json");
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
