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

  public function getCourseStudents($json)
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
        // Enhanced query to include test results and topic-based progress
        $sql = "SELECT 
              u.user_id,
              ui.first_name,
              ui.last_name,
              ui.email,
              ui.phone,
              ui.profile_image,
              ui.date_created,
              e.enrollment_date,
              e.isAdmitted,
              -- Course progress calculation based on topic completion
              COALESCE(progress_calc.course_progress, 0) as course_progress,
              COALESCE(progress_calc.completed_topics, 0) as completed_topics,
              COALESCE(progress_calc.total_topics, 0) as total_topics,
              -- Pre-test results
              COALESCE(pre_test.total_questions, 0) as pre_test_total_questions,
              COALESCE(pre_test.total_score, 0) as pre_test_total_score,
              COALESCE(pre_test.percentage, 0) as pre_test_percentage,
              pre_test.submission_date as pre_test_submission_date,
              -- Post-test results
              COALESCE(post_test.total_questions, 0) as post_test_total_questions,
              COALESCE(post_test.total_score, 0) as post_test_total_score,
              COALESCE(post_test.percentage, 0) as post_test_percentage,
              post_test.submission_date as post_test_submission_date
          FROM enrollments e
          LEFT JOIN user u ON e.user_id = u.user_id
          LEFT JOIN userinfo ui ON u.user_id = ui.user_id
          -- Course progress calculation subquery
          LEFT JOIN (
              SELECT 
                  tp.user_id,
                  l.course_id,
                  COUNT(DISTINCT t.topic_id) as total_topics,
                  COUNT(DISTINCT CASE WHEN tp.is_completed = 1 THEN t.topic_id END) as completed_topics,
                  CASE 
                      WHEN COUNT(DISTINCT t.topic_id) = 0 THEN 0
                      ELSE ROUND(
                          (COUNT(DISTINCT CASE WHEN tp.is_completed = 1 THEN t.topic_id END) * 100.0) / 
                          COUNT(DISTINCT t.topic_id), 2
                      )
                  END as course_progress
              FROM lessons l
              INNER JOIN topic t ON l.lesson_id = t.lesson_id
              LEFT JOIN topic_progress tp ON t.topic_id = tp.topic_id
              GROUP BY tp.user_id, l.course_id
          ) progress_calc ON e.user_id = progress_calc.user_id AND e.course_id = progress_calc.course_id
          -- Pre-test results subquery
          LEFT JOIN (
              SELECT 
                  r.user_id,
                  t.course_id,
                  COUNT(r.response_id) as total_questions,
                  SUM(COALESCE(r.score, 0)) as total_score,
                  CASE 
                      WHEN COUNT(r.response_id) = 0 THEN 0
                      ELSE ROUND((SUM(COALESCE(r.score, 0)) / COUNT(r.response_id)) * 100, 2)
                  END as percentage,
                  MAX(r.submission_date) as submission_date
              FROM responses r
              INNER JOIN questions q ON r.question_id = q.question_id
              INNER JOIN tests t ON q.test_id = t.test_id
              WHERE t.test_type = 'pre'
              GROUP BY r.user_id, t.course_id
          ) pre_test ON e.user_id = pre_test.user_id AND e.course_id = pre_test.course_id
          -- Post-test results subquery
          LEFT JOIN (
              SELECT 
                  r.user_id,
                  t.course_id,
                  COUNT(r.response_id) as total_questions,
                  SUM(COALESCE(r.score, 0)) as total_score,
                  CASE 
                      WHEN COUNT(r.response_id) = 0 THEN 0
                      ELSE ROUND((SUM(COALESCE(r.score, 0)) / COUNT(r.response_id)) * 100, 2)
                  END as percentage,
                  MAX(r.submission_date) as submission_date
              FROM responses r
              INNER JOIN questions q ON r.question_id = q.question_id
              INNER JOIN tests t ON q.test_id = t.test_id
              WHERE t.test_type = 'post'
              GROUP BY r.user_id, t.course_id
          ) post_test ON e.user_id = post_test.user_id AND e.course_id = post_test.course_id
          WHERE e.course_id = :course_id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':course_id', $data['course_id'], PDO::PARAM_STR);
        $stmt->execute();
        $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $result['students'] = $students;
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

      case "getCourseStudents":
        if ($requestMethod === "GET") {
          echo $course->getCourseStudents($json);
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
