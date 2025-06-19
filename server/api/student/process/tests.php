<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require('../../../configs/conn.php');
include('../../../middleware/helpers.php');

class Test
{
  private $conn;

  public function __construct()
  {
    $this->conn = DatabaseConnection::getInstance()->getConnection();
  }

  public function getTestQuestions($json)
  {
    $data = json_decode($json, true);
    $isDataSet = InputHelper::requiredFields($data, ['test_id']);
    if ($isDataSet !== true) {
      http_response_code(422);
      return json_encode([
        "status" => 422,
        "success" => false,
        "data" => [],
        "message" => $isDataSet
      ]);
    }
    $test_id = InputHelper::sanitizeInt($data['test_id']);
    if (!InputHelper::validateInt($test_id)) {
      http_response_code(422);
      return json_encode([
        "status" => 422,
        "success" => false,
        "data" => [],
        "message" => "Invalid test id"
      ]);
    }
    try {
      $sql = "SELECT t.*, c.title as course_title FROM tests t JOIN courses c ON t.course_id = c.course_id WHERE t.test_id = :test_id";
      $stmt = $this->conn->prepare($sql);
      $stmt->bindParam(':test_id', $test_id, PDO::PARAM_INT);
      $stmt->execute();
      $test = $stmt->fetch(PDO::FETCH_ASSOC);
      if (!$test) {
        http_response_code(404);
        return json_encode([
          "status" => 404,
          "success" => false,
          "data" => [],
          "message" => "Test not found"
        ]);
      }
      $questionsSql = "SELECT * FROM questions WHERE test_id = :test_id ORDER BY question_id";
      $questionsStmt = $this->conn->prepare($questionsSql);
      $questionsStmt->bindParam(':test_id', $test_id, PDO::PARAM_INT);
      $questionsStmt->execute();
      $questions = $questionsStmt->fetchAll(PDO::FETCH_ASSOC);
      
      // Check if test has questions
      if (empty($questions)) {
        http_response_code(404);
        return json_encode([
          "status" => 404,
          "success" => false,
          "data" => [],
          "message" => "This test has no questions. Please contact your instructor."
        ]);
      }
      
      foreach ($questions as &$question) {
        if ($question['question_type'] === 'multiple_choice') {
          $choicesSql = "SELECT * FROM choices WHERE question_id = :question_id ORDER BY choice_id";
          $choicesStmt = $this->conn->prepare($choicesSql);
          $choicesStmt->bindParam(':question_id', $question['question_id'], PDO::PARAM_INT);
          $choicesStmt->execute();
          $question['choices'] = $choicesStmt->fetchAll(PDO::FETCH_ASSOC);
        }
      }
      $test['questions'] = $questions;
      http_response_code(200);
      return json_encode([
        "status" => 200,
        "success" => true,
        "data" => $test,
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

  public function submitTestResponses($json)
  {
    $data = json_decode($json, true);
    $isDataSet = InputHelper::requiredFields($data, [
      'test_id',
      'user_id',
      'responses'
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
    $test_id = InputHelper::sanitizeInt($data['test_id']);
    $user_id = InputHelper::sanitizeInt($data['user_id']);
    $responses = $data['responses'];
    if (!InputHelper::validateInt($test_id) || !InputHelper::validateInt($user_id)) {
      http_response_code(422);
      return json_encode([
        "status" => 422,
        "success" => false,
        "data" => [],
        "message" => "Invalid test id or user id"
      ]);
    }
    try {
      $this->conn->beginTransaction();
      $checkSql = "SELECT COUNT(*) as count FROM responses r JOIN questions q ON r.question_id = q.question_id WHERE q.test_id = :test_id AND r.user_id = :user_id";
      $checkStmt = $this->conn->prepare($checkSql);
      $checkStmt->bindParam(':test_id', $test_id, PDO::PARAM_INT);
      $checkStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
      $checkStmt->execute();
      $existingCount = $checkStmt->fetch(PDO::FETCH_ASSOC)['count'];
      if ($existingCount > 0) {
        $this->conn->rollBack();
        http_response_code(409);
        return json_encode([
          "status" => 409,
          "success" => false,
          "data" => [],
          "message" => "You have already submitted this test"
        ]);
      }
      $totalScore = 0;
      $totalQuestions = 0;
      foreach ($responses as $response) {
        $questionId = InputHelper::sanitizeInt($response['question_id']);
        $answerChoiceId = isset($response['answer_choice_id']) ? InputHelper::sanitizeInt($response['answer_choice_id']) : null;
        $answerBoolean = isset($response['answer_boolean']) ? (int) $response['answer_boolean'] : null;
        $answerText = isset($response['answer_text']) ? InputHelper::sanitizeString($response['answer_text']) : '';
        $score = 0;
        $questionSql = "SELECT * FROM questions WHERE question_id = :question_id";
        $questionStmt = $this->conn->prepare($questionSql);
        $questionStmt->bindParam(':question_id', $questionId, PDO::PARAM_INT);
        $questionStmt->execute();
        $question = $questionStmt->fetch(PDO::FETCH_ASSOC);
        if ($question) {
          $totalQuestions++;
          if ($question['question_type'] === 'multiple_choice' && $answerChoiceId) {
            $choiceSql = "SELECT choice_text, is_correct FROM choices WHERE choice_id = :choice_id";
            $choiceStmt = $this->conn->prepare($choiceSql);
            $choiceStmt->bindParam(':choice_id', $answerChoiceId, PDO::PARAM_INT);
            $choiceStmt->execute();
            $choice = $choiceStmt->fetch(PDO::FETCH_ASSOC);
            if ($choice) {
              $answerText = $choice['choice_text'];
              if ($choice['is_correct'] == 1) {
                $score = $question['points'];
              }
            }
          } elseif ($question['question_type'] === 'true_false' && $answerBoolean !== null) {
            $score = $question['points'];
          } elseif ($question['question_type'] === 'essay' || $question['question_type'] === 'short_answer') {
            $score = 0;
          }
        }
        $totalScore += $score;
        $insertSql = "INSERT INTO responses (question_id, user_id, answer_text, answer_choice_id, answer_boolean, submission_date, score) VALUES (:question_id, :user_id, :answer_text, :answer_choice_id, :answer_boolean, NOW(), :score)";
        $insertStmt = $this->conn->prepare($insertSql);
        $insertStmt->bindParam(':question_id', $questionId, PDO::PARAM_INT);
        $insertStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $insertStmt->bindParam(':answer_text', $answerText);
        $insertStmt->bindParam(':answer_choice_id', $answerChoiceId);
        $insertStmt->bindParam(':answer_boolean', $answerBoolean);
        $insertStmt->bindParam(':score', $score);
        $insertStmt->execute();
      }
      $percentageScore = $totalQuestions > 0 ? round(($totalScore / $totalQuestions) * 100, 2) : 0;
      $this->conn->commit();
      http_response_code(201);
      return json_encode([
        "status" => 201,
        "success" => true,
        "data" => [
          "total_score" => $totalScore,
          "total_questions" => $totalQuestions,
          "percentage_score" => $percentageScore
        ],
        "message" => "Test submitted successfully"
      ]);
    } catch (PDOException $ex) {
      $this->conn->rollBack();
      http_response_code(500);
      return json_encode([
        "status" => 500,
        "success" => false,
        "data" => [],
        "message" => $ex->getMessage()
      ]);
    }
  }

  public function getCourseTests($json)
  {
    $data = json_decode($json, true);
    $isDataSet = InputHelper::requiredFields($data, ['course_id', 'user_id']);
    if ($isDataSet !== true) {
      http_response_code(422);
      return json_encode([
        "status" => 422,
        "success" => false,
        "data" => [],
        "message" => $isDataSet
      ]);
    }
    $course_id = InputHelper::sanitizeString($data['course_id']);
    $user_id = InputHelper::sanitizeInt($data['user_id']);
    try {
      $sql = "SELECT t.*, c.title as course_title FROM tests t JOIN courses c ON t.course_id = c.course_id WHERE t.course_id = :course_id ORDER BY t.test_type";
      $stmt = $this->conn->prepare($sql);
      $stmt->bindParam(':course_id', $course_id, PDO::PARAM_STR);
      $stmt->execute();
      $tests = $stmt->fetchAll(PDO::FETCH_ASSOC);
      foreach ($tests as &$test) {
        // Get question count
        $questionsSql = "SELECT COUNT(*) as question_count FROM questions WHERE test_id = :test_id";
        $questionsStmt = $this->conn->prepare($questionsSql);
        $questionsStmt->bindParam(':test_id', $test['test_id'], PDO::PARAM_INT);
        $questionsStmt->execute();
        $questionCount = $questionsStmt->fetch(PDO::FETCH_ASSOC);
        $test['question_count'] = $questionCount['question_count'];

        // Get user's answered count
        $answeredSql = "SELECT COUNT(DISTINCT r.question_id) as answered_count FROM responses r JOIN questions q ON r.question_id = q.question_id WHERE q.test_id = :test_id AND r.user_id = :user_id";
        $answeredStmt = $this->conn->prepare($answeredSql);
        $answeredStmt->bindParam(':test_id', $test['test_id'], PDO::PARAM_INT);
        $answeredStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $answeredStmt->execute();
        $answeredCount = $answeredStmt->fetch(PDO::FETCH_ASSOC);
        $test['answered_count'] = $answeredCount['answered_count'];

        // Set status
        if ($test['question_count'] > 0 && $test['answered_count'] == $test['question_count']) {
          $test['status'] = 'complete';
        } else {
          $test['status'] = 'incomplete';
        }
      }
      http_response_code(200);
      return json_encode([
        "status" => 200,
        "success" => true,
        "data" => $tests,
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

  public function getUserTestResults($json)
  {
    $data = json_decode($json, true);
    $isDataSet = InputHelper::requiredFields($data, ['user_id', 'test_id']);
    if ($isDataSet !== true) {
      http_response_code(422);
      return json_encode([
        "status" => 422,
        "success" => false,
        "data" => [],
        "message" => $isDataSet
      ]);
    }
    $user_id = InputHelper::sanitizeInt($data['user_id']);
    $test_id = InputHelper::sanitizeInt($data['test_id']);
    if (!InputHelper::validateInt($user_id) || !InputHelper::validateInt($test_id)) {
      http_response_code(422);
      return json_encode([
        "status" => 422,
        "success" => false,
        "data" => [],
        "message" => "Invalid user id or test id"
      ]);
    }
    try {
      $testSql = "SELECT t.*, c.title as course_title FROM tests t JOIN courses c ON t.course_id = c.course_id WHERE t.test_id = :test_id";
      $testStmt = $this->conn->prepare($testSql);
      $testStmt->bindParam(':test_id', $test_id, PDO::PARAM_INT);
      $testStmt->execute();
      $test = $testStmt->fetch(PDO::FETCH_ASSOC);
      if (!$test) {
        http_response_code(404);
        return json_encode([
          "status" => 404,
          "success" => false,
          "data" => [],
          "message" => "Test not found"
        ]);
      }
      $responsesSql = "SELECT r.*, q.question_text, q.question_type, q.points, c.choice_text, c.is_correct FROM responses r JOIN questions q ON r.question_id = q.question_id LEFT JOIN choices c ON r.answer_choice_id = c.choice_id WHERE q.test_id = :test_id AND r.user_id = :user_id ORDER BY q.question_id";
      $responsesStmt = $this->conn->prepare($responsesSql);
      $responsesStmt->bindParam(':test_id', $test_id, PDO::PARAM_INT);
      $responsesStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
      $responsesStmt->execute();
      $responses = $responsesStmt->fetchAll(PDO::FETCH_ASSOC);
      
      // If no responses found, return success with empty data
      if (empty($responses)) {
        http_response_code(200);
        return json_encode([
          "status" => 200,
          "success" => true,
          "data" => null,
          "message" => "No test results found for this user"
        ]);
      }
      
      $totalScore = 0;
      $totalQuestions = count($responses);
      $correctAnswers = 0;
      foreach ($responses as $response) {
        $totalScore += $response['score'];
        if ($response['score'] > 0) {
          $correctAnswers++;
        }
      }
      $percentageScore = $totalQuestions > 0 ? round(($totalScore / $totalQuestions) * 100, 2) : 0;
      $result = [
        "test" => $test,
        "responses" => $responses,
        "summary" => [
          "total_questions" => $totalQuestions,
          "correct_answers" => $correctAnswers,
          "total_score" => $totalScore,
          "percentage_score" => $percentageScore
        ]
      ];
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

  public function checkPreTestCompletion($json)
  {
    $data = json_decode($json, true);
    $isDataSet = InputHelper::requiredFields($data, ['user_id', 'course_id']);
    if ($isDataSet !== true) {
      http_response_code(422);
      return json_encode([
        "status" => 422,
        "success" => false,
        "data" => [],
        "message" => $isDataSet
      ]);
    }
    $user_id = InputHelper::sanitizeInt($data['user_id']);
    $course_id = InputHelper::sanitizeString($data['course_id']);
    if (!InputHelper::validateInt($user_id)) {
      http_response_code(422);
      return json_encode([
        "status" => 422,
        "success" => false,
        "data" => [],
        "message" => "Invalid user id"
      ]);
    }
    try {
      // First, check if there's a pre-test for this course
      $preTestSql = "SELECT test_id FROM tests WHERE course_id = :course_id AND test_type = 'pre'";
      $preTestStmt = $this->conn->prepare($preTestSql);
      $preTestStmt->bindParam(':course_id', $course_id, PDO::PARAM_STR);
      $preTestStmt->execute();
      $preTest = $preTestStmt->fetch(PDO::FETCH_ASSOC);
      
      if (!$preTest) {
        // No pre-test exists, so post-test should be available
        http_response_code(200);
        return json_encode([
          "status" => 200,
          "success" => true,
          "data" => [
            "pre_test_exists" => false,
            "pre_test_completed" => true,
            "can_take_post_test" => true
          ],
          "message" => "No pre-test exists for this course"
        ]);
      }
      
      // Check if user has completed the pre-test
      $completionSql = "SELECT COUNT(*) as count FROM responses r 
                       JOIN questions q ON r.question_id = q.question_id 
                       WHERE q.test_id = :test_id AND r.user_id = :user_id";
      $completionStmt = $this->conn->prepare($completionSql);
      $completionStmt->bindParam(':test_id', $preTest['test_id'], PDO::PARAM_INT);
      $completionStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
      $completionStmt->execute();
      $completionCount = $completionStmt->fetch(PDO::FETCH_ASSOC)['count'];
      
      $preTestCompleted = $completionCount > 0;
      
      http_response_code(200);
      return json_encode([
        "status" => 200,
        "success" => true,
        "data" => [
          "pre_test_exists" => true,
          "pre_test_completed" => $preTestCompleted,
          "can_take_post_test" => $preTestCompleted,
          "pre_test_id" => $preTest['test_id']
        ],
        "message" => $preTestCompleted ? "Pre-test completed" : "Pre-test not completed"
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

$validApiKey = $_ENV['API_KEY'] ?? null;
$requestMethod = $_SERVER["REQUEST_METHOD"];
$headers = array_change_key_case(getallheaders(), CASE_LOWER);

if (isset($headers['authorization']) && $headers['authorization'] === $validApiKey) {
  $operation = null;
  $json = null;
  $testApi = new Test();

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
      case "getTestQuestions":
        if ($requestMethod === "GET") {
          echo $testApi->getTestQuestions($json);
        } else {
          http_response_code(405);
          echo json_encode([
            "status" => 405,
            "success" => false,
            "data" => [],
            "message" => "Invalid request method for getTestQuestions. Use GET."
          ]);
        }
        break;
      case "getCourseTests":
        if ($requestMethod === "GET") {
          echo $testApi->getCourseTests($json);
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
      case "getUserTestResults":
        if ($requestMethod === "GET") {
          echo $testApi->getUserTestResults($json);
        } else {
          http_response_code(405);
          echo json_encode([
            "status" => 405,
            "success" => false,
            "data" => [],
            "message" => "Invalid request method for getUserTestResults. Use GET."
          ]);
        }
        break;
      case "submitTestResponses":
        if ($requestMethod === "POST") {
          echo $testApi->submitTestResponses($json);
        } else {
          http_response_code(405);
          echo json_encode([
            "status" => 405,
            "success" => false,
            "data" => [],
            "message" => "Invalid request method for submitTestResponses. Use POST."
          ]);
        }
        break;
      case "checkPreTestCompletion":
        if ($requestMethod === "POST") {
          echo $testApi->checkPreTestCompletion($json);
        } else {
          http_response_code(405);
          echo json_encode([
            "status" => 405,
            "success" => false,
            "data" => [],
            "message" => "Invalid request method for checkPreTestCompletion. Use POST."
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

