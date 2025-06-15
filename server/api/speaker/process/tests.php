<?php

use Ramsey\Uuid\Uuid;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require('../../../configs/conn.php');
include('../../../middleware/helpers.php');

class Tests
{
  private $conn;
  private $uuid;

  public function __construct()
  {
    $this->conn = DatabaseConnection::getInstance()->getConnection();
    $this->uuid = Uuid::uuid4();
  }

  public function createTest($json)
  {
    try {
      $this->conn->beginTransaction();
      $data = json_decode($json, true);

      // Validate required fields
      $isDataSet = InputHelper::requiredFields($data, [
        'course_id',
        'test_title',
        'test_type',
        'questions'
      ]);

      if ($isDataSet !== true) {
        return json_encode([
          "status" => 422,
          "success" => false,
          "data" => [],
          "message" => "Missing required fields: $isDataSet"
        ]);
      }

      // Validate test type
      if (!in_array($data['test_type'], ['pre', 'post'])) {
        return json_encode([
          "status" => 422,
          "success" => false,
          "data" => [],
          "message" => "Invalid test type. Must be 'pre' or 'post'"
        ]);
      }

      // Check if a test of the same type already exists for the course
      $checkSql = "SELECT COUNT(*) FROM tests WHERE course_id = :course_id AND test_type = :test_type";
      $checkStmt = $this->conn->prepare($checkSql);
      $checkStmt->bindParam(':course_id', $data['course_id']);
      $checkStmt->bindParam(':test_type', $data['test_type']);
      $checkStmt->execute();
      $existingCount = $checkStmt->fetchColumn();

      if ($existingCount > 0) {
        $this->conn->rollBack();
        return json_encode([
          "status" => 409,
          "success" => false,
          "data" => [],
          "message" => ucfirst($data['test_type']) . " test already exists for this course"
        ]);
      }

      // Insert test
      $sql = "INSERT INTO tests (course_id, test_title, test_type) VALUES (:course_id, :test_title, :test_type)";
      $stmt = $this->conn->prepare($sql);
      $stmt->bindParam(':course_id', $data['course_id']);
      $stmt->bindParam(':test_title', $data['test_title']);
      $stmt->bindParam(':test_type', $data['test_type']);

      if (!$stmt->execute()) {
        $this->conn->rollBack();
        return json_encode([
          "status" => 500,
          "success" => false,
          "data" => [],
          "message" => "Failed to create test"
        ]);
      }

      $test_id = $this->conn->lastInsertId();

      // Insert questions
      foreach ($data['questions'] as $question) {
        $questionSql = "INSERT INTO questions (test_id, question_text, question_type, points) 
                              VALUES (:test_id, :question_text, :question_type, :points)";
        $questionStmt = $this->conn->prepare($questionSql);
        $questionStmt->bindParam(':test_id', $test_id);
        $questionStmt->bindParam(':question_text', $question['question_text']);
        $questionStmt->bindParam(':question_type', $question['question_type']);
        $questionStmt->bindParam(':points', $question['points']);

        if (!$questionStmt->execute()) {
          $this->conn->rollBack();
          return json_encode([
            "status" => 500,
            "success" => false,
            "data" => [],
            "message" => "Failed to create question"
          ]);
        }

        $question_id = $this->conn->lastInsertId();

        // Insert choices if multiple choice
        if ($question['question_type'] === 'multiple_choice' && isset($question['choices'])) {
          foreach ($question['choices'] as $choice) {
            $choiceSql = "INSERT INTO choices (question_id, choice_text, is_correct) 
                                    VALUES (:question_id, :choice_text, :is_correct)";
            $choiceStmt = $this->conn->prepare($choiceSql);
            $choiceStmt->bindParam(':question_id', $question_id);
            $choiceStmt->bindParam(':choice_text', $choice['choice_text']);
            $choiceStmt->bindParam(':is_correct', $choice['is_correct']);

            if (!$choiceStmt->execute()) {
              $this->conn->rollBack();
              return json_encode([
                "status" => 500,
                "success" => false,
                "data" => [],
                "message" => "Failed to create choice"
              ]);
            }
          }
        }
      }

      $this->conn->commit();
      return json_encode([
        "status" => 200,
        "success" => true,
        "data" => [
          "test_id" => $test_id
        ],
        "message" => "Test created successfully"
      ]);

    } catch (Exception $ex) {
      $this->conn->rollBack();
      return json_encode([
        "status" => 500,
        "success" => false,
        "data" => [],
        "message" => "Error: " . $ex->getMessage()
      ]);
    }
  }

