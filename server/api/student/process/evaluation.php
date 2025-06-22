<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require('../../../configs/conn.php');
include('../../../middleware/helpers.php');

class Evaluation
{
  private $conn;

  public function __construct()
  {
    $this->conn = DatabaseConnection::getInstance()->getConnection();
  }

  public function submitEvaluation($json)
  {
    try {
      $data = json_decode($json, true);

      $isDataSet = InputHelper::requiredFields($data, [
        'course_id',
        'evaluation_type',
        'answers'
      ]);

      if ($isDataSet !== true) {
        http_response_code(422);
        return json_encode([
          "status" => 422,
          "success" => false,
          "data" => [],
          "message" => $isDataSet
        ]);
      }

      $course_id = $data['course_id'];
      $evaluation_type = $data['evaluation_type']; // 'course' or 'hrd-ld'
      $answers = $data['answers'];
      $user_id = $data['user_id'];
      $completion_date = date('Y-m-d H:i:s');

      if (empty($answers)) {
        http_response_code(422);
        return json_encode([
          "status" => 422,
          "success" => false,
          "data" => [],
          "message" => "Answers cannot be empty"
        ]);
      }

      $this->conn->beginTransaction();

      // Check if evaluation already exists
      $check_stmt = $this->conn->prepare("
                SELECT evaluation_id FROM course_evaluations 
                WHERE user_id = :user_id AND course_id = :course_id AND evaluation_type = :evaluation_type
            ");
      $check_stmt->bindParam(':user_id', $user_id);
      $check_stmt->bindParam(':course_id', $course_id);
      $check_stmt->bindParam(':evaluation_type', $evaluation_type);
      $check_stmt->execute();

      if ($check_stmt->rowCount() > 0) {
        // Update existing evaluation
        $row = $check_stmt->fetch(PDO::FETCH_ASSOC);
        $evaluation_id = $row['evaluation_id'];

        $update_stmt = $this->conn->prepare("
                    UPDATE course_evaluations 
                    SET answers = :answers, completion_date = :completion_date, updated_at = NOW()
                    WHERE evaluation_id = :evaluation_id
                ");
        $answers_json = json_encode($answers);
        $update_stmt->bindParam(':answers', $answers_json);
        $update_stmt->bindParam(':completion_date', $completion_date);
        $update_stmt->bindParam(':evaluation_id', $evaluation_id);

        if ($update_stmt->execute()) {
          $this->conn->commit();
          http_response_code(200);
          return json_encode([
            "status" => 200,
            "success" => true,
            "data" => ['evaluation_id' => $evaluation_id],
            "message" => "Evaluation updated successfully"
          ]);
        } else {
          $this->conn->rollBack();
          http_response_code(500);
          return json_encode([
            "status" => 500,
            "success" => false,
            "data" => [],
            "message" => "Failed to update evaluation"
          ]);
        }
      } else {
        // Insert new evaluation
        $insert_stmt = $this->conn->prepare("
                    INSERT INTO course_evaluations 
                    (user_id, course_id, evaluation_type, answers, completion_date, created_at, updated_at)
                    VALUES (:user_id, :course_id, :evaluation_type, :answers, :completion_date, NOW(), NOW())
                ");
        $answers_json = json_encode($answers);
        $insert_stmt->bindParam(':user_id', $user_id);
        $insert_stmt->bindParam(':course_id', $course_id);
        $insert_stmt->bindParam(':evaluation_type', $evaluation_type);
        $insert_stmt->bindParam(':answers', $answers_json);
        $insert_stmt->bindParam(':completion_date', $completion_date);

        if ($insert_stmt->execute()) {
          $evaluation_id = $this->conn->lastInsertId();
          $this->conn->commit();
          http_response_code(201);
          return json_encode([
            "status" => 201,
            "success" => true,
            "data" => ['evaluation_id' => $evaluation_id],
            "message" => "Evaluation submitted successfully"
          ]);
        } else {
          $this->conn->rollBack();
          http_response_code(500);
          return json_encode([
            "status" => 500,
            "success" => false,
            "data" => [],
            "message" => "Failed to submit evaluation"
          ]);
        }
      }

    } catch (PDOException $ex) {
      $this->conn->rollBack();
      http_response_code(500);
      return json_encode([
        "status" => 500,
        "success" => false,
        "data" => [],
        "message" => "Database error: " . $ex->getMessage()
      ]);
    }
  }

  public function getEvaluationStatus($json)
  {
    try {
      $data = json_decode($json, true);

      if (!isset($data['course_id']) || !isset($data['user_id'])) {
        http_response_code(422);
        return json_encode([
          "status" => 422,
          "success" => false,
          "data" => [],
          "message" => "Missing course_id or user_id"
        ]);
      }

      $course_id = $data['course_id'];
      $user_id = $data['user_id'];

      $stmt = $this->conn->prepare("
                SELECT evaluation_id, evaluation_type, completion_date, created_at
                FROM course_evaluations 
                WHERE user_id = :user_id AND course_id = :course_id
                ORDER BY created_at DESC
            ");
      $stmt->bindParam(':user_id', $user_id);
      $stmt->bindParam(':course_id', $course_id);
      $stmt->execute();

      $evaluations = [];
      while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $evaluations[] = [
          'evaluation_id' => $row['evaluation_id'],
          'evaluation_type' => $row['evaluation_type'],
          'completion_date' => $row['completion_date'],
          'created_at' => $row['created_at']
        ];
      }

      http_response_code(200);
      return json_encode([
        "status" => 200,
        "success" => true,
        "data" => $evaluations,
        "message" => "Evaluation status retrieved successfully"
      ]);

    } catch (PDOException $ex) {
      http_response_code(500);
      return json_encode([
        "status" => 500,
        "success" => false,
        "data" => [],
        "message" => "Database error: " . $ex->getMessage()
      ]);
    }
  }
}

$evaluation = new Evaluation();

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

      case "submitEvaluation":
        if ($requestMethod === "POST") {
          echo $evaluation->submitEvaluation($json);
        } else {
          http_response_code(405);
          echo json_encode([
            "status" => 405,
            "success" => false,
            "data" => [],
            "message" => "Invalid request method for submitEvaluation. Use POST."
          ]);
        }
        break;

      case "getEvaluationStatus":
        if ($requestMethod === "GET") {
          echo $evaluation->getEvaluationStatus($json);
        } else {
          http_response_code(405);
          echo json_encode([
            "status" => 405,
            "success" => false,
            "data" => [],
            "message" => "Invalid request method for getEvaluationStatus. Use GET."
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
?>

