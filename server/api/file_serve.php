<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_GET['file']) || empty($_GET['file'])) {
    http_response_code(400);
    echo json_encode(["error" => "File parameter is required."]);
    exit();
}

$filePath = basename($_GET['file']);
$fullPath = __DIR__ . '/../MEDIA/course_files/' . $filePath;

if (file_exists($fullPath) && is_file($fullPath)) {
    $fileInfo = mime_content_type($fullPath);
    header('Content-Type: ' . $fileInfo);
    header('Content-Disposition: inline; filename="' . $filePath . '"');
    header('Content-Length: ' . filesize($fullPath));

    readfile($fullPath);
    exit();
} else {
    // Handle file not found case
    http_response_code(404);
    echo json_encode(["error" => "File not found."]);
    exit();
}