  public function getTest($json)
  {
    try {
      $data = json_decode($json, true);

      if (!isset($data['test_id'])) {
        return json_encode([
          "status" => 422,
          "success" => false,
          "data" => [],
          "message" => "Test ID is required"
        ]);
      }

      // Get test details
      $sql = "SELECT t.*, c.course_id 
                   FROM tests t 
                   JOIN courses c ON t.course_id = c.course_id 
                   WHERE t.test_id = :test_id";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindParam(':test_id', $data['test_id']);
      $stmt->execute();
      $test = $stmt->fetch(PDO::FETCH_ASSOC);

      if (!$test) {
        return json_encode([
          "status" => 404,
          "success" => false,
          "data" => [],
          "message" => "Test not found"
        ]);
      }

      // Get questions
      $questionsSql = "SELECT * FROM questions WHERE test_id = :test_id";
      $questionsStmt = $this->conn->prepare($questionsSql);
      $questionsStmt->bindParam(':test_id', $data['test_id']);
      $questionsStmt->execute();
      $questions = $questionsStmt->fetchAll(PDO::FETCH_ASSOC);

      // Get choices for multiple choice questions
      foreach ($questions as &$question) {
        if ($question['question_type'] === 'multiple_choice') {
          $choicesSql = "SELECT * FROM choices WHERE question_id = :question_id";
          $choicesStmt = $this->conn->prepare($choicesSql);
          $choicesStmt->bindParam(':question_id', $question['question_id']);
          $choicesStmt->execute();
          $question['choices'] = $choicesStmt->fetchAll(PDO::FETCH_ASSOC);
        }
      }

      $test['questions'] = $questions;

      return json_encode([
        "status" => 200,
        "success" => true,
        "data" => $test,
        "message" => ""
      ]);

    } catch (Exception $ex) {
      return json_encode([
        "status" => 500,
        "success" => false,
        "data" => [],
        "message" => "Error: " . $ex->getMessage()
      ]);
    }
  }

  public function getLessonTests($json)
  {
    try {
      $data = json_decode($json, true);

      if (!isset($data['lesson_id'])) {
        return json_encode([
          "status" => 422,
          "success" => false,
          "data" => [],
          "message" => "Lesson ID is required"
        ]);
      }

      $sql = "SELECT * FROM tests WHERE lesson_id = :lesson_id";
      $stmt = $this->conn->prepare($sql);
      $stmt->bindParam(':lesson_id', $data['lesson_id']);
      $stmt->execute();
      $tests = $stmt->fetchAll(PDO::FETCH_ASSOC);

      return json_encode([
        "status" => 200,
        "success" => true,
        "data" => $tests,
        "message" => ""
      ]);

    } catch (Exception $ex) {
      return json_encode([
        "status" => 500,
        "success" => false,
        "data" => [],
        "message" => "Error: " . $ex->getMessage()
      ]);
    }
  }

