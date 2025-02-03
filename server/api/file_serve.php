<?php
// First, check if file parameter exists
if (!isset($_GET['file']) || empty($_GET['file'])) {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(["error" => "File parameter is required."]);
    exit();
}

$filePath = basename($_GET['file']);
$fullPath = __DIR__ . '/../MEDIA/course_files/' . $filePath;

if (!file_exists($fullPath) || !is_file($fullPath)) {
    header('Content-Type: application/json');
    http_response_code(404);
    echo json_encode(["error" => "File not found."]);
    exit();
}

// If we get here, we're sending a file
// Set CORS headers first
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the actual MIME type of the file
$fileInfo = mime_content_type($fullPath);

// Set file-related headers
header('Content-Type: ' . $fileInfo);
header('X-Content-Type-Options: nosniff');
header('Content-Disposition: inline; filename="' . $filePath . '"');
header('Content-Length: ' . filesize($fullPath));
header('Cache-Control: public, max-age=3600');

// Disable output buffering
if (ob_get_level())
    ob_end_clean();

// Send the file
readfile($fullPath);
exit();