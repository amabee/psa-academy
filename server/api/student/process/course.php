<?php

use Ramsey\Uuid\Uuid;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require('../../../configs/conn.php');
include('../../../middleware/helpers.php');


class Course
{
    private $conn;


    public function __construct()
    {
        $this->conn = DatabaseConnection::getInstance()->getConnection();
    }

    public function getCourses($json)
    {
        $data = json_decode($json, true);
        $isDataSet = InputHelper::requiredFields($data, ['user_id']);

        if ($isDataSet !== true) {
            return $isDataSet;
        }

        $user_id = InputHelper::sanitizeInt($data['user_id']);

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
            $sql = "SELECT 
                        courses.course_id, 
                        courses.user_id AS speaker_id,
                        userinfo.first_name AS speaker_firstname,
                        userinfo.middle_name AS speaker_middlename,
                        userinfo.last_name AS speaker_lastname,
                        userinfo.profile_image as speaker_image,
                        userinfo.position as speaker_position,
                        courses.title, 
                        courses.description,
                        courses.course_image, 
                        courses.course_status, 
                        courses.created_at,
                        categories.category_name,
                        enrollments.user_id AS student_id,
                        enrollments.isAdmitted as isAdmitted,
                       CASE 
                            WHEN enrollments.user_id IS NOT NULL AND enrollments.isAdmitted = 1 THEN 1 
                            ELSE 0 
                        END AS enrolled
                    FROM 
                        courses
                    INNER JOIN 
                        categories 
                        ON courses.category_id = categories.category_id
                    LEFT JOIN 
                        enrollments 
                        ON courses.course_id = enrollments.course_id 
                        AND enrollments.user_id = :userID
                    LEFT JOIN 
                        userinfo 
                        ON courses.user_id = userinfo.user_id WHERE courses.course_status != 'draft' ";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':userID', $user_id, PDO::PARAM_INT);
            $stmt->execute();

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($result as &$course) {
                $lessonSql = "SELECT lesson_id 
                             FROM lessons 
                             WHERE course_id = :course_id 
                             ORDER BY sequence_number ASC";

                $lessonStmt = $this->conn->prepare($lessonSql);
                $lessonStmt->bindParam(':course_id', $course['course_id'], PDO::PARAM_INT);
                $lessonStmt->execute();
                $lessons = $lessonStmt->fetchAll(PDO::FETCH_ASSOC);

                // Get topics for each lesson
                $course['lessons'] = [];
                foreach ($lessons as $lesson) {
                    $topicSql = "SELECT topic_id 
                                FROM topic 
                                WHERE lesson_id = :lesson_id 
                                ORDER BY sequence_number ASC";

                    $topicStmt = $this->conn->prepare($topicSql);
                    $topicStmt->bindParam(':lesson_id', $lesson['lesson_id'], PDO::PARAM_INT);
                    $topicStmt->execute();

                    $course['lessons'][] = [
                        'lesson_id' => $lesson['lesson_id'],
                        'topics' => $topicStmt->fetchAll(PDO::FETCH_COLUMN)
                    ];
                }
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

    public function getUserCourseDetails($json)
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
            $sql = "SELECT 
                        c.course_id,
                        c.title,
                        c.description,
                        c.course_image,
                        c.course_status,
                        c.created_at,
                        cat.category_name,
                        u.user_id AS teacher_id,
                        u.first_name AS teacher_firstname,
                        u.middle_name AS teacher_middlename,
                        u.last_name AS teacher_lastname,
                        u.profile_image AS teacher_image,
                        u.user_about AS teacher_about,
                        u.position as teacher_position,
                        CASE 
                            WHEN e.user_id IS NOT NULL THEN 1 
                            ELSE 0 
                        END AS enrolled
                    FROM 
                        courses c
                    INNER JOIN 
                        categories cat ON c.category_id = cat.category_id
                    INNER JOIN 
                        userinfo u ON c.user_id = u.user_id
                    LEFT JOIN 
                        enrollments e ON c.course_id = e.course_id AND e.user_id = :user_id
                    WHERE 
                        c.course_id = :course_id";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->bindParam(':course_id', $course_id, PDO::PARAM_STR);
            $stmt->execute();

            $courseDetails = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$courseDetails) {
                http_response_code(404);
                return json_encode([
                    "status" => 404,
                    "success" => false,
                    "data" => "",
                    "message" => "Course not found"
                ]);
            }

            // Get lessons with progress
            $lessonSql = "SELECT 
                            l.lesson_id,
                            l.lesson_title AS lesson_title,
                            l.lesson_description AS lesson_description,
                            l.sequence_number,
                            COALESCE(lp.is_completed, 0) AS is_completed,
                            lp.completion_date,
                            lp.last_accessed
                        FROM 
                            lessons l
                        LEFT JOIN 
                            lesson_progress lp ON l.lesson_id = lp.lesson_id AND lp.user_id = :user_id
                        WHERE 
                            l.course_id = :course_id
                        GROUP BY 
                            l.lesson_id
                        ORDER BY 
                            l.sequence_number ASC";

            $lessonStmt = $this->conn->prepare($lessonSql);
            $lessonStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $lessonStmt->bindParam(':course_id', $course_id, PDO::PARAM_STR);
            $lessonStmt->execute();
            $lessons = $lessonStmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($lessons as $key => $lesson) {
                $topicSql = "SELECT 
                        t.topic_id,
                        t.topic_title,
                        t.topic_description,
                        t.sequence_number,
                        t.lesson_id,
                        COALESCE(tp.is_completed, 0) AS is_completed,
                        tp.completion_date,
                        tp.last_accessed,
                        tp.time_spent,
                        GROUP_CONCAT(
                            DISTINCT CONCAT_WS('::',
                                m.material_id,
                                m.file_name
                            )
                            SEPARATOR '||'
                        ) as materials
                    FROM 
                        topic t
                    LEFT JOIN 
                        topic_progress tp ON t.topic_id = tp.topic_id AND tp.user_id = :user_id
                    LEFT JOIN
                        materials m ON t.topic_id = m.topic_id
                    WHERE 
                        t.lesson_id = :lesson_id
                    GROUP BY 
                        t.topic_id, t.topic_title
                    ORDER BY 
                        t.sequence_number ASC";

                $topicStmt = $this->conn->prepare($topicSql);
                $topicStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
                $topicStmt->bindParam(':lesson_id', $lesson['lesson_id'], PDO::PARAM_STR);
                $topicStmt->execute();
                $topics = $topicStmt->fetchAll(PDO::FETCH_ASSOC);

                $uniqueTopics = [];
                foreach ($topics as $topic) {
                    $processedMaterials = [];
                    if (!empty($topic['materials'])) {
                        $materialsList = explode('||', $topic['materials']);
                        foreach ($materialsList as $material) {
                            list($materialId, $fileName) = explode('::', $material);
                            $processedMaterials[] = [
                                'material_id' => $materialId,
                                'file_name' => $fileName
                            ];
                        }
                    }

                    // Process topic progress
                    $topicProgress = [
                        'is_completed' => (bool) $topic['is_completed'],
                        'completion_date' => $topic['completion_date'],
                        'last_accessed' => $topic['last_accessed'],
                        'time_spent' => (int) $topic['time_spent']
                    ];

                    $topic['materials'] = $processedMaterials;
                    $topic['progress'] = $topicProgress;

                    $existingTopicKey = array_search($topic['topic_id'], array_column($uniqueTopics, 'topic_id'));

                    if ($existingTopicKey === false) {
                        $uniqueTopics[] = $topic;
                    } else {
                        $uniqueTopics[$existingTopicKey]['materials'] = array_merge(
                            $uniqueTopics[$existingTopicKey]['materials'],
                            $topic['materials']
                        );
                    }
                }

                $lessons[$key]['topics'] = $uniqueTopics;

                $lessonTopicsTotal = count($topics);
                $lessonTopicsCompleted = 0;
                foreach ($topics as $topic) {
                    if ($topic['is_completed']) {
                        $lessonTopicsCompleted++;
                    }
                }
                $lessons[$key]['topic_progress'] = [
                    'total' => $lessonTopicsTotal,
                    'completed' => $lessonTopicsCompleted
                ];
            }

            $courseDetails['lessons'] = $lessons;

            // Calculate overall progress statistics
            $totalLessons = count($lessons);
            $completedLessons = 0;
            $totalTopics = 0;
            $completedTopics = 0;

            foreach ($lessons as $lesson) {
                if ($lesson['is_completed']) {
                    $completedLessons++;
                }
                $totalTopics += $lesson['topic_progress']['total'];
                $completedTopics += $lesson['topic_progress']['completed'];
            }

            $courseDetails['progress'] = [
                'total_lessons' => $totalLessons,
                'completed_lessons' => $completedLessons,
                'total_topics' => $totalTopics,
                'completed_topics' => $completedTopics,
                'lesson_progress' => $completedLessons,
                'topic_progress' => $completedTopics,
                'total_time_spent' => array_reduce($lessons, function ($carry, $lesson) {
                    return $carry + array_reduce($lesson['topics'], function ($topicCarry, $topic) {
                        return $topicCarry + ($topic['progress']['time_spent'] ?? 0);
                    }, 0);
                }, 0)
            ];

            http_response_code(200);
            return json_encode([
                "status" => 200,
                "success" => true,
                "data" => $courseDetails,
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

    public function enrollToCourse($json)
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
            $sql = "INSERT INTO enrollments (user_id, course_id, isAdmitted) VALUES (:user_id, :course_id, :isAdmitted)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->bindParam(':course_id', $course_id, PDO::PARAM_STR);
            $stmt->bindValue(':isAdmitted', 0, PDO::PARAM_INT);
            $stmt->execute();

            http_response_code(201);
            return json_encode([
                "status" => 201,
                "success" => true,
                "data" => [],
                "message" => "Enrollment request submitted and is pending approval."
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

$course = new Course();

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
                    echo $course->getCourses($json);
                } else {
                    http_response_code(405);
                    echo json_encode([
                        "status" => 405,
                        "success" => false,
                        "data" => [],
                        "message" => "Invalid request method for getCourses. Use GET."
                    ]);
                }
                break;

            case "getUserCourseDetails":
                if ($requestMethod === "GET") {
                    echo $course->getUserCourseDetails($json);
                } else {
                    http_response_code(405);
                    echo json_encode([
                        "status" => 405,
                        "success" => false,
                        "data" => [],
                        "message" => "Invalid request method for getUserCourseDetails. Use GET."
                    ]);
                }
                break;

            case "enrollToCourse":
                if ($requestMethod === "POST") {
                    echo $course->enrollToCourse($json);
                } else {
                    http_response_code(405);
                    echo json_encode([
                        "status" => 405,
                        "success" => false,
                        "data" => [],
                        "message" => "Invalid request method for enrollToCourse. Use POST."
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