  public function updateTest($json)
  {
    try {
      $this->conn->beginTransaction();
      $data = json_decode($json, true);

      // Validate required fields
      $isDataSet = InputHelper::requiredFields($data, [
        'test_id',
        'test_title',
        'test_type',
        'questions'
      ]);

      if ($isDataSet !== true) {
        return json_encode([
          "status" => 422,
          "success" => false,
          "data" => [],
          "message" => "Missing required fields: $isDataSet"
        ]);
      }

      // Validate test type
      if (!in_array($data['test_type'], ['pre', 'post'])) {
        return json_encode([
          "status" => 422,
          "success" => false,
          "data" => [],
          "message" => "Invalid test type. Must be 'pre' or 'post'"
        ]);
      }

      // Update test
      $sql = "UPDATE tests SET test_title = :test_title, test_type = :test_type WHERE test_id = :test_id";
      $stmt = $this->conn->prepare($sql);
      $stmt->bindParam(':test_id', $data['test_id']);
      $stmt->bindParam(':test_title', $data['test_title']);
      $stmt->bindParam(':test_type', $data['test_type']);

      if (!$stmt->execute()) {
        $this->conn->rollBack();
        return json_encode([
          "status" => 500,
          "success" => false,
          "data" => [],
          "message" => "Failed to update test"
        ]);
      }

      // Delete existing questions and choices
      $deleteChoicesSql = "DELETE c FROM choices c 
                               INNER JOIN questions q ON c.question_id = q.question_id 
                               WHERE q.test_id = :test_id";
      $deleteChoicesStmt = $this->conn->prepare($deleteChoicesSql);
      $deleteChoicesStmt->bindParam(':test_id', $data['test_id']);
      $deleteChoicesStmt->execute();

      $deleteQuestionsSql = "DELETE FROM questions WHERE test_id = :test_id";
      $deleteQuestionsStmt = $this->conn->prepare($deleteQuestionsSql);
      $deleteQuestionsStmt->bindParam(':test_id', $data['test_id']);
      $deleteQuestionsStmt->execute();

      // Insert new questions
      foreach ($data['questions'] as $question) {
        $questionSql = "INSERT INTO questions (test_id, question_text, question_type, points) 
                              VALUES (:test_id, :question_text, :question_type, :points)";
        $questionStmt = $this->conn->prepare($questionSql);
        $questionStmt->bindParam(':test_id', $data['test_id']);
        $questionStmt->bindParam(':question_text', $question['question_text']);
        $questionStmt->bindParam(':question_type', $question['question_type']);
        $questionStmt->bindParam(':points', $question['points']);

        if (!$questionStmt->execute()) {
          $this->conn->rollBack();
          return json_encode([
            "status" => 500,
            "success" => false,
            "data" => [],
            "message" => "Failed to update question"
          ]);
        }

        $question_id = $this->conn->lastInsertId();

        // If it's a multiple choice question, insert choices
        if ($question['question_type'] === 'multiple_choice' && isset($question['choices'])) {
          foreach ($question['choices'] as $choice) {
            $choiceSql = "INSERT INTO choices (question_id, choice_text, is_correct) 
                                    VALUES (:question_id, :choice_text, :is_correct)";
            $choiceStmt = $this->conn->prepare($choiceSql);
            $choiceStmt->bindParam(':question_id', $question_id);
            $choiceStmt->bindParam(':choice_text', $choice['choice_text']);
            $choiceStmt->bindParam(':is_correct', $choice['is_correct']);

            if (!$choiceStmt->execute()) {
              $this->conn->rollBack();
              return json_encode([
                "status" => 500,
                "success" => false,
                "data" => [],
                "message" => "Failed to update choice"
              ]);
            }
          }
        }
      }

      $this->conn->commit();
      return json_encode([
        "status" => 200,
        "success" => true,
        "data" => [
          "test_id" => $data['test_id']
        ],
        "message" => "Test updated successfully"
      ]);

    } catch (Exception $ex) {
      $this->conn->rollBack();
      return json_encode([
        "status" => 500,
        "success" => false,
        "data" => [],
        "message" => "Error: " . $ex->getMessage()
      ]);
    }
  }

  public function deleteTest($json)
  {
    try {
      $this->conn->beginTransaction();
      $data = json_decode($json, true);

      if (!isset($data['test_id'])) {
        return json_encode([
          "status" => 422,
          "success" => false,
          "data" => [],
          "message" => "Test ID is required"
        ]);
      }

      // Check if test exists
      $checkSql = "SELECT test_id FROM tests WHERE test_id = :test_id";
      $checkStmt = $this->conn->prepare($checkSql);
      $checkStmt->bindParam(':test_id', $data['test_id']);
      $checkStmt->execute();

      if (!$checkStmt->fetch()) {
        return json_encode([
          "status" => 404,
          "success" => false,
          "data" => [],
          "message" => "Test not found"
        ]);
      }

      // Delete choices first (due to foreign key constraints)
      $deleteChoicesSql = "DELETE c FROM choices c 
                               INNER JOIN questions q ON c.question_id = q.question_id 
                               WHERE q.test_id = :test_id";
      $deleteChoicesStmt = $this->conn->prepare($deleteChoicesSql);
      $deleteChoicesStmt->bindParam(':test_id', $data['test_id']);
      $deleteChoicesStmt->execute();

      // Delete questions
      $deleteQuestionsSql = "DELETE FROM questions WHERE test_id = :test_id";
      $deleteQuestionsStmt = $this->conn->prepare($deleteQuestionsSql);
      $deleteQuestionsStmt->bindParam(':test_id', $data['test_id']);
      $deleteQuestionsStmt->execute();

      // Delete test
      $deleteTestSql = "DELETE FROM tests WHERE test_id = :test_id";
      $deleteTestStmt = $this->conn->prepare($deleteTestSql);
      $deleteTestStmt->bindParam(':test_id', $data['test_id']);

      if (!$deleteTestStmt->execute()) {
        $this->conn->rollBack();
        return json_encode([
          "status" => 500,
          "success" => false,
          "data" => [],
          "message" => "Failed to delete test"
        ]);
      }

      $this->conn->commit();
      return json_encode([
        "status" => 200,
        "success" => true,
        "data" => [],
        "message" => "Test deleted successfully"
      ]);

    } catch (Exception $ex) {
      $this->conn->rollBack();
      return json_encode([
        "status" => 500,
        "success" => false,
        "data" => [],
        "message" => "Error: " . $ex->getMessage()
      ]);
    }
  }

