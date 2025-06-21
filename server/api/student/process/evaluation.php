<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../../../configs/conn.php';
require_once '../../../middleware/helpers.php';

// Verify JWT token
$headers = getallheaders();
$token = null;

if (isset($headers['Authorization'])) {
    $token = str_replace('Bearer ', '', $headers['Authorization']);
} elseif (isset($headers['authorization'])) {
    $token = str_replace('Bearer ', '', $headers['authorization']);
}

if (!$token) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No token provided']);
    exit;
}

try {
    $decoded = JWT::decode($token, $jwt_secret, array('HS256'));
    $user_id = $decoded->user_id;
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid token']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        handleSubmitEvaluation($conn, $user_id);
        break;
    case 'GET':
        handleGetEvaluationStatus($conn, $user_id);
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function handleSubmitEvaluation($conn, $user_id) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
        return;
    }
    
    $course_id = $input['course_id'] ?? null;
    $evaluation_type = $input['evaluation_type'] ?? 'course'; // 'course' or 'hrd-ld'
    $answers = $input['answers'] ?? [];
    $completion_date = date('Y-m-d H:i:s');
    
    if (!$course_id || empty($answers)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    try {
        // Check if evaluation already exists
        $check_stmt = $conn->prepare("
            SELECT evaluation_id FROM course_evaluations 
            WHERE user_id = ? AND course_id = ? AND evaluation_type = ?
        ");
        $check_stmt->bind_param("iss", $user_id, $course_id, $evaluation_type);
        $check_stmt->execute();
        $result = $check_stmt->get_result();
        
        if ($result->num_rows > 0) {
            // Update existing evaluation
            $row = $result->fetch_assoc();
            $evaluation_id = $row['evaluation_id'];
            
            $update_stmt = $conn->prepare("
                UPDATE course_evaluations 
                SET answers = ?, completion_date = ?, updated_at = NOW()
                WHERE evaluation_id = ?
            ");
            $answers_json = json_encode($answers);
            $update_stmt->bind_param("ssi", $answers_json, $completion_date, $evaluation_id);
            
            if ($update_stmt->execute()) {
                echo json_encode([
                    'success' => true, 
                    'message' => 'Evaluation updated successfully',
                    'evaluation_id' => $evaluation_id
                ]);
            } else {
                throw new Exception('Failed to update evaluation');
            }
        } else {
            // Insert new evaluation
            $insert_stmt = $conn->prepare("
                INSERT INTO course_evaluations 
                (user_id, course_id, evaluation_type, answers, completion_date, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, NOW(), NOW())
            ");
            $answers_json = json_encode($answers);
            $insert_stmt->bind_param("issss", $user_id, $course_id, $evaluation_type, $answers_json, $completion_date);
            
            if ($insert_stmt->execute()) {
                $evaluation_id = $conn->insert_id;
                echo json_encode([
                    'success' => true, 
                    'message' => 'Evaluation submitted successfully',
                    'evaluation_id' => $evaluation_id
                ]);
            } else {
                throw new Exception('Failed to submit evaluation');
            }
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

function handleGetEvaluationStatus($conn, $user_id) {
    $course_id = $_GET['course_id'] ?? null;
    
    if (!$course_id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Course ID required']);
        return;
    }
    
    try {
        $stmt = $conn->prepare("
            SELECT evaluation_id, evaluation_type, completion_date, created_at
            FROM course_evaluations 
            WHERE user_id = ? AND course_id = ?
            ORDER BY created_at DESC
        ");
        $stmt->bind_param("is", $user_id, $course_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $evaluations = [];
        while ($row = $result->fetch_assoc()) {
            $evaluations[] = [
                'evaluation_id' => $row['evaluation_id'],
                'evaluation_type' => $row['evaluation_type'],
                'completion_date' => $row['completion_date'],
                'created_at' => $row['created_at']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'data' => $evaluations
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

$conn->close();
?> 
