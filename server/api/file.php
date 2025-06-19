<?php
// Set CORS headers first (before any other output)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}

// Check if file parameter exists
if (!isset($_GET['file']) || empty($_GET['file'])) {
  header('Content-Type: application/json');
  http_response_code(400);
  echo json_encode(["error" => "File parameter is required."]);
  exit();
}

$filePath = basename($_GET['file']);
$fullPath = __DIR__ . '/../MEDIA/course_files/' . $filePath;

// Validate file exists and is actually a file
if (!file_exists($fullPath) || !is_file($fullPath)) {
  header('Content-Type: application/json');
  http_response_code(404);
  echo json_encode(["error" => "File not found."]);
  exit();
}

// Additional security check - prevent directory traversal
$realPath = realpath($fullPath);
$basePath = realpath(__DIR__ . '/../MEDIA/course_files/');
if (strpos($realPath, $basePath) !== 0) {
  header('Content-Type: application/json');
  http_response_code(403);
  echo json_encode(["error" => "Access denied."]);
  exit();
}

// Get the actual MIME type of the file
$fileInfo = mime_content_type($fullPath);
if ($fileInfo === false) {
  // Fallback MIME type detection
  $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
  $mimeTypes = [
    'pdf' => 'application/pdf',
    'doc' => 'application/msword',
    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls' => 'application/vnd.ms-excel',
    'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt' => 'application/vnd.ms-powerpoint',
    'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt' => 'text/plain',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png' => 'image/png',
    'gif' => 'image/gif',
    'mp4' => 'video/mp4',
    'mp3' => 'audio/mpeg'
  ];
  $fileInfo = $mimeTypes[$extension] ?? 'application/octet-stream';
}

// Set file-related headers
header('Content-Type: ' . $fileInfo);
header('X-Content-Type-Options: nosniff');
header('Content-Disposition: inline; filename="' . basename($filePath) . '"');
header('Content-Length: ' . filesize($fullPath));
header('Cache-Control: public, max-age=3600');

// Disable output buffering
while (ob_get_level()) {
  ob_end_clean();
}

// Send the file
readfile($fullPath);
exit();
?>