  public function getCourseTests($json)
  {
    try {
      $data = json_decode($json, true);

      if (!isset($data['course_id'])) {
        return json_encode([
          "status" => 422,
          "success" => false,
          "data" => [],
          "message" => "Course ID is required"
        ]);
      }

      // Get all tests for the course
      $sql = "SELECT t.*, c.course_title 
                   FROM tests t 
                   JOIN courses c ON t.course_id = c.course_id 
                   WHERE t.course_id = :course_id 
                   ORDER BY t.test_type";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindParam(':course_id', $data['course_id']);
      $stmt->execute();
      $tests = $stmt->fetchAll(PDO::FETCH_ASSOC);

      // Get questions for each test
      foreach ($tests as &$test) {
        $questionsSql = "SELECT * FROM questions WHERE test_id = :test_id";
        $questionsStmt = $this->conn->prepare($questionsSql);
        $questionsStmt->bindParam(':test_id', $test['test_id']);
        $questionsStmt->execute();
        $questions = $questionsStmt->fetchAll(PDO::FETCH_ASSOC);

        // Get choices for multiple choice questions
        foreach ($questions as &$question) {
          if ($question['question_type'] === 'multiple_choice') {
            $choicesSql = "SELECT * FROM choices WHERE question_id = :question_id";
            $choicesStmt = $this->conn->prepare($choicesSql);
            $choicesStmt->bindParam(':question_id', $question['question_id']);
            $choicesStmt->execute();
            $question['choices'] = $choicesStmt->fetchAll(PDO::FETCH_ASSOC);
          }
        }

        $test['questions'] = $questions;
      }

      return json_encode([
        "status" => 200,
        "success" => true,
        "data" => $tests,
        "message" => ""
      ]);

    } catch (Exception $ex) {
      return json_encode([
        "status" => 500,
        "success" => false,
        "data" => [],
        "message" => "Error: " . $ex->getMessage()
      ]);
    }
  }
}

$tests = new Tests();

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
      case "createTest":
        if ($requestMethod === "POST") {
          echo $tests->createTest($json);
        } else {
          http_response_code(405);
          echo json_encode([
            "status" => 405,
            "success" => false,
            "data" => [],
            "message" => "Invalid request method for createTest. Use POST."
          ]);
        }
        break;

      case "getTest":
        if ($requestMethod === "GET") {
          echo $tests->getTest($json);
        } else {
          http_response_code(405);
          echo json_encode([
            "status" => 405,
            "success" => false,
            "data" => [],
            "message" => "Invalid request method for getTest. Use GET."
          ]);
        }
        break;

      case "getLessonTests":
        if ($requestMethod === "GET") {
          echo $tests->getLessonTests($json);
        } else {
          http_response_code(405);
          echo json_encode([
            "status" => 405,
            "success" => false,
            "data" => [],
            "message" => "Invalid request method for getLessonTests. Use GET."
          ]);
        }
        break;

      case "updateTest":
        if ($requestMethod === "POST") {
          echo $tests->updateTest($json);
        } else {
          http_response_code(405);
          echo json_encode([
            "status" => 405,
            "success" => false,
            "data" => [],
            "message" => "Invalid request method for updateTest. Use POST."
          ]);
        }
        break;

      case "deleteTest":
        if ($requestMethod === "POST") {
          echo $tests->deleteTest($json);
        } else {
          http_response_code(405);
          echo json_encode([
            "status" => 405,
            "success" => false,
            "data" => [],
            "message" => "Invalid request method for deleteTest. Use POST."
          ]);
        }
        break;

      case "getCourseTests":
        if ($requestMethod === "GET") {
          echo $tests->getCourseTests($json);
        } else {
          http_response_code(405);
          echo json_encode([
            "status" => 405,
            "success" => false,
            "data" => [],
            "message" => "Invalid request method for getCourseTests. Use GET."
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
