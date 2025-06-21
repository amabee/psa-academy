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


  public function __construct()
  {
    $this->conn = DatabaseConnection::getInstance()->getConnection();

  }

  public function addToTopicProgress($json)
  {
    $data = json_decode($json, true);

    try {

      $isSetData = InputHelper::requiredFields($data, ['topic_id', 'user_id']);

      if (!$isSetData) {
        http_response_code(422);
        return json_encode([
          "status" => 422,
          "success" => false,
          "data" => [],
          "message" => "Missing Parameters `topic_id` and `user_id`."
        ]);
      }

      // Check if topic progress already exists for this user and topic
      $checkSql = "SELECT COUNT(*) FROM `topic_progress` WHERE `user_id` = :user_id AND `topic_id` = :topic_id";
      $checkStmt = $this->conn->prepare($checkSql);
      $checkStmt->bindValue(":user_id", $data['user_id'], PDO::PARAM_STR);
      $checkStmt->bindValue(":topic_id", $data['topic_id'], PDO::PARAM_STR);
      $checkStmt->execute();

      $exists = $checkStmt->fetchColumn() > 0;

      if ($exists) {
        http_response_code(200);
        return json_encode([
          "status" => 200,
          "success" => true,
          "data" => "",
          "message" => "Topic progress already exists for this user"
        ]);
      }

      // If not exists, proceed with insertion
      $sql = "INSERT INTO `topic_progress` ( `topic_id`,  `user_id`,  `is_completed`, `completion_date`, `last_accessed`) 
    VALUES (:topic_id, :user_id, :is_completed, NOW(), NOW())";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":user_id", $data['user_id'], PDO::PARAM_STR);
      $stmt->bindParam(":topic_id", $data['topic_id']);
      $stmt->bindValue(":is_completed", 0, PDO::PARAM_INT);

      if ($stmt->execute()) {
        http_response_code(201);
        return json_encode([
          "status" => 201,
          "success" => true,
          "data" => "",
          "message" => "Topic progress added successfully"
        ]);
      } else {
        http_response_code(500);
        return json_encode([
          "status" => 500,
          "success" => false,
          "data" => "",
          "message" => "Something went wrong fullfilling the request. Please try again later"
        ]);
      }

    } catch (PDOException $ex) {
      http_response_code(response_code: 500);
      return json_encode([
        "status" => 500,
        "success" => false,
        "data" => "",
        "message" => "Something went wrong while processing the request: " . $ex->getMessage()
      ]);
    }
  }

  public function updateTopicProgress($json)
  {

    $data = json_decode($json, true);

    try {

      $isSetData = InputHelper::requiredFields($data, ['topic_id', 'user_id']);

      // if ($isSetData !== true) {
      //     return $isSetData;
      // }

      if (!$isSetData) {
        http_response_code(422);
        return json_encode([
          "status" => 422,
          "success" => false,
          "data" => [],
          "message" => "Missing Parameters `topic_id` and `user_id`."
        ]);
      }

      $sql = "UPDATE `topic_progress` SET `is_completed` = :is_completed, `completion_date` = NOW() WHERE `topic_id` = :topic_id AND `user_id` = :user_id";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":is_completed", 1, PDO::PARAM_INT);
      $stmt->bindParam(":topic_id", $data['topic_id']);
      $stmt->bindParam(":user_id", $data['user_id']);

      if ($stmt->execute()) {
        http_response_code(201);
        return json_encode([
          "status" => 201,
          "success" => true,
          "data" => "",
          "message" => "Topic complete"
        ]);
      } else {
        http_response_code(500);
        return json_encode([
          "status" => 500,
          "success" => false,
          "data" => "",
          "message" => "Something went wrong fullfilling the request. Please try again later"
        ]);
      }

    } catch (PDOException $ex) {
      http_response_code(response_code: 500);
      return json_encode([
        "status" => 500,
        "success" => false,
        "data" => "",
        "message" => "Something went wrong while processing the request: " . $ex->getMessage()
      ]);
    }
  }


}

$topics = new Topics();

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

      case "addToTopicProgress":
        if ($requestMethod === "POST") {
          echo $topics->addToTopicProgress($json);
        } else {
          http_response_code(405);
          echo json_encode([
            "status" => 405,
            "success" => false,
            "data" => [],
            "message" => "Invalid request method for addToTopicProgress. Use POST."
          ]);
        }
        break;

      case "updateTopicProgress":
        if ($requestMethod === "POST") {
          echo $topics->updateTopicProgress($json);
        } else {
          http_response_code(405);
          echo json_encode([
            "status" => 405,
            "success" => false,
            "data" => [],
            "message" => "Invalid request method for getCourses. Use POST."
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
